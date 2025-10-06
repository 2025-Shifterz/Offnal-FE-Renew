import { Memo } from '../../../store/useMemoStore'
import { GetMemosResponse } from '../response/GetMemosResponse'
import api from './axiosInstance'

export class MemoService {
  async getMemos(filter: string, organizationId: number) {
    try {
      const response = await api.get<GetMemosResponse>(
        `/memos?filter=${filter}&organizationId=${organizationId}`
      )
      return response.data.result
    } catch (error) {
      console.error('Error fetching memos:', error)
      return []
    }
  }

  async createMemo(memo: Memo) {
    try {
      const response = await api.post('/memos', memo)
      return response.data
    } catch (error) {
      console.error('Error adding memo:', error)
    }
  }

  async updateMemo(memo: Memo) {
    try {
      const response = await api.put(`/memos`, memo)
      return response.data
    } catch (error) {
      console.error('Error updating memo:', error)
    }
  }

  async deleteMemo(memoId: number) {
    try {
      const response = await api.delete(`/memos/${memoId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting memo:', error)
    }
  }
}
