import type { Horse } from '@/types'

export function calculateDistanceSuitability(horse: Horse, distance: number): number {
  const hashCode = horse.id
    .toString()
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const optimalDistance = 1200 + (hashCode % 1100)
  const deviation = Math.abs(distance - optimalDistance)
  const suitability = Math.max(0.7, 1 - deviation / 2000)

  return suitability
}

export function calculateHorseSpeed(horse: Horse, distance: number): number {
  const baseSpeed = (horse.condition / 100) * 45
  const distanceModifier = calculateDistanceSuitability(horse, distance)

  const randomFactor = 0.85 + Math.random() * 0.3

  let finalSpeed = baseSpeed * distanceModifier * randomFactor
  const minSpeed = 24
  if (finalSpeed < minSpeed) {
    finalSpeed = minSpeed + Math.random() * 2
  }

  return finalSpeed
}

export function calculateProgressIncrement(
  speed: number,
  distance: number,
  deltaTime: number,
): number {
  const progressPerSecond = (speed / distance) * 10
  const progressIncrement = (progressPerSecond * deltaTime) / 1000

  return progressIncrement
}

export function calculatePoints(position: number): number {
  const pointsMap: Record<number, number> = {
    1: 10,
    2: 8,
    3: 6,
    4: 5,
    5: 4,
    6: 3,
    7: 2,
    8: 1,
    9: 1,
    10: 1,
  }

  return pointsMap[position] || 0
}

export function applyFatigue(condition: number, fatigueMultiplier: number = 0.95): number {
  const newCondition = Math.floor(condition * fatigueMultiplier)
  return Math.max(1, newCondition)
}
