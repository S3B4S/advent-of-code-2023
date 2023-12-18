import { solvePart1, solvePart2 } from ".";
import { expect, test } from 'bun:test'
import { getFileInput, testWrapper } from "@/utils/misc";

const fileInput = getFileInput(import.meta.dir)
const exampleInput = `
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533
`.trim()

testWrapper(`Day 17`, () => {
  test("Part 1 - Small portion of example input", () => {
    expect(solvePart1(`
211
321
`.trim())).toEqual(3)
  })

  test("Part 1 - Small portion 2 of example input", () => {
    expect(solvePart1(`
241343231
321545353
`.trim())).toEqual(4 + 1 + 3 + 2 + 3 + 1 + 1 + 5 + 4 + 5 + 3)
  })

  test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(102)
  })
  
  test.skip("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(0)
  })

  test.skip("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(0)
  })
  
  test.skip("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(0)
  })
})
