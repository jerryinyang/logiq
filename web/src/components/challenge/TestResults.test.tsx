import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TestResults } from '@/components/challenge/TestResults'
import type { TestResult } from '@/types/execution-types'

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      if (prop === 'div') {
        return ({ children, ...props }: any) => <div {...props}>{children}</div>
      }
      return ({ children, ...props }: any) => {
        const { initial, animate, exit, transition, ...rest } = props
        return <div {...rest}>{children}</div>
      }
    },
  }),
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('TestResults', () => {
  const passingResults: TestResult[] = [
    { testCaseId: 'tc-1', passed: true, input: [3, 1, 2], expected: [1, 2, 3], actual: [1, 2, 3] },
    { testCaseId: 'tc-2', passed: true, input: [5, 4, 3], expected: [3, 4, 5], actual: [3, 4, 5] },
  ]

  const failingResults: TestResult[] = [
    { testCaseId: 'tc-1', passed: true, input: [3, 1, 2], expected: [1, 2, 3], actual: [1, 2, 3] },
    { testCaseId: 'tc-2', passed: false, input: [5, 4, 3], expected: [3, 4, 5], actual: [5, 4, 3], errorStep: 1 },
  ]

  const edgeCaseResult: TestResult[] = [
    { testCaseId: 'tc-edge', passed: false, input: [], expected: [], actual: null, errorStep: 0, isEdgeCase: true },
  ]

  it('shows success message when all tests pass', () => {
    render(<TestResults results={passingResults} onClose={vi.fn()} />)
    expect(screen.getByText('All test cases passed')).toBeInTheDocument()
    expect(screen.getByText('2 passed')).toBeInTheDocument()
  })

  it('shows failure message when some tests fail', () => {
    render(<TestResults results={failingResults} onClose={vi.fn()} />)
    expect(screen.getByText('Some tests failed')).toBeInTheDocument()
    expect(screen.getByText('1 passed')).toBeInTheDocument()
    expect(screen.getByText('1 failed')).toBeInTheDocument()
  })

  it('displays test case IDs in accordion', () => {
    render(<TestResults results={failingResults} onClose={vi.fn()} />)
    expect(screen.getByText(/Test Case tc-1/)).toBeInTheDocument()
    expect(screen.getByText(/Test Case tc-2/)).toBeInTheDocument()
  })

  it('shows edge case badge for edge case tests', () => {
    render(<TestResults results={edgeCaseResult} onClose={vi.fn()} />)
    expect(screen.getByText('edge case')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<TestResults results={passingResults} onClose={onClose} />)
    const closeButton = screen.getByRole('button', { name: /close results/i })
    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('renders test result structure', () => {
    render(<TestResults results={failingResults} onClose={vi.fn()} />)
    expect(screen.getByText('Some tests failed')).toBeInTheDocument()
  })
})