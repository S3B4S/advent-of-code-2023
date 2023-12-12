import { solvePart1, solvePart2 } from ".";
import { expect, test } from 'bun:test'
import { getFileInput, testWrapper } from "@/utils/misc";

const fileInput = getFileInput(import.meta.dir)
const exampleInput = `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`.trim()

testWrapper(`Day 12`, () => {
  test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(21)
  })
  
  test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(7251)
  })

  test.skip("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(0)
  })
  
  test.skip("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(0)
  })
})
