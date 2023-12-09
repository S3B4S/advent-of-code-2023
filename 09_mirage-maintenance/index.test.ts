import { solvePart1, solvePart2 } from ".";
import { expect, test } from 'bun:test'
import { getFileInput, testWrapper } from "@/utils/misc";

const fileInput = getFileInput(import.meta.dir)
const exampleInput = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`.trim()

testWrapper(`Day 09`, () => {
  test("Part 1 - Example input - 0.1", () => {
    expect(solvePart1(`0 3 6 9 12 15`)).toEqual(18)
  })

  test("Part 1 - Example input - 0.2", () => {
    expect(solvePart1(`1 3 6 10 15 21`)).toEqual(28)
  })

  test("Part 1 - Example input - 0.3", () => {
    expect(solvePart1(`10 13 16 21 30 45`)).toEqual(68)
  })
  
  test("Part 1 - Example input - Negative numbers", () => {
    // 10   7   4   1   -2   -5  /* new */ -8
    //   -3   -3  -3  -3  -3  /* new */ -3
    //       0   0   0   0  /* new */ 0
    expect(solvePart1(`10 7 4 1 -2 -5`)).toEqual(-8)
  })

  test("Part 1 - Example input - 1", () => {
    expect(solvePart1(exampleInput)).toEqual(114)
  })
  
  test("Part 1 - File input", () => {
    // 632423209: too low
    expect(solvePart1(fileInput)).toEqual(1992273652)
  })

  test("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(2)
  })
  
  test("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(1012)
  })
})
