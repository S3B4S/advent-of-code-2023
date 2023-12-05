import { logId } from "@/utils/misc"
import { parseInputBlocks, parseInputLines } from "@/utils/parsing"

export const solvePart1 = (input: string) => {
  const [rawSeeds, ...maps] = parseInputBlocks(input)
  const [seedToSoilMap, soilToFertMap, fertToWaterMap, waterToLightMap, lightToTempMap, tempToHumMap, humToLocationMap] = maps
  const seeds = rawSeeds[0].split(':')[1].trim().split(' ').map(x => Number(x))

  maps.forEach(map => {
    map.shift()
    // console.log('====')
    // console.log(map)
    const isTransported = seeds.map(_ => false) // Keep track of seeds that have already been transported
    map.forEach(setOfNumbers => {
      const [destRangeStart, sourceRangeStart, rangeLength] = setOfNumbers.split(' ').map(Number)
      seeds.forEach((seed, index) => {
        if (seed <= sourceRangeStart + rangeLength && seed >= sourceRangeStart && !isTransported[index]) {
          const diff = seed - sourceRangeStart
          const dest = destRangeStart + diff
          // console.log(seeds)
          // console.log(isTransported)
          seeds[index] = dest
          isTransported[index] = true
          // console.log(seed, dest)
        } else {
          const dest = seed
          seeds[index] = dest
          // console.log(seed, dest)
        }
      })
    })
    // console.log(seeds)
  })
  // console.log(seeds)

  return seeds.reduce((acc, seed) => Math.min(acc, seed), Infinity)
}

const chunksOf2 = (arr: (number)[]) => {
  const result: (number)[][] = []
  for (let i = 0; i < arr.length; i += 2) {
    result.push(arr.slice(i, i + 2))
  }
  return result
}

export const solvePart2 = (input: string) => {
  // const newInput = "seeds: " + logId(chunksOf2(input.split('\n')[0].split(':')[1].trim().split(' ')).map(pair => {
  //   const [rangeStart, rangeLength] = pair.map(Number)
  //   const newRange = []
  //   for (let i = 0; i < rangeLength; i++) {
  //     newRange.push(rangeStart + i)
  //   }
  //   return newRange
  // }).flat().join(' '))

  // const [rawSeeds, ...maps] = parseInputLines(input)
  // // console.log(maps)
  // const newInputX = newInput + '\n' + maps.join('\n')
  // // console.log(newInputX)


  // return solvePart1(newInputX)

  const [rawSeeds, ...maps] = parseInputBlocks(input)
  const [seedToSoilMap, soilToFertMap, fertToWaterMap, waterToLightMap, lightToTempMap, tempToHumMap, humToLocationMap] = maps
  let seedRanges = chunksOf2(rawSeeds[0].split(':')[1].trim().split(' ').map(x => Number(x)))
  // console.log(seedRanges)

  maps.forEach(map => {
    map.shift()
    const seedsNewMap = [] as [number, number][]
    // console.log('===NEW MAP==')
    // console.log(seedRanges)
    const hasBeenTransformed = seedRanges.map(_ => false)
    map.forEach(setOfNumbers => {
      // console.log('===NEW SET OF NUMBERS WITHIN MAP==')
      const [mapDestRangeStart, mapSourceRangeStart, mapRangeLength] = setOfNumbers.split(' ').map(Number)
      const mapSourceRangeEnd = mapSourceRangeStart + mapRangeLength - 1

      seedRanges.forEach((rangeSeed, index) => {
        if (hasBeenTransformed[index]) return

        const [start, range] = rangeSeed
        const end = start + range - 1

        if (mapSourceRangeStart <= start && mapSourceRangeEnd >= end) {
          // console.log('||| Case 4 ')
          // Now the entire seedRange has been captured, so everything moves
          const delta = start - mapSourceRangeStart
          const newRange = [delta + mapDestRangeStart, range] as [number, number]
          seedsNewMap.push(newRange)
          
          hasBeenTransformed[index] = true
        } else if (start < mapSourceRangeStart && mapSourceRangeStart <= end && end < mapSourceRangeEnd) {
          // console.log('||| Case 1 ')
          // To split at mapSourceRangeStart
          // start -> mapSourceRangeStart stays the same
          // mapSourceRangeStart -> end will move
          const staysSame = [start, mapSourceRangeStart - 1] as [number, number]
          const moves = [mapSourceRangeStart, end]

          const newRange = [mapDestRangeStart, moves[1] - moves[0] + 1] as [number, number]
          seedsNewMap.push(newRange)          
          seedsNewMap.push([staysSame[0], staysSame[1] - staysSame[0] + 1])

          hasBeenTransformed[index] = true
        } else if (mapSourceRangeStart < start && start <= mapSourceRangeEnd && mapSourceRangeEnd < end) {
          // console.log('||| Case 2 ')
          // start -> mapSourceRangeEnd stays the same
          // mapSourceRangeEnd -> end will be moved
          const moves = [start, mapSourceRangeEnd]
          const staysSame = [mapSourceRangeEnd + 1, end] as [number, number]

          const delta = moves[0] - mapSourceRangeStart
          const newRange = [mapDestRangeStart + delta, moves[1] - moves[0] + 1] as [number, number]

          seedsNewMap.push(newRange)
          seedsNewMap.push([staysSame[0], staysSame[1] - staysSame[0] + 1])
          hasBeenTransformed[index] = true
        } else if (mapSourceRangeEnd <= end && mapSourceRangeStart >= start) {
          // console.log('||| Case 3 ')
          // Now it needs to split in 3 parts
          // start -> mapSourceRangeStart stays the same
          // mapSourceRangeStart -> mapSourceRangeEnd will move
          // mapSourceRangeEnd -> end stays the same
          const staysSame = [start, mapSourceRangeStart - 1] as [number, number]
          const moves = [mapSourceRangeStart, mapSourceRangeEnd]
          const staysSame2 = [mapSourceRangeEnd + 1, end] as [number, number]

          const diff = moves[0] - mapSourceRangeStart
          const newRange = [mapDestRangeStart + diff, moves[1] - moves[0] + 1] as [number, number]
          seedsNewMap.push(newRange)
          hasBeenTransformed[index] = true

          if (staysSame[1] - staysSame[0] + 1 !== 0)
            seedsNewMap.push([staysSame[0], staysSame[1] - staysSame[0] + 1])
          if (staysSame2[1] - staysSame2[0] + 1 !== 0)
            seedsNewMap.push([staysSame2[0], staysSame2[1] - staysSame2[0] + 1])

        } else {
          // The two intervals are entirely separate
          // console.log('||| Case 5 ')
          // seedsNewMap.push(rangeSeed as [number, number])
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
