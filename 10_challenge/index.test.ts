import { solvePart1, solvePart2 } from ".";
import { expect, test } from 'bun:test'
import { getFileInput, testWrapper } from "@/utils/misc";

const fileInput = getFileInput(import.meta.dir)
const exampleInput = `
.....
.S-7.
.|.|.
.L-J.
.....
`.trim()

const exampleInput2 = `
..F7.
.FJ|.
SJ.L7
|F--J
LJ...
`.trim()

testWrapper(`Day 10`, () => {
  test("Part 1 - Example input 1", () => {
    expect(solvePart1(exampleInput)).toEqual(4)
  })

  test("Part 1 - Example input 2", () => {
    expect(solvePart1(exampleInput2)).toEqual(8)
  })
  
  test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(6815)
  })

  test.skip("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(0)
  })
  
  test.skip("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(0)
  })
})
