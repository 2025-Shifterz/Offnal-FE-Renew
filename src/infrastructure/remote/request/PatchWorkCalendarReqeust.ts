export interface UpdateShiftsRequest {
  shifts: {
    [day: string]: string
  }
}
