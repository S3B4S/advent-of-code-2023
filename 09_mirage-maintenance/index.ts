import { logId } from "@/utils/misc"
import { parseInputLines } from "@/utils/parsing"

const calculateHistory = (sequence: number[]) => {
  const sequences = [sequence]
  
  // Go "downwards" finding all the histories
  while(true) {
    const currentSeq = sequences.at(-1)!
    if (currentSeq.every(x => x === 0)) break
    const newSeq = currentSeq.reduce((acc, curr, index, list) => {
      // Skip the first number, as we can't look back to compare to anything
      if (index === 0) return []
      const prev = list[index - 1]
      const diff = curr - prev
      return [...acc, diff]
    }, [] as number[])
    sequences.push(newSeq)
  }

  // Bubble back upwards, to find the lost history number
  // The one to last will be an array of all equal numbers,
  // add this number to the second to last array, and then
  // bubble up
  let numberToAdd = sequences.at(-2)![0]
  let i = sequences.length - 2
  
  while(i--) {
    const currentSeq = sequences[i]
    const newNumber = currentSeq.at(-1)! + numberToAdd
    numberToAdd = newNumber
  }

  return numberToAdd
}

export const solvePart1 = (input: string) => {
  const sequences = parseInputLines(input)
    .map(line => line.split(' ').map(x => Number(x)))
    // INVESTIGATE WHY line.split(/\W+/) did not work
    // .map(line => line.split(/\W+/).map(x => Number(x)))
  
  const results = sequences.map(calculateHistory)
  return results.reduce((acc, curr) => acc + curr)
}


const calculateHistoryReversed = (sequence: number[]) => {
  const sequences = [sequence]
  
  // Go "downwards" finding all the histories
  while(true) {
    const currentSeq = sequences.at(-1)!
    if (currentSeq.every(x => x === 0)) break
    const newSeq = currentSeq.reduce((acc, curr, index, list) => {
      // Skip the first number, as we can't look back to compare to anything
      if (index === 0) return []
      const prev = list[index - 1]
      const diff = curr - prev
      return [...acc, diff]
    }, [] as number[])
    sequences.push(newSeq)
  }

  // Bubble back upwards, to find the lost history number
  // The one to last will be an array of all equal numbers,
  // add this number to the second to last array, and then
  // bubble up
  let numberToAdd = sequences.at(-2)![0]
  let i = sequences.length - 2
  
  while(i--) {
    const currentSeq = sequences[i]
    const newNumber = currentSeq.at(0)! - numberToAdd
    numberToAdd = newNumber
  }

  return numberToAdd
}


export const solvePart2 = (input: string) => {
  const sequences = parseInputLines(input)
    .map(line => line.split(' ').map(x => Number(x)))
    // INVESTIGATE WHY line.split(/\W+/) did not work
    // .map(line => line.split(/\W+/).map(x => Number(x)))
  
  const results = sequences.map(calculateHistoryReversed)
  return results.reduce((acc, curr) => acc + curr)
}
