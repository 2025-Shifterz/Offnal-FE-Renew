import {
  getRoutineIllustration,
  routineIllustrationByCategory,
} from '../../../../src/shared/components/routine/routineIllustrationMap'

describe('routineIllustrationMap', () => {
  it('maps each routine category to a fixed illustration', () => {
    expect(routineIllustrationByCategory).toEqual({
      sleep: 'bed',
      meal: 'food',
      rest: 'rest',
      snack: 'snack',
      working: 'working',
      hydration: 'water',
      exercise: 'fire',
      readyForWork: 'readyforwork',
    })
  })

  it('resolves routine illustrations through the helper', () => {
    expect(getRoutineIllustration('sleep')).toBe('bed')
    expect(getRoutineIllustration('meal')).toBe('food')
    expect(getRoutineIllustration('rest')).toBe('rest')
    expect(getRoutineIllustration('snack')).toBe('snack')
    expect(getRoutineIllustration('working')).toBe('working')
    expect(getRoutineIllustration('hydration')).toBe('water')
    expect(getRoutineIllustration('exercise')).toBe('fire')
    expect(getRoutineIllustration('readyForWork')).toBe('readyforwork')
  })
})
