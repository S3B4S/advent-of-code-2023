import { solvePart1, solvePart2 } from ".";
import { expect, test } from 'bun:test'
import { getFileInput, testWrapper } from "@/utils/misc";

const fileInput = getFileInput(import.meta.dir)
const exampleInput = `
rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7
`.trim()

testWrapper(`Day 15`, () => {
  test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(1320)
  })

  test("Part 1 - Example input - HASH", () => {
    expect(solvePart1("HASH")).toEqual(52)
  })

  test("Part 1 - Example input - HASH,HASH", () => {
    expect(solvePart1("HASH,HASH")).toEqual(52 * 2)
  })
  
  test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(515210)
  })

  test.skip("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(0)
  })
  
  test.skip("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(0)
  })
})
