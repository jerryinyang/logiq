import type { SerializedBlockConfig } from '@/types/execution-types'
import type { ExecutionStep, ExecutionReport } from '@/types/execution-types'
import type { BlockType } from '@/types/canvas-types'

type ExecutionScope = Map<string, unknown>

interface InterpretationResult {
  output: unknown
  steps: ExecutionStep[]
}

function createStep(
  stepIndex: number,
  blockId: string,
  blockType: BlockType,
  input: unknown,
  output: unknown,
  status: ExecutionStep['status'],
  duration: number,
  errorMessage?: string
): ExecutionStep {
  return { stepIndex, blockId, blockType, input, output, status, duration, errorMessage }
}

function executeLoop(
  block: SerializedBlockConfig,
  configMap: Map<string, SerializedBlockConfig>,
  scope: ExecutionScope,
  steps: ExecutionStep[],
  stepCounter: { value: number },
  executedBlocks: Set<string>
): { output: unknown; error?: string } {
  const items = resolveValue(block.config.items, scope)
  const childBlockIds = block.connections.output

  if (!Array.isArray(items)) {
    return { output: [], error: 'Loop block requires an array input' }
  }

  if (childBlockIds.length === 0) {
    return { output: [] }
  }

  const results: unknown[] = []

  for (const item of items) {
    scope.set(`${block.id}_currentItem`, item)
    scope.set(`${block.id}_index`, results.length)

    for (const childId of childBlockIds) {
      const childBlock = configMap.get(childId)
      if (!childBlock) continue

      executedBlocks.add(childId)
      const childResult = executeBlock(childBlock, configMap, scope, steps, stepCounter, executedBlocks)
      if (childResult.error) {
        return { output: results, error: childResult.error }
      }

      if (childBlock.type === 'return') {
        return { output: childResult.output }
      }
    }

    const lastChildId = childBlockIds[childBlockIds.length - 1]
    const lastChildOutput = scope.get(`${lastChildId}_output`)
    if (lastChildOutput !== undefined) {
      results.push(lastChildOutput)
    }
  }

  return { output: results }
}

function executeCondition(
  block: SerializedBlockConfig,
  configMap: Map<string, SerializedBlockConfig>,
  scope: ExecutionScope,
  steps: ExecutionStep[],
  stepCounter: { value: number },
  executedBlocks: Set<string>
): { output: unknown; error?: string } {
  const conditionValue = resolveValue(block.config.condition, scope)
  const isTrue = Boolean(conditionValue)

  scope.set(`${block.id}_result`, isTrue)

  const nextBlockIds = isTrue
    ? (block.config.truePath as string[] | undefined) ?? block.connections.output
    : (block.config.falsePath as string[] | undefined) ?? block.connections.output

  for (const childId of nextBlockIds) {
    const childBlock = configMap.get(childId)
    if (!childBlock) continue

    executedBlocks.add(childId)
    const childResult = executeBlock(childBlock, configMap, scope, steps, stepCounter, executedBlocks)
    if (childResult.error) {
      return { output: isTrue, error: childResult.error }
    }

    if (childBlock.type === 'return') {
      return { output: childResult.output }
    }
  }

  return { output: isTrue }
}

function executeComparison(
  block: SerializedBlockConfig,
  scope: ExecutionScope
): { output: boolean; error?: string } {
  const left = resolveValue(block.config.left, scope)
  const right = resolveValue(block.config.right, scope)
  const operator = block.config.operator as string ?? block.config.label as string

  let result: boolean

  switch (operator) {
    case 'Equal To':
    case 'equalTo':
      result = left === right
      break
    case 'Greater Than':
    case 'greaterThan':
      result = typeof left === 'number' && typeof right === 'number' && left > right
      break
    case 'Less Than':
    case 'lessThan':
      result = typeof left === 'number' && typeof right === 'number' && left < right
      break
    case 'Contains':
    case 'contains':
      result = Array.isArray(left) && left.includes(right)
      break
    default:
      result = left === right
  }

  scope.set(`${block.id}_result`, result)
  return { output: result }
}

function executeVariable(
  block: SerializedBlockConfig,
  scope: ExecutionScope
): { output: unknown; error?: string } {
  const variableName = block.config.variableName as string
  const variableValue = block.config.value

  if (!variableName) {
    return { output: undefined, error: 'Variable block requires a variable name' }
  }

  const action = block.config.action as string ?? 'set'

  if (action === 'get' || block.config.label === 'Get Variable') {
    const value = scope.get(variableName)
    scope.set(`${block.id}_output`, value)
    return { output: value }
  }

  if (action === 'increment' || block.config.label === 'Increment Variable') {
    const current = scope.get(variableName)
    if (current !== undefined && typeof current !== 'number') {
      return { output: undefined, error: `Cannot increment non-numeric variable '${variableName}'` }
    }
    const incrementBy = (typeof variableValue === 'number' ? variableValue : 1)
    const newValue = ((current as number | undefined) ?? 0) + incrementBy
    scope.set(variableName, newValue)
    scope.set(`${block.id}_output`, newValue)
    return { output: newValue }
  }

  const resolvedValue = resolveValue(variableValue, scope)
  scope.set(variableName, resolvedValue)
  scope.set(`${block.id}_output`, resolvedValue)
  return { output: resolvedValue }
}

function executeAssignment(
  block: SerializedBlockConfig,
  scope: ExecutionScope
): { output: unknown; error?: string } {
  const label = block.config.label as string

  if (label === 'Return Result' || block.config.isReturn === true) {
    const value = resolveValue(block.config.value, scope)
    scope.set(`${block.id}_output`, value)
    return { output: value }
  }

  if (label === 'Store in Collection') {
    const collectionName = block.config.collectionName as string
    const value = resolveValue(block.config.value, scope)
    if (!collectionName) {
      return { output: undefined, error: 'Store in Collection requires a collection name' }
    }
    const collection = (scope.get(collectionName) as unknown[]) ?? []
    collection.push(value)
    scope.set(collectionName, collection)
    scope.set(`${block.id}_output`, collection)
    return { output: collection }
  }

  const targetName = block.config.target as string
  const value = resolveValue(block.config.value, scope)

  if (targetName) {
    scope.set(targetName, value)
  }
  scope.set(`${block.id}_output`, value)
  return { output: value }
}

function executeReturn(
  block: SerializedBlockConfig,
  scope: ExecutionScope
): { output: unknown } {
  const value = resolveValue(block.config.value, scope)
  scope.set(`${block.id}_output`, value)
  return { output: value }
}

function executeEdgeCase(
  block: SerializedBlockConfig,
  scope: ExecutionScope
): { output: unknown; earlyReturn: boolean; error?: string } {
  const condition = block.config.condition as string
  const inputValue = resolveValue(block.config.input, scope)

  let conditionMet = false

  switch (condition) {
    case 'emptyInput':
      conditionMet = inputValue === null || inputValue === undefined || (Array.isArray(inputValue) && inputValue.length === 0) || (typeof inputValue === 'string' && inputValue.length === 0)
      break
    case 'singleElement':
      conditionMet = Array.isArray(inputValue) && inputValue.length === 1
      break
    case 'alreadySorted':
      if (Array.isArray(inputValue)) {
        conditionMet = inputValue.every((val, i, arr) => i === 0 || arr[i - 1] <= val)
      }
      break
    case 'duplicates':
      if (Array.isArray(inputValue)) {
        conditionMet = new Set(inputValue).size < inputValue.length
      }
      break
    case 'maxValue':
      conditionMet = inputValue === Number.MAX_SAFE_INTEGER || inputValue === Infinity
      break
    default:
      conditionMet = false
  }

  scope.set(`${block.id}_result`, conditionMet)

  if (conditionMet) {
    const returnValue = resolveValue(block.config.returnValue, scope)
    scope.set(`${block.id}_output`, returnValue ?? inputValue)
    return { output: returnValue ?? inputValue, earlyReturn: true }
  }

  return { output: conditionMet, earlyReturn: false }
}

function resolveValue(value: unknown, scope: ExecutionScope): unknown {
  if (typeof value === 'string' && value.startsWith('$')) {
    const varName = value.slice(1)
    return scope.get(varName)
  }
  return value
}

function executeBlock(
  block: SerializedBlockConfig,
  configMap: Map<string, SerializedBlockConfig>,
  scope: ExecutionScope,
  steps: ExecutionStep[],
  stepCounter: { value: number },
  executedBlocks: Set<string>
): { output: unknown; error?: string; earlyReturn?: boolean } {
  const start = performance.now()
  const stepIndex = stepCounter.value++
  const input = captureBlockInput(block, scope)

  steps.push(
    createStep(stepIndex, block.id, block.type, input, undefined, 'executing', 0)
  )

  let result: { output: unknown; error?: string; earlyReturn?: boolean }

  switch (block.type) {
    case 'loop':
      result = executeLoop(block, configMap, scope, steps, stepCounter, executedBlocks)
      break
    case 'condition':
      result = executeCondition(block, configMap, scope, steps, stepCounter, executedBlocks)
      break
    case 'comparison':
      result = executeComparison(block, scope)
      break
    case 'variable':
      result = executeVariable(block, scope)
      break
    case 'assignment': {
      const assignResult = executeAssignment(block, scope)
      if (block.config.label === 'Return Result' || block.config.isReturn === true) {
        result = { ...assignResult, earlyReturn: true }
      } else {
        result = assignResult
      }
      break
    }
    case 'return':
      result = { ...executeReturn(block, scope), earlyReturn: true }
      break
    case 'edgeCase':
      result = executeEdgeCase(block, scope)
      break
    default:
      result = { output: undefined, error: `Unknown block type: ${block.type}` }
  }

  const duration = performance.now() - start
  const status = result.error ? 'error' : 'success'

  const existingStep = steps[steps.length - 1]
  if (existingStep && existingStep.stepIndex === stepIndex) {
    existingStep.output = result.output
    existingStep.status = status
    existingStep.duration = duration
    if (result.error) existingStep.errorMessage = result.error
  } else {
    steps.push(
      createStep(stepIndex, block.id, block.type, input, result.output, status, duration, result.error)
    )
  }

  return result
}

function captureBlockInput(block: SerializedBlockConfig, scope: ExecutionScope): unknown {
  if (block.config.input !== undefined) {
    return resolveValue(block.config.input, scope)
  }
  if (block.type === 'loop') return resolveValue(block.config.items, scope)
  if (block.type === 'comparison') return { left: resolveValue(block.config.left, scope), right: resolveValue(block.config.right, scope) }
  if (block.type === 'variable') {
    const action = block.config.action as string ?? 'set'
    if (action === 'get' || block.config.label === 'Get Variable') {
      return scope.get(block.config.variableName as string)
    }
    return block.config.value
  }
  if (block.type === 'return') return resolveValue(block.config.value, scope)
  if (block.type === 'edgeCase') return resolveValue(block.config.input, scope)
  return block.config.value
}

export function interpretBlockConfig(
  config: SerializedBlockConfig[],
  testInput: unknown
): ExecutionReport {
  const steps: ExecutionStep[] = []
  const stepCounter = { value: 0 }
  const scope: ExecutionScope = new Map<string, unknown>()
  const configMap = new Map(config.map((c) => [c.id, c]))

  scope.set('input', testInput)

  const startTime = performance.now()
  let finalOutput: unknown = undefined
  let hasError = false
  const executedBlocks = new Set<string>()

  for (const block of config) {
    if (executedBlocks.has(block.id)) continue
    executedBlocks.add(block.id)

    const result = executeBlock(block, configMap, scope, steps, stepCounter, executedBlocks)

    if (result.error) {
      hasError = true
      break
    }

    if (result.earlyReturn) {
      finalOutput = result.output
      break
    }

    finalOutput = result.output
  }

  if (!hasError && finalOutput === undefined && steps.length > 0) {
    const lastStep = steps[steps.length - 1]
    finalOutput = lastStep.output
  }

  const totalDuration = performance.now() - startTime

  return {
    steps,
    results: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      duration: totalDuration,
    },
  }
}
