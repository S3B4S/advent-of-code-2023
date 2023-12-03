import { solvePart1, solvePart2 } from ".";
import { expect, test } from 'bun:test'
import { getFileInput, testWrapper } from "@/utils/misc";

const fileInput = getFileInput(import.meta.dir)
const exampleInput = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`.trim()

testWrapper(`Day 03`, () => {
  test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(4361)
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
