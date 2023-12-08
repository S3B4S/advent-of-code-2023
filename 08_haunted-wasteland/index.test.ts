import { solvePart1, solvePart2 } from ".";
import { expect, test } from 'bun:test'
import { getFileInput, testWrapper } from "@/utils/misc";

const fileInput = getFileInput(import.meta.dir)
const exampleInput = `
RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)
`.trim()

const exampleInput2 = `
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
`.trim()

const exampleInputPart2 = `
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`.trim()

testWrapper(`Day 08`, () => {
  test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(2)
  })

  test("Part 1 - Example input 2", () => {
    expect(solvePart1(exampleInput2)).toEqual(6)
  })
  
  test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(13301)
  })

  test("Part 2 - Example input", () => {
    expect(solvePart2(exampleInputPart2)).toEqual(6)
  })
  
  test("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(7309459565207)
  })
})
