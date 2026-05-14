import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCanvasAnnouncer } from './use-canvas-announcer'
import { useCanvasStore } from '@/stores/canvas-store'

describe('useCanvasAnnouncer', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    const announcer = document.createElement('div')
    announcer.id = 'logiq-canvas-announcer'
    announcer.setAttribute('aria-live', 'polite')
    announcer.setAttribute('aria-atomic', 'true')
    document.body.appendChild(announcer)
  })

  it('announceConnection announces valid connection', () => {
    const { result } = renderHook(() => useCanvasAnnouncer())
    act(() => {
      result.current.announceConnection('Loop', 'Condition')
    })
    const announcer = document.getElementById('logiq-canvas-announcer')
    expect(announcer?.textContent).toContain('Connected Loop to Condition')
  })

  it('announceRejection announces rejection with reason', () => {
    const { result } = renderHook(() => useCanvasAnnouncer())
    act(() => {
      result.current.announceRejection('Loop', 'Return', 'incompatible types')
    })
    const announcer = document.getElementById('logiq-canvas-announcer')
    expect(announcer?.textContent).toContain('Cannot connect Loop to Return — incompatible types')
  })

  it('announceCycleRejection announces cycle rejection', () => {
    const { result } = renderHook(() => useCanvasAnnouncer())
    act(() => {
      result.current.announceCycleRejection()
    })
    const announcer = document.getElementById('logiq-canvas-announcer')
    expect(announcer?.textContent).toContain('Cannot create circular logic')
  })

  it('announceDirectionError announces direction error', () => {
    const { result } = renderHook(() => useCanvasAnnouncer())
    act(() => {
      result.current.announceDirectionError()
    })
    const announcer = document.getElementById('logiq-canvas-announcer')
    expect(announcer?.textContent).toContain('Cannot connect — must connect output to input')
  })

  it('announceFlow announces ordered flow', () => {
    useCanvasStore.setState({
      nodes: [
        { id: 'n1', type: 'logicBlock', position: { x: 0, y: 0 }, data: { block: { id: 'n1', type: 'loop', label: 'For Each', category: { type: 'loop', label: 'Loop', color: '#0EA5E9' }, description: 'Iterate', connections: { input: [], output: [] } } } },
        { id: 'n2', type: 'logicBlock', position: { x: 100, y: 100 }, data: { block: { id: 'n2', type: 'condition', label: 'If', category: { type: 'condition', label: 'Condition', color: '#F59E0B' }, description: 'Test', connections: { input: [], output: [] } } } },
      ] as any,
      edges: [
        { id: 'e1', source: 'n1', target: 'n2', type: 'blockConnection' } as any,
      ],
    })

    const { result } = renderHook(() => useCanvasAnnouncer())
    act(() => {
      result.current.announceFlow()
    })
    const announcer = document.getElementById('logiq-canvas-announcer')
    expect(announcer?.textContent).toContain('Connected flow')
    expect(announcer?.textContent).toContain('Loop')
    expect(announcer?.textContent).toContain('Condition')
  })
})