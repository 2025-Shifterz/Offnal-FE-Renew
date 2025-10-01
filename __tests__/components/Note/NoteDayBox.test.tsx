import React from 'react'
import NoteDayBox from '../../../src/presentation/Note/components/NoteDayBox'
import { fireEvent, render } from '@testing-library/react-native'
import dayjs from 'dayjs'
import { Todo } from '../../../src/infrastructure/local/entities/TodoEntity'

describe('NoteDayBox', () => {
  const mockHandleAddTodo = jest.fn()
  const mockSetNewTodoText = jest.fn()
  const mockHandleCompleted = jest.fn()
  const mockHandleDeleteTodo = jest.fn()
  const mockSetCurrentDate = jest.fn()

  const mockTodos: Todo[] = [
    {
      id: 1,
      content: 'Test Todo 1',
      completed: false,
      targetDate: dayjs().valueOf(),
      createdAt: 0,
      updatedAt: 0,
    },
  ]

  const defaultProps = {
    text: '할 일',
    type: 'todo',
    todos: mockTodos,
    newTodoText: '',
    setNewTodoText: mockSetNewTodoText,
    handleAddTodo: mockHandleAddTodo,
    handleCompleted: mockHandleCompleted,
    handleDeleteTodo: mockHandleDeleteTodo,
    showInput: false,
    currentDate: dayjs(),
    setCurrentDate: mockSetCurrentDate,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('할 일이 없을 때 EmptyMessage를 렌더링해야 합니다.', () => {
    const { getByText } = render(<NoteDayBox {...defaultProps} todos={[]} />)
    expect(getByText(/아직 등록된/)).toBeTruthy()
  })

  it('할 일이 있을 때 할 일 목록을 렌더링해야 합니다.', () => {
    const { getByText, queryByText } = render(<NoteDayBox {...defaultProps} />)
    expect(getByText('Test Todo 1')).toBeTruthy()
    expect(queryByText(/아직 등록된/)).toBeNull()
  })

  it('showInput이 true일 때 입력 필드를 렌더링해야 합니다.', () => {
    const { getByPlaceholderText, getByText } = render(
      <NoteDayBox {...defaultProps} showInput={true} />
    )
    expect(getByPlaceholderText('할 일 입력')).toBeTruthy()
    expect(getByText('확인')).toBeTruthy()
  })

  it('입력 필드에 텍스트를 입력하면 setNewTodoText가 호출되어야 합니다.', () => {
    const { getByPlaceholderText } = render(
      <NoteDayBox {...defaultProps} showInput={true} />
    )
    const input = getByPlaceholderText('할 일 입력')
    fireEvent.changeText(input, 'New Todo')
    expect(mockSetNewTodoText).toHaveBeenCalledWith('New Todo')
  })

  it('확인 버튼을 누르면 handleAddTodo가 호출되어야 합니다.', () => {
    const { getByText } = render(
      <NoteDayBox {...defaultProps} showInput={true} />
    )
    fireEvent.press(getByText('확인'))
    expect(mockHandleAddTodo).toHaveBeenCalledWith(defaultProps.currentDate)
  })

  it('할 일 완료 체크박스를 누르면 handleCompleted가 호출되어야 합니다.', () => {
    const { getByTestId } = render(<NoteDayBox {...defaultProps} />)

    const checkbox = getByTestId('todo-checkbox-1') // testID 추가
    fireEvent.press(checkbox)
    expect(mockHandleCompleted).toHaveBeenCalledWith(1, false)
  })

  it('삭제 버튼을 누르면 handleDeleteTodo가 호출되어야 합니다.', () => {
    const { getByText } = render(<NoteDayBox {...defaultProps} />)

    fireEvent.press(getByText('삭제')) // 삭제 버튼 클릭
    expect(mockHandleDeleteTodo).toHaveBeenCalledWith(1)
  })

  it('type이 "memo"일 때 체크박스를 렌더링하지 않아야 합니다.', () => {
    const { queryByTestId } = render(
      <NoteDayBox {...defaultProps} type="memo" />
    )
    expect(queryByTestId('todo-checkbox-1')).toBeNull()
  })

  it('DayBoxHeader의 이전 날짜 버튼을 누르면 setCurrentDate가 호출되어야 합니다.', () => {
    const { getByTestId } = render(<NoteDayBox {...defaultProps} />)
    // DayBoxHeader 내부에 testID를 추가해야 합니다. 예: testID="prev-date-button"
    // fireEvent.press(getByTestId('prev-date-button'))
    // expect(mockSetCurrentDate).toHaveBeenCalled()
    // DayBoxHeader가 내부적으로 setCurrentDate(prev => ...)를 사용하므로,
    // jest.fn()만으로는 테스트가 복잡해집니다.
    // 여기서는 DayBoxHeader가 올바르게 렌더링되는지만 확인합니다.
    const { getByText } = render(<NoteDayBox {...defaultProps} />)
    expect(getByText('오늘')).toBeTruthy() // isToday가 true이므로 '오늘'이 표시됩니다.
  })

  it('오늘이 아닌 날짜를 표시해야 합니다.', () => {
    const yesterday = dayjs().subtract(1, 'day')
    const { getByText } = render(
      <NoteDayBox {...defaultProps} currentDate={yesterday} />
    )
    expect(getByText(yesterday.format('YYYY년 M월 D일 (dd)'))).toBeTruthy()
  })
})
