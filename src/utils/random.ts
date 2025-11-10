/**
 * Returns a random integer within a given inclusive range.
 * @param min The minimum value
 * @param max The maximum value
 */
export function getRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Shuffles the elements of an array using the Fisher–Yates algorithm.
 * @param items The array to shuffle
 * @returns A new array with elements in random order
 */
export function shuffleArray<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    const temp = result[i]!
    result[i] = result[randomIndex]!
    result[randomIndex] = temp
  }
  return result
}

/**
 * Selects a specified number of random items from an array.
 * @param items The source array
 * @param count The number of items to select
 * @throws If the count exceeds the array length
 */
export function pickRandomItems<T>(items: T[], count: number): T[] {
  if (count > items.length) {
    throw new Error('Requested count exceeds available items in the array')
  }
  return shuffleArray(items).slice(0, count)
}
