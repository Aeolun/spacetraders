export class StrategySettings {
  static MULTISYSTEM = false
  static CURRENT_CREDITS = 0
  static USE_WARP = false
  static MAX_SATELLITES = 26
  // max haulers of 2 means a ship can be assigned to keep transporting the same stuff back and forth
  static MAX_HAULERS_PER_SPOT = 2
  static MAX_HAULERS = 16
  static MAX_MINING_DRONES = 16
  static MAX_SURVEYORS = 4
  static MAX_SIPHONERS = 8
  static FINANCIAL_BUFFER = 1_000_000
  static MIN_CAPITAL_FOR_CONSTRUCTION = 5_000_000
  static SPEED_FACTOR = process.env.SPEED_FACTOR ? parseInt(process.env.SPEED_FACTOR) : 1
}