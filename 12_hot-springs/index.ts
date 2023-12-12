import { logId } from "@/utils/misc"
import { parseInputLines } from "@/utils/parsing"

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
      // These are al; derived values which usually we would
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

export const solvePart2 = (input: string) => {
  return 0
}
