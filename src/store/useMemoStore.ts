import { create } from 'zustand'
import api from '../infrastructure/remote/api/axiosInstance'

export interface Memo {
  id: number
  content: string
  targetDate: number
  organizationId: number
}

export interface MemoState {
  memos: Memo[]

  // fetch
  fetchMemos: (filter: string, organizationId: number) => Promise<void>
  addMemo: (memo: Memo) => void
  updateMemo: (id: number, updatedFields: Partial<Memo>) => void
  deleteMemo: (id: number) => void
}

export const useMemoStore = create<MemoState>(set => ({
  memos: [],

  addMemo: async memo => {
    try {
      const response = await api.post('/memos', memo)
      console.log('Memo added successfully:', response.data)
      set(state => ({ memos: [...state.memos, memo] }))
    } catch (error) {
      console.error('Error adding memo:', error)
    }
  },

  // content, targetDate 필요한 필드만 업데이트
  updateMemo: async (id, updatedFields) => {
    const existingMemo = useMemoStore
      .getState()
      .memos.find(memo => memo.id === id)
    if (!existingMemo) {
      console.error(`Memo with id ${id} not found.`)
      return
    }
    // 수정된 하나의 memo 객체
    const fullUpdatedMemo = { ...existingMemo, ...updatedFields }

    try {
      const response = await api.patch(`/memos`, fullUpdatedMemo)
      console.log('Memo updated successfully:', response.data)
      set(state => ({
        memos: state.memos.map(memo =>
          memo.id === id ? fullUpdatedMemo : memo
        ),
      }))
    } catch (error) {
      console.error('Error updating memo:', error)
    }
  },

  deleteMemo: async id => {
    try {
      await api.delete(`/memos/${id}`)
      set(state => ({
        memos: state.memos.filter(memo => memo.id !== id),
      }))
      console.log('Memo deleted successfully')
    } catch (error) {
      console.error('Error deleting memo:', error)
    }
  },

  // 서버에서 메모 리스트 불러오기
  fetchMemos: async (filter, organizationId) => {
    try {
      const response = await api.get(
        `/memos?filter=${filter}&organizationId=${organizationId}`
      )
      console.log('Fetched memos successfully:', response.data)
      set({ memos: response.data.result })
    } catch (error) {
      console.error('Error fetching memos:', error)
    }
  },
}))
