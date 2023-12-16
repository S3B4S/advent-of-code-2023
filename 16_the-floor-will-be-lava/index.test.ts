import { solvePart1, solvePart2 } from ".";
import { expect, test } from 'bun:test'
import { getFileInput, testWrapper } from "@/utils/misc";

const fileInput = getFileInput(import.meta.dir)
const exampleInput = `
.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....
`.trim()

testWrapper(`Day 16`, () => {
  test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(46)
  })
  
  test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(8146)
  })

  test("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(51)
  })
  
  test("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(8358)
  })
})
