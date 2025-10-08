import { Health } from './Health'
import { Meal } from './Meal'

export interface Routine {
  meals: Meal[]
  health: Health
}
