export const HORSE_NAMES = [
  'Crimson Comet',
  'Shadow Dancer',
  'Blazing Nova',
  'Iron Hoof',
  'Golden Horizon',
  'Storm Whisper',
  'Velvet Thunder',
  'Silent Arrow',
  'Majestic Flame',
  'Lunar Mirage',
  'Steel Tempest',
  'Emerald Wind',
  'Scarlet Phantom',
  'Blue Inferno',
  'Rapid Echo',
  'Obsidian Sky',
  'Frozen Valor',
  'Wildfire Soul',
  'Silver Phantom',
  'Solar Blade',
] as const

export const HORSE_COLORS = [
  '#E63946',
  '#2A9D8F',
  '#457B9D',
  '#F4A261',
  '#A8DADC',
  '#1D3557',
  '#F72585',
  '#B5179E',
  '#7209B7',
  '#3A0CA3',
  '#4CC9F0',
  '#FFBE0B',
  '#FB5607',
  '#FF006E',
  '#8338EC',
  '#3A86FF',
  '#06D6A0',
  '#EF476F',
  '#118AB2',
  '#073B4C',
] as const

export const MIN_HORSES = 1
export const MAX_HORSES = 20
export const MIN_HORSES_FOR_RACE = 10

export const HORSES_PER_RACE = 10
export const TOTAL_ROUNDS = 6

export const ROUND_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200] as const

export const MAX_SPEED = 100
export const MIN_CONDITION = 1
export const MAX_CONDITION = 100

export const POSITION_POINTS = [10, 8, 6, 5, 4, 3, 2, 1, 1, 1] as const

export const ANIMATION_FPS = 60
export const FRAME_DURATION = 1000 / ANIMATION_FPS

export const CONDITION_WEIGHT = 0.4
export const RANDOM_FACTOR_MIN = 0.8
export const RANDOM_FACTOR_MAX = 1.2
export const FATIGUE_FACTOR = 0.95

export const REST_RECOVERY_MIN = 2
export const REST_RECOVERY_MAX = 6
