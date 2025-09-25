import NoteDayBox from '../../../src/presentation/Note/components/NoteDayBox'
import { fireEvent, render } from '@testing-library/react-native'
import { TodoType } from '../../../src/domain/entities/Todo'

describe('할일 추가/완료/삭제', () => {
  const mockHandleAddTodo = jest.fn()
  const mockSetNewTodoText = jest.fn()
  const mockHandleCompleted = jest.fn()
  const mockHandleDeleteTodo = jest.fn()

  const todos = [
    {
      id: 1,
      text: 'Test Todo',
      completed: false,
      type: 'todo' as TodoType,
      createdAt: new Date().toISOString(),
    },
  ]

  const defaultProps = {
    text: '할 일',
    type: 'todo',
    todos: todos,
    newTodoText: '',
    setNewTodoText: mockSetNewTodoText,
    handleAddTodo: mockHandleAddTodo,
    handleCompleted: mockHandleCompleted,
    handleDeleteTodo: mockHandleDeleteTodo,
    showInput: true, // 직접 true로 줘서 Input과 확인 버튼 렌더링
  }

  it('할 일 추가 후 UI가 렌더링되는지', () => {
    const { getByText, rerender } = render(
      <NoteDayBox {...defaultProps} todos={[]} /> // 빈 todos
    )

    // 새로운 할 일 추가 시 handleAddTodo 호출
    fireEvent.press(getByText('확인'))
    expect(mockHandleAddTodo).toHaveBeenCalled()

    // 부모에서 todos 업데이트 후 rerender
    rerender(<NoteDayBox {...defaultProps} />)

    // 화면에 새로운 할 일이 렌더링되는지 확인
    expect(getByText('Test Todo')).toBeTruthy()
  })

  it('할 일 완료 시 handleCompleted가 호출되는지', () => {
    const { getByTestId } = render(<NoteDayBox {...defaultProps} />)

    const checkbox = getByTestId('todo-checkbox-1') // testID 추가
    fireEvent.press(checkbox)
    expect(mockHandleCompleted).toHaveBeenCalledWith(1, false, 'todo')
  })

  it('할 일 삭제 시 handleDeleteTodo가 호출되는지', () => {
    const { getByText } = render(<NoteDayBox {...defaultProps} />)

    fireEvent.press(getByText('삭제')) // 삭제 버튼 클릭
    expect(mockHandleDeleteTodo).toHaveBeenCalledWith(1, 'todo')
  })
})
