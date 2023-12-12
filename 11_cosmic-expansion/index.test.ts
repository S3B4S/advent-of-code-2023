import { solvePart1, solvePart2 } from ".";
import { expect, test } from 'bun:test'
import { getFileInput, testWrapper } from "@/utils/misc";

const fileInput = getFileInput(import.meta.dir)
const exampleInput = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`.trim()

testWrapper(`Day 11`, () => {
  test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(374)
  })
  
  test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(9608724)
  })

  test("Part 2 - Example input - expand by 2", () => {
    expect(solvePart2(exampleInput, 2)).toEqual(374)
  })

  test("Part 2 - Example input - expand by 10", () => {
    expect(solvePart2(exampleInput, 10)).toEqual(1030)
  })

  test("Part 2 - Example input - expand by 100", () => {
    expect(solvePart2(exampleInput, 100)).toEqual(8410)
  })
  
  test("Part 2 - File input", () => {
    expect(solvePart2(fileInput, 1000000)).toEqual(904633799472)
  })
})
