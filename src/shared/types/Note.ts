export type NoteType = 'todo' | 'memo'

export interface Note {
  id: number
  text: string
  completed: boolean
  type: NoteType
  createdAt?: string
}
