import { toASCII } from "punycode"

export const solvePart1 = (input: string) => {
  const listToHash = input.trim().split(',')
  const calc = listToHash.map(str => {
    let currentValue = 0

    for (let i = 0; i < str.length; i++) {
      const ascii = str.charCodeAt(i)
      currentValue += ascii
      currentValue = currentValue * 17
      currentValue = currentValue % 256
    }

    return currentValue
  })

  return calc.reduce((acc, curr) => acc + curr)
}

export const solvePart2 = (input: string) => {
  return 0
}
