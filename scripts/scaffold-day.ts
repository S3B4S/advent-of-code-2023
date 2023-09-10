import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { mkdirSync, writeFileSync } from 'fs'

const argv = await yargs(hideBin(process.argv))
  .command(['scaffold', 'sd'], 'Scaffolds a new day')
  .example('bun sd -n challenge -d 01', 'Creates a new directory named "01_challenge" with the files "index.ts", "index.test.ts" and "input.txt"')
  
  .alias('n', 'name')
  .describe('n', 'The name of the challenge of the day')
  .nargs('n', 1)
  .default('n', 'challenge')
  
  .alias('d', 'day')
  .describe('d', 'The day of the challenge')
  .nargs('d', 1)
  .default('d', new Date().getDate().toString().padStart(2, "0"))
  
  .demandOption(['n'])
  .help('h')
  .alias('h', 'help')
  .argv

// @TODO trigger api call to get the input file from AoC

const targetDir = `./${argv.d}_${argv.n}`
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

testWrapper(\`Day ${argv.day}\`, () => {
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
