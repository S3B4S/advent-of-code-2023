import { parseInputLines } from "@/utils/parsing"

export const solvePart1 = (input: string) => {
  const [timeLine, distanceLine] = parseInputLines(input)
  const times = timeLine.split(":")[1].split(' ').filter(x => x !== "" && x !== " ").map(x => Number(x))
  const distances = distanceLine.split(":")[1].split(' ').filter(x => x !== "" && x !== " ").map(x => Number(x))
  const pairs = zip(times, distances)
  const counts = pairs.map(race => {
    const [time, distance] = race
    let count = 0
    for (let i = 0; i <= time; i++) {
      if (formula(i, time) > distance) {
        count++
      }
    }
    return count
  })
  return counts.reduce((a, b) => a * b, 1)
}

export const solvePart2 = (input: string) => {
  return 0
}

const zip = (xs: any[], ys: any[]) => xs.map((x, i) => [x, ys[i]])

/**
 * Calculates how far the boat will go in the remaining time
 * given the time to press the button
 * @param pressingTime 
 * @param totalTime 
 */
const formula = (pressingTime: number, totalTime: number) => {
  // console.log(pressingTime, totalTime)
  const movingSpeed = pressingTime
  const remainingTime = totalTime - pressingTime
  return movingSpeed * remainingTime
}