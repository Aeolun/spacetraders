export const validateEngineSpeed = (speed: number): speed is 3 | 10 | 30 => {
  if (![3, 10, 30].includes(speed)) {
    throw new Error(`Invalid engine speed: ${speed}`)
  }
  return true
}