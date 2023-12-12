import { logId } from "@/utils/misc"
import { parseInputLines } from "@/utils/parsing"

const springCharacter = {
  operational: ".",
  damaged: "#",
  unknown: "?"
}

const countStr = (str: string, substr: string) => str.split(substr).length - 1

/**
 * Generate sublists of length n *only* from the list
 * @param list 
 * @param n 
 * @returns 
 */
const sublistsN = <T>(list: T[], n: number): T[][] => {
  if (n === 0) return [[]]
  if (n === 1) return list.map(item => [item])

  return list.flatMap((item, i) => {
    const rest = list.slice(i + 1)
    return sublistsN(rest, n - 1).map(sublist => [item, ...sublist])
  })
}

export const solvePart1 = (input: string) => {
  // This gonna be ugly, but we wil generate all combinations possible
  // And then match those possible
  const lines = parseInputLines(input)
    .map(line => {
      const [springs, ...groupsSesrialised] = line.split(/[ ,]/)
      const groups = groupsSesrialised.map(g => Number(g))
      // These are all derived values which usually we would
      // not want to store
      const nUnknown = countStr(springs, "?")
      const nFunctional = countStr(springs, "#")
      const nFunctionalTotal = groups.reduce((acc, group) => acc + group)
      const nFunctionalToAdd = nFunctionalTotal - nFunctional

      return { springs, nUnknown, nFunctional, groups, nFunctionalTotal, nFunctionalToAdd }
    })

  let count = 0

  lines.forEach(({springs, groups, nFunctionalToAdd}) => {
    // All possible groups is equal to the question of all
    // Possible sublists of length nFunctionalToAdd
    // of the list of the indices of the question marks
    const unknownIndices = springs.split("").map((c, i) => c === "?" ? i : -1).filter(i => i !== -1)

    sublistsN(unknownIndices, nFunctionalToAdd).forEach(tentativePositionsDamaged => {
      // We're going to put the sublist to test in the springs
      // By "creating" the new string with the positions for damaged as indicated in sublist
      // And then test if it matches the groups correctly
      const newSpring = springs
        .split("")
        .map((c, i) => {
          if (tentativePositionsDamaged.includes(i)) return "#"
          if (c === "?") return "."
          return c
        })
        .join("")
        
      const match = newSpring.match(/#+/g)!
      // This matched length should be equal to the length of the groups
      if (match.length === groups.length && match.every((m, i) => m.length === groups[i])) {
        count += 1
      }
    })
  })

  return count
}

// A record where the keys are the sequence strings + the groups and the values are the possible number of combinations
const cache = {} as Record<string, number>

const saveToCache = (seq: string, combinations: number[], value: number) => {
  const key = seq + '|' + combinations.join(",")
  cache[key] = value
}

const readFromCache = (seq: string, combinations: number[]) => {
  const key = seq + '|' + combinations.join(",")
  return cache[key]
}

/**
 * Slides a window over string or array. For example, if n is 3 and input is "hello",
 * the function will return an array of substrings of length 3: ["hel", "ell", "llo"].
 * @param n the window size
 * @returns all scanned items
 */
export const sliding = (n: number) => (input: string): string[] => {
  if (input.length <= n) return [input]
  return [input.slice(0, n)].concat(sliding(n)(input.slice(1)))
}

/**
 * Slides a window over string or array and also returns the remainder of the string.
 * For example, if n is 3 and input is "hello",
 * the function will return an array of substrings of length 3: [["hel", "lo"], ["ell", "o"], ["llo", ""]].
 * @param n the window size
 * @returns all scanned items
 */
export const slidingWithRest = (n: number) => (input: string): [string, string][] => {
  if (input.length <= n) return [[input, ""]]
  return [[input.slice(0, n), input.slice(n)] as [string, string]].concat(slidingWithRest(n)(input.slice(1)))
}

const recParse = (seq: string, groupSizes: number[], depth = 0): number => {
  const cached = readFromCache(seq, groupSizes)
  if (cached !== undefined) return cached

  // We can ignore dots at the beginning, they don't influence the amount
  if (seq[0] === springCharacter.operational) {
    const res = recParse(seq.slice(1), groupSizes, depth + 1)
    saveToCache(seq, groupSizes, res)
    return res
  }

  // At this point we know we have either a # or ? on the first position

  const [currentSizeGroup, ...restGroups] = groupSizes

  if (currentSizeGroup === undefined) {
    // We have no more groups to create, we can return 1 if the remainder of the string
    // is all dots or question marks
    return seq.split('').every(c => [springCharacter.operational, springCharacter.unknown].includes(c)) ? 1 : 0
  }

  // Create first group
  // A group needs to be surrounded by dots/emtpy space

  // We're creating a sliding window where we'll iterate over all the possible groups
  // for the first group amount.
  const slidingWindow = slidingWithRest(currentSizeGroup)(seq)
  let foundFirstDamagedSpring = -1 // -1 is it hasn't been found yet, any other positive values indicate the index of the first damaged spring in the window
  let totalAmount = 0

  // We will keep exploring these windows until we get our first
  // Already existing damaged spring to the left of us
  for (const [window, rest] of slidingWindow) {
    const lastChar = rest.at(0) || "" // If this is empty, it's the boundary of the string

    if (foundFirstDamagedSpring === 0) break // We should stop looking if the first damaged character is to the left of our window, as we can't have any valid groups anymore
    if (foundFirstDamagedSpring > 0) foundFirstDamagedSpring -= 1
    if (foundFirstDamagedSpring === -1 && window.includes(springCharacter.damaged)) foundFirstDamagedSpring = window.indexOf(springCharacter.damaged)

    if (lastChar === springCharacter.damaged) {
      // We can't create a group with the current window
      // Because it'd connect to the next damaged spring
      // Meaning the group would end up being bigger
      continue
    }

    // Now we know we have a damaged spring in the window & last char is a dot or question mark
    // What's left is to see if we have enough question marks and damaged springs to create the group
    const nQuestionMarks = countStr(window, springCharacter.unknown)
    const nDamagedSprings = countStr(window, springCharacter.damaged)
    // logInd('currentSizeGroup: ', currentSizeGroup)
    if (nQuestionMarks + nDamagedSprings === currentSizeGroup) {
      // We can create the group
      const amnt = recParse(rest.slice(1), restGroups, depth + 1)
      saveToCache(window + springCharacter.operational, [currentSizeGroup], 1)
      saveToCache(rest.slice(1), restGroups, amnt)
      totalAmount += amnt
      continue
    }
  }

  return totalAmount
}

export const solvePart2 = (input: string, withUnfolding: boolean = false) => {
  const lines = parseInputLines(input)
    .map(line => {
      let [springs, ...groupsSesrialised] = line.split(/[ ,]/)
      let groups = groupsSesrialised.map(g => Number(g))

      if (withUnfolding) {
        springs = Array.from({ length: 5 }).map(_ => springs).join("?")
        groups = Array.from({ length: 5 }).map(_ => groups).flat()
      }

      return [springs, groups] as const
    })

  let count = 0

  lines.forEach(([springs, groups]) => {
    const amnt = recParse(springs, groups)
    count += amnt
  })

  return count
}
