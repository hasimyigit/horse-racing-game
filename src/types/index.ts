export interface Horse {
  id: number
  name: string
  color: string
  condition: number
  currentSpeed?: number
  position?: number
}

export interface RaceRound {
  roundNumber: number
  distance: number
  participants: Horse[]
  status: RoundStatus
  startTime?: number
  endTime?: number
  results: RaceResult[]
}

export interface RaceResult {
  roundNumber: number
  horseId: string
  position: number
  completionTime: number
  finalSpeed: number
  points: number
}

export interface HorsePosition {
  horseId: number
  finishTimeMs: number
}

export interface Rankings {
  horseId: string
  horseName: string
  horseColor: string
  totalPoints: number
  racesParticipated: number
  averagePosition: number
  bestPosition: number
  positions: number[]
}

export interface RoundResult {
  roundNumber: number
  positions: HorsePosition[]
}

export interface RaceProgress {
  horseId: string
  progress: number
  speed: number
  finished: boolean
  finishTime?: number
  realElapsedTime?: number | null
  expectedFinishTime?: number

  viewerFinishTime?: number | null

  variance?: VarianceProfile
  position?: number
}

export interface VarianceProfile {
  staminaDecay: number
  surgeAmp: number
  phase: number
}

export enum RaceStatus {
  Idle = 'IDLE',
  ScheduleReady = 'SCHEDULE_READY',
  RaceInProgress = 'RACE_IN_PROGRESS',
  RaceCompleted = 'RACE_COMPLETED',
  AllRacesCompleted = 'ALL_RACES_COMPLETED',
}

export enum RoundStatus {
  Pending = 'PENDING',
  InProgress = 'IN_PROGRESS',
  Completed = 'COMPLETED',
}
