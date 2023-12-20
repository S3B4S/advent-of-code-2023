import { solvePart1, solvePart2 } from ".";
import { expect, test } from 'bun:test'
import { getFileInput, testWrapper } from "@/utils/misc";

const fileInput = getFileInput(import.meta.dir)
const exampleInput = `
R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)
`.trim()

testWrapper(`Day 18`, () => {
  test.skip("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(62)
  })
  
  test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(34329)
  })

  test.skip("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(0)
  })
  
  test.skip("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(0)
  })
})
