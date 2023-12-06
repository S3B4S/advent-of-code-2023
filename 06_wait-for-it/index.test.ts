import { solvePart1, solvePart2 } from ".";
import { expect, test } from 'bun:test'
import { getFileInput, testWrapper } from "@/utils/misc";

const fileInput = getFileInput(import.meta.dir)
const exampleInput = `
Time:      7  15   30
Distance:  9  40  200
`.trim()

testWrapper(`Day 06`, () => {
  test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(288)
  })
  
  test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(219849)
  })

  test("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(71503)
  })
  
  test("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(29432455)
  })
})
