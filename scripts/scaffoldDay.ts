import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { mkdirSync, writeFileSync } from 'fs'

const argv = await yargs(hideBin(process.argv)).argv

const dayName = argv.n || argv.name || "day"
const day = argv.d || argv.day || new Date().getDate().toString().padStart(2, "0")
const targetDir = `./${day}_${dayName}`

const indexFileTemplate = `
export const solvePart1 = (input: string) => {
  return 0
}

export const solvePart2 = (input: string) => {
  return 0
}
`.trim() + '\n'

const testFileTemplate = `
import { solvePart1, solvePart2 } from ".";
import { expect, test } from 'bun:test'
import { getFileInput, testWrapper } from "@/utils";

const fileInput = getFileInput(import.meta.dir)
const exampleInput = \`

\`.trim()

testWrapper(\`Day ${day}\`, () => {
  test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(0)
  })
  
  test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(0)
  })

  test("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(0)
  })
  
  test("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(0)
  })
})
`.trim() + '\n'

mkdirSync(targetDir, { recursive: true })
writeFileSync(`${targetDir}/index.ts`, indexFileTemplate)
writeFileSync(`${targetDir}/index.test.ts`, testFileTemplate)
writeFileSync(`${targetDir}/input.txt`, "")