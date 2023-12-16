import { solvePart1, solvePart2 } from ".";
import { expect, test } from 'bun:test'
import { getFileInput, testWrapper } from "@/utils/misc";

const fileInput = getFileInput(import.meta.dir)
const exampleInput = `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`.trim()

testWrapper(`Day 13`, () => {
  test.skip("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(405)
  })

  test.skip("Part 1 - Example input with 0 rows above", () => {
    expect(solvePart1(`
#####.#..###.
...#...####..
...#...####..
#####.#..###.
...##..##...#
#..#.#.##.#..
###.####.###.
##.#...##..#.
###.###...#.#
`.trim())).toEqual(200)
  })
  
  test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(0)
  })

  test.skip("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(0)
  })
  
  test.skip("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(0)
  })
})
