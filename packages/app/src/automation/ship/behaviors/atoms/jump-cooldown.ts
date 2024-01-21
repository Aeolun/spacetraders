export const jumpCooldown = (distance: number) => {
  return Math.max(Math.ceil(distance / 10), 60)
}