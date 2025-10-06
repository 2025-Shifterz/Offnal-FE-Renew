import { create } from 'zustand'
import { memoService } from '../infrastructure/di/Dependencies'

export interface Memo {
  id: number
  content: string
  targetDate: string
  organizationId: number
}

export interface MemoState {
  memos: Memo[]

  // fetch
  fetchMemos: (filter: string, organizationId: number) => Promise<void>
  createMemo: (memo: Memo) => Promise<void>
  updateMemo: (memo: Memo) => Promise<void>
  deleteMemo: (id: number) => Promise<void>
}

export const useMemoStore = create<MemoState>(set => ({
  memos: [],

  fetchMemos: async (filter, organizationId) => {
    const data = await memoService.getMemos(filter, organizationId)
    set(() => ({
      memos: data,
    }))
  },

  createMemo: async memo => {
    const data = await memoService.createMemo(memo)
    set(state => ({ memos: [...state.memos, data] }))
  },

  updateMemo: async (memo: Memo) => {
    const data = await memoService.updateMemo(memo)
    set(state => ({
      memos: state.memos.map(t => (t.id === memo.id ? { ...t, ...data } : t)),
    }))
  },

  deleteMemo: async id => {
    await memoService.deleteMemo(id)
    set(state => ({ memos: state.memos.filter(memo => memo.id !== id) }))
  },
}))
