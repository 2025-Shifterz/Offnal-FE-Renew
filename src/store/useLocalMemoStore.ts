import dayjs from 'dayjs'
import { Memo } from '../domain/models/Memo'
import { create } from 'zustand'
import {
  addMemoUseCase,
  getMemoByIdUseCase,
  getMemosByDateUseCase,
  memoRepository,
  updateMemoUseCase,
} from '../infrastructure/di/Dependencies'

export interface LocalMemoState {
  memos: Memo[]

  fetchAllMemos: () => Promise<void>

  fetchMemosByDate: (targetDate: dayjs.Dayjs) => Promise<void>

  fetchMemoById: (id: number) => Promise<void>

  addMemo: (title: string, content: string, date: dayjs.Dayjs) => Promise<void>

  updateMemo: (
    id: number,
    title: string,
    content: string,
    date: dayjs.Dayjs
  ) => Promise<void>

  deleteMemo: (id: number) => Promise<void>

  deleteAllMemos: () => Promise<void>
}

export const localMemoStore = create<LocalMemoState>(set => ({
  memos: [],

  fetchAllMemos: async () => {
    const data = await memoRepository.getAllMemos()

    set(() => ({
      memos: data,
    }))
  },

  fetchMemosByDate: async (targetDate: dayjs.Dayjs) => {
    const data = await getMemosByDateUseCase.execute(targetDate)

    set(() => ({
      memos: data,
    }))
  },

  fetchMemoById: async (id: number) => {
    const data = await getMemoByIdUseCase.execute(id)

    if (!data) {
      return
    }

    set(state => {
      const memos = [...state.memos]
      const index = memos.findIndex(memo => memo.id === id)

      if (index !== -1) {
        memos[index] = data
      } else {
        memos.push(data)
      }

      return { memos }
    })
  },

  addMemo: async (title, content, date) => {
    const memo = await addMemoUseCase.execute(title, content, date)

    set(state => ({
      memos: [...state.memos, memo],
    }))
  },

  updateMemo: async (id, title, content, date) => {
    await updateMemoUseCase.execute(id, title, content, date)

    set(state => ({
      memos: state.memos.map(memo => {
        if (memo.id === id) {
          return { ...memo, title, content }
        }
        return memo
      }),
    }))
  },

  deleteMemo: async (id: number) => {
    await memoRepository.deleteMemo(id)

    set(state => ({
      memos: state.memos.filter(memo => memo.id !== id),
    }))
  },

  deleteAllMemos: async () => {
    await memoRepository.deleteMemoAll()

    set(() => ({ memos: [] }))
  },
}))
