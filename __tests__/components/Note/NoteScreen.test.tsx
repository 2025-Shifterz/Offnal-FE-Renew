import NoteScreen from '../../../src/presentation/Note/screens/NoteScreen'
import { render, waitFor } from '@testing-library/react-native'
import { getTodosUseCase } from '../../../src/infrastructure/di/Dependencies'

jest.mock('../../../src/infrastructure/di/Dependencies')

// NoteScreen에서
// todos 존재에 따라 EmptyPage 렌더링 여부를 검증

describe('EmptyPage 렌더링 여부', () => {
  // mock 함수들의 호출 기록과 상태를 초기화
  // 여러 테스트가 같은 mock을 공유할 때
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('빈 todos이면 <EmptyPage>를 렌더링', async () => {
    ;(getTodosUseCase.execute as jest.Mock).mockResolvedValue([])

    const { getByText } = render(<NoteScreen text="할 일" type="todo" />)

    await waitFor(() => {
      expect(getByText(/아직 등록된/)).toBeTruthy()
    })
  })

  it('채워진 todos이면 <NoteDayBox>를 렌더링', async () => {
    // 1. getTodosUseCase를 todos 반환하도록 mock
    const mockTodos = [
      {
        id: 1,
        text: 'Test Todo',
        completed: false,
        type: 'todo',
        createdAt: new Date().toISOString(),
      },
    ]
    ;(getTodosUseCase.execute as jest.Mock).mockResolvedValue(mockTodos)

    // 2. 렌더링
    const { getByText } = render(<NoteScreen text="할 일" type="todo" />)

    // 3. NoteDayBox 내부 todo 텍스트가 렌더링되는지 확인
    await waitFor(() => {
      expect(getByText('Test Todo')).toBeTruthy()
    })
  })
})
