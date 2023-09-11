export const getDayTemplate = () => `
export const solvePart1 = (input: string) => {
  return 0
}

export const solvePart2 = (input: string) => {
  return 0
}
`.trim() + '\n'

export const getTestFileTemplate = (day: string) => `
import { solvePart1, solvePart2 } from ".";
import { expect, test } from 'bun:test'
import { getFileInput, testWrapper } from "@/utils";

const fileInput = getFileInput(import.meta.dir)
const exampleInput = \`

\`.trim()

testWrapper(\`Day ${day}\`, () => {
  test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(0)
  })
  
  test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(0)
  })

  test("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(0)
  })
  
  test("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(0)
  })
})
`.trim() + '\n'