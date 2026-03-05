import api from './axiosInstance'
import { GetMemosResponse } from '../response/GetMemosResponse'
import { PostCreateMemoRequest } from '../request/PostCreateMemoRequest'
import { PatchUpdateMemoRequest } from '../request/PatchUpdateMemoRequest'

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

  async createMemo(request: PostCreateMemoRequest) {
    try {
      const response = await api.post('/memos', request)
      return response.data
    } catch (error) {
      console.error('Error adding memo:', error)
    }
  }

  async updateMemo(request: UpdateMemoRequest) {
    try {
      const response = await api.put(`/memos`, request)
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
