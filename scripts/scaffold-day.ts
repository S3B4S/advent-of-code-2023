import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { mkdirSync, writeFileSync } from 'fs'
import { getDayTemplate, getTestFileTemplate } from './templates'

const PAD_LEFT_COLUMN_TABLE = 20
const PAD_RIGHT_COLUMN_TABLE = 20

const argv = await yargs(hideBin(process.argv))
  .command(['scaffold', 'sd'], 'Scaffolds a new day for advent of code, downlaods the puzzle input as well')
  .example('bun sd -n find-stars -d 2', 'Creates a new directory named "2_find-stars" with the files "index.ts", "index.test.ts" and "input.txt". The last file containing the puzzle input downlaoded from AOC')
  
  .alias('n', 'name')
  .describe('n', 'The name of the challenge')
  .nargs('n', 1)
  .default('n', 'challenge')
  
  .alias('d', 'day')
  .describe('d', 'The day of the challenge')
  .nargs('d', 1)
  .default('d', new Date().getDate())
  
  .alias('y', 'year')
  .describe('y', 'The year of the challenge')
  .nargs('y', 1)
  .default('y', new Date().getFullYear())
  
  .help('h')
  .alias('h', 'help')
  .argv

const url = `https://adventofcode.com/${argv.y}/day/${argv.d}/input`
console.log("Fetching puzzle input from: " + url)

fetch(url, {
  headers: {
    cookie: `session=${process.env.AOC_SESSION_COOKIE}`,
  },
})
.then(res => res.text())
.then(inputData => {
  const targetDir = `./${formatDay(argv.d)}_${argv.n}`
  const indexFileTemplate = getDayTemplate()
  const testFileTemplate = getTestFileTemplate(formatDay(argv.d))

  logTable([
    ['Creating directory', targetDir],
    ['For puzzle name', argv.n],
    ['For puzzle day', formatDay(argv.d)]
  ])
  
  // @TODO check if directory already exists
  // and if so, ask if it should be overwritten

  mkdirSync(targetDir, { recursive: true })
  writeFileSync(`${targetDir}/index.ts`, indexFileTemplate)
  writeFileSync(`${targetDir}/index.test.ts`, testFileTemplate)
  writeFileSync(`${targetDir}/input.txt`, inputData)
})

const formatDay = (day: number) => String(day).padStart(2, '0')

const logTable = (rows: [string, string][]) => {
  rows.forEach(([left, right]) => {
    console.log(left.padEnd(PAD_LEFT_COLUMN_TABLE, ' '), right.padEnd(PAD_RIGHT_COLUMN_TABLE, ' '))
  })
}
