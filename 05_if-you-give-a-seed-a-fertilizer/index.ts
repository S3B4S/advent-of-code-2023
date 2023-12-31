import { logId } from "@/utils/misc"
import { parseInputBlocks, parseInputLines } from "@/utils/parsing"

export const solvePart1 = (input: string) => {
  const [rawSeeds, ...maps] = parseInputBlocks(input)
  const seeds = rawSeeds[0].split(':')[1].trim().split(' ').map(x => Number(x))

  maps.forEach(map => {
    map.shift()
    const isTransported = seeds.map(_ => false) // Keep track of seeds that have already been transported
    map.forEach(setOfNumbers => {
      const [destRangeStart, sourceRangeStart, rangeLength] = setOfNumbers.split(' ').map(Number)
      seeds.forEach((seed, index) => {
        if (seed <= sourceRangeStart + rangeLength && seed >= sourceRangeStart && !isTransported[index]) {
          const diff = seed - sourceRangeStart
          const dest = destRangeStart + diff
          seeds[index] = dest
          isTransported[index] = true
        } else {
          const dest = seed
          seeds[index] = dest
        }
      })
    })
  })

  return seeds.reduce((acc, seed) => Math.min(acc, seed))
}

const chunksOf2 = (arr: (number)[]) => {
  const result: (number)[][] = []
  for (let i = 0; i < arr.length; i += 2) {
    result.push(arr.slice(i, i + 2))
  }
  return result
}

// An Interval is indicated by a start and endpoint
// [4, 8]: Interval, goes from point 4 to point 8, with length 5
type Interval = [number, number]
// A PointWithRange is indicated by a startpoint and a length
// [4, 8]: PointWithRange, goes from point 4 to 11, with length 8
type PointWithRange = [number, number]

export const solvePart2 = (input: string) => {
  const [rawSeeds, ...maps] = parseInputBlocks(input)
  let seedRanges = chunksOf2(rawSeeds[0].split(':')[1].trim().split(' ').map(x => Number(x)))

  maps.forEach(map => {
    map.shift()
    const seedsNewMap = [] as [number, number][]
    const hasBeenTransformed = seedRanges.map(_ => false)
    map.forEach(setOfNumbers => {
      const [mapDestRangeStart, mapSourceRangeStart, mapRangeLength] = setOfNumbers.split(' ').map(Number)
      const mapSourceRangeEnd = mapSourceRangeStart + mapRangeLength - 1

      seedRanges.forEach((rangeSeed, index) => {
        if (hasBeenTransformed[index]) return

        const [start, range] = rangeSeed
        const end = start + range - 1

        if (mapSourceRangeStart <= start && mapSourceRangeEnd >= end) {
          // Now the entire seedRange has been captured, so everything moves
          const delta = start - mapSourceRangeStart
          
          const newRange: Interval = [delta + mapDestRangeStart, range]
          seedsNewMap.push(newRange)
          hasBeenTransformed[index] = true
        } else if (start < mapSourceRangeStart && mapSourceRangeStart <= end && end < mapSourceRangeEnd) {
          // To split at mapSourceRangeStart
          // start -> mapSourceRangeStart stays the same
          // mapSourceRangeStart -> end will move
          const staysSame: Interval = [start, mapSourceRangeStart - 1]
          const moves: Interval = [mapSourceRangeStart, end]

          const newRange = [mapDestRangeStart, getRangeOfInterval(moves)] as PointWithRange
          seedsNewMap.push(newRange) 
          seedRanges.push([staysSame[0], getRangeOfInterval(staysSame)])
          hasBeenTransformed.push(false)
          hasBeenTransformed[index] = true
        } else if (mapSourceRangeStart < start && start <= mapSourceRangeEnd && mapSourceRangeEnd < end) {
          // start -> mapSourceRangeEnd stays the same
          // mapSourceRangeEnd -> end will be moved
          const moves: Interval = [start, mapSourceRangeEnd]
          const staysSame: Interval = [mapSourceRangeEnd + 1, end]
          const delta = moves[0] - mapSourceRangeStart
          
          const newRange = [mapDestRangeStart + delta, getRangeOfInterval(moves)] as PointWithRange
          seedsNewMap.push(newRange)
          seedRanges.push([staysSame[0], getRangeOfInterval(staysSame)])
          hasBeenTransformed.push(false)
          hasBeenTransformed[index] = true
        } else if (mapSourceRangeEnd <= end && mapSourceRangeStart >= start) {
          // Now it might need to split in 3 parts
          // start -> mapSourceRangeStart stays the same
          // mapSourceRangeStart -> mapSourceRangeEnd will move
          // mapSourceRangeEnd -> end stays the same
          const staysSame: Interval = [start, mapSourceRangeStart - 1]
          const moves: Interval = [mapSourceRangeStart, mapSourceRangeEnd]
          const staysSame2: Interval = [mapSourceRangeEnd + 1, end]

          const newRange = [mapDestRangeStart, getRangeOfInterval(moves)] as PointWithRange
          seedsNewMap.push(newRange)
          hasBeenTransformed[index] = true

          if (getRangeOfInterval(staysSame) !== 0) {
            seedRanges.push([staysSame[0], getRangeOfInterval(staysSame)])
            hasBeenTransformed.push(false)
          }
          if (getRangeOfInterval(staysSame2) !== 0) {
            seedRanges.push([staysSame2[0], getRangeOfInterval(staysSame2)])
            hasBeenTransformed.push(false)
          }

        } else {
          // The two intervals are entirely separate
          // So there's no moving needed
        }
      })
    })
    
    // Anything that has not been moved should be pushed to the new map
    seedRanges.forEach((rangeSeed, index) => {
      if (!hasBeenTransformed[index]) {
        seedsNewMap.push(rangeSeed as [number, number])
      }
    })
    seedRanges = seedsNewMap
  })

  return { seedRanges, minimum: seedRanges.reduce((acc, seed) => Math.min(acc, seed[0]), Infinity)}
}

/**
 * Given a start and end point, get the range
 * 
 * Example: getRangeOfInterval([2, 5]) // -> 4
 * @param start 
 * @param end 
 */
const getRangeOfInterval = (interval: Interval) => interval[1] - interval[0] + 1
