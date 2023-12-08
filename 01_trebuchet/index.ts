import { ElementOfReadOnlyArray } from "@/utils/types"

const mappingNumbers = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
}

const trapCombinations = [
  ["oneight", "oneeight"],
  ["twone", "twoone"],
  ["eightwo", "eighttwo"],
  ["eighthree", "eightthree"],
  ["threeight", "threeeight"],
  ["fiveight", "fiveeight"],
  ["sevenine", "sevennine"],
] as const

const listNumbers = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
] as const

const regex = new RegExp(`(${listNumbers.join('|')})`, 'g')

export const solvePart1 = (input: string) => input
  .split('\n')
  .map(str => {
    const numbers = str.split('').filter(substr => Number(substr))
    const first = numbers[0]
    const last = numbers[numbers.length - 1]
    return Number(first + last)
  })
  .reduce((acc, curr) => acc + curr)

export const solvePart2 = (input: string) => {
  return input
  .split('\n').map(x => {
    trapCombinations.forEach(([trap, replacement]) => {
      x = x.replace(trap, replacement)
    })
    return x.trim()
  })
  .map(str => {
    if (!str) return 0 // This will not happen but we want to assert for TS
    const subList = str.match(regex)!
  
    let first = subList[0] as ElementOfReadOnlyArray<typeof listNumbers>
    let last = subList[subList.length - 1] as ElementOfReadOnlyArray<typeof listNumbers>

    
    if (first in mappingNumbers) {
      // @ts-ignore
      first = mappingNumbers[first]
    }

    if (last in mappingNumbers) {
      // @ts-ignore
      last = mappingNumbers[last]
    }

    return Number(first + last)
  })
  .reduce((acc, curr) => acc + Number(curr))
}
