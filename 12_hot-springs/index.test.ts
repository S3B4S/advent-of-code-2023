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
    // Using the implementation of part 2, because it's more optimised
    expect(solvePart2(exampleInput)).toEqual(21)
  })
  
  test("Part 1 - File input", () => {
    // Using the implementation of part 2, because it's more optimised
    expect(solvePart2(fileInput)).toEqual(7251)
  })

  // Example input for part 2 WITHOUT unfolding
  test("Part 2 - Example input without unfolding", () => {
    expect(solvePart2(exampleInput)).toEqual(21)
  })

  test("Part 2 - Example input line 1 without unfolding", () => {
    expect(solvePart2(`???.### 1,1,3`)).toEqual(1)
  })

  test("Part 2 - Example input line 2 without unfolding", () => {
    expect(solvePart2(`.??..??...?##. 1,1,3`)).toEqual(4)
  })

  test("Part 2 - Example input line 3 without unfolding", () => {
    expect(solvePart2(`?#?#?#?#?#?#?#? 1,3,1,6`)).toEqual(1)
  })
  
  test("Part 2 - Example input line 3 - isolated edge case - attempt 1", () => {
    expect(solvePart2(`?#?#???#? 1,3,1`)).toEqual(1)
  })
  
  test("Part 2 - Example input line 3 - isolated edge case - attempt 2", () => {
    expect(solvePart2(`?#?#???#?#?#?#? 1,3,1,6`)).toEqual(1)
  })
  
  test("Part 2 - Example input line 4 without unfolding", () => {
    expect(solvePart2(`????.######..#####. 1,6,5`)).toEqual(4)
  })

  test("Part 2 - Example input line 5 without unfolding", () => {
    expect(solvePart2(`?###???????? 3,2,1`)).toEqual(10)
  })

  // Example input for part 2 WITH unfolding
  test("Part 2 - Example input with unfolding", () => {
    expect(solvePart2(exampleInput, true)).toEqual(525152)
  })

  test("Part 2 - Example input line 1 with unfolding", () => {
    expect(solvePart2(`???.### 1,1,3`, true)).toEqual(1)
  })

  test("Part 2 - Example input line 2 with unfolding", () => {
    expect(solvePart2(`.??..??...?##. 1,1,3`, true)).toEqual(16384)
  })

  test("Part 2 - Example input line 3 - unfolded twice", () => {
    expect(solvePart2(`?#?#?#?#?#?#?#???#?#?#?#?#?#?#? 1,3,1,6,1,3,1,6`)).toEqual(1)
  })

  test("Part 2 - Example input line 3 with unfolding", () => {
    expect(solvePart2(`?#?#?#?#?#?#?#? 1,3,1,6`, true)).toEqual(1)
  })

  // Others
  test("Part 2 - Self made line", () => {
    expect(solvePart2(`????#...#....?? 3,1,2`)).toEqual(1)
  })

  test("Part 2 - Self made line 2", () => {
    expect(solvePart2(`.#....?? 1,2`)).toEqual(1)
  })

  test("Part 2 - Empty input", () => {
    expect(solvePart2(`............... `)).toEqual(1)
  })

  test("Part 2 - Empty input", () => {
    expect(solvePart2(`.???..??.??..?..?.. `)).toEqual(1)
  })
  
  // File input
  test("Part 2 - File input", () => {
    expect(solvePart2(fileInput, true)).toEqual(2128386729962)
  })
})
