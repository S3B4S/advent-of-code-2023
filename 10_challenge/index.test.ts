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

const exmapleInput_Part2_1 = `
...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........
`.trim()

const exmapleInput_Part2_2 = `
..........
.S------7.
.|F----7|.
.||....||.
.||....||.
.|L-7F-J|.
.|..||..|.
.L--JL--J.
..........
`.trim()


const exmapleInput_Part2_3 = `
..........
.S------7.
.|F----7|.
.||....||.
.||....||.
.|L-7F-J|.
.|LJ||..|.
.L--JL--J.
..........
`.trim()

const exmapleInput_Part2_4 = `
................
.S------------7.
.|F----------7|.
.||..........||.
.||..........||.
.||..........||.
.||..........||.
.|L----7F----J|.
.|LJ...||.-|.F|.
.L-----JL-----J.
................
`.trim()

const exmapleInput_Part2_6 = `
.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...
`.trim()

const exampleInput_Part2_containsRandomPipes = `
FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L
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

  test.skip("Part 2 - Example input 1", () => {
    expect(solvePart2(exmapleInput_Part2_1)).toEqual(4)
  })

  test.skip("Part 2 - Example input 2", () => {
    expect(solvePart2(exmapleInput_Part2_2)).toEqual(4)
  })

  test("Part 2 - Example input 3", () => {
    expect(solvePart2(exmapleInput_Part2_3)).toEqual(4)
  })

  test("Part 2 - Example input 4", () => {
    expect(solvePart2(exmapleInput_Part2_4)).toEqual(10)
  })

  test("Part 2 - Example input 6", () => {
    expect(solvePart2(exmapleInput_Part2_6)).toEqual(8)
  })

  test("Part 2 - Example input - Contains random pipes", () => {
    expect(solvePart2(exampleInput_Part2_containsRandomPipes)).toEqual(10)
  })
  
  test.skip("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(0)
  })
})
