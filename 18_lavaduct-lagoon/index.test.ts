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
  test.skip ("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(62)
  })
  
  test.skip("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(34329)
  })

  test("Part 2 - Small example input equal to part 1", () => {
    expect(solvePart2(`
R 6 (#000060)
D 5 (#000051)
L 2 (#000022)
D 2 (#000021)
R 2 (#000020)
D 2 (#000021)
L 5 (#000052)
U 2 (#000023)
L 1 (#000012)
U 2 (#000023)
R 2 (#000020)
U 3 (#000033)
L 2 (#000022)
U 2 (#000023)
`.trim())).toEqual(62)
  })

  test("Part 2 - Small example input with gaps", () => {
    expect(solvePart2(`
R 6 (#000120)
D 5 (#0000b1)
L 2 (#000032)
U 2 (#000063)
L 2 (#000062)
D 2 (#000061)
L 5 (#000022)
U 2 (#000063)
L 1 (#000032)
D 2 (#000061)
L 2 (#000042)
U 3 (#0000b3)
`.trim())).toEqual(186)
  })

  test("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(952408144115)
  })
  
  test("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toBeGreaterThan(18184440404388)
  })
})
