import { GetMemosResponse } from '../response/GetMemosResponse'
import { PostCreateMemoRequest } from '../request/PostCreateMemoRequest'
import { PatchUpdateMemoRequest } from '../request/PatchUpdateMemoRequest'
import { apiAxiosClient } from '../axios/createAxiosClient'

export class MemoService {
  async getMemos(filter: string, organizationId: number) {
    try {
      const response = await apiAxiosClient.get<GetMemosResponse>(
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
      const response = await apiAxiosClient.post('/memos', request)
      return response.data
    } catch (error) {
      console.error('Error adding memo:', error)
    }
  }

  async updateMemo(request: PatchUpdateMemoRequest) {
    try {
      const response = await apiAxiosClient.put(`/memos`, request)
      return response.data
    } catch (error) {
      console.error('Error updating memo:', error)
    }
  }

  async deleteMemo(memoId: number) {
    try {
      const response = await apiAxiosClient.delete(`/memos/${memoId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting memo:', error)
    }
  }
}
