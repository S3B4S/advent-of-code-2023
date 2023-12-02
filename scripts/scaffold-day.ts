import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { getDayTemplate, getTestFileTemplate } from './templates'

const PAD_LEFT_COLUMN_TABLE = 20
const PAD_RIGHT_COLUMN_TABLE = 20

const argv = await yargs(hideBin(process.argv))
  .command(['scaffold', 'sd'], 
    `Scaffolds a new day for advent of code, downlaods the puzzle input as well
  
    - The name of the challenge is optional, if not provided it will be fetched from the AOC website
    - The day is optional, if not provided it will default to the current day
    - The year is optional, if not provided it will default to the current year
    - The session cookie is required, it can be provided as an environment variable named AOC_SESSION_COOKIE, it can be found in the browser after logging in to AOC, it is named "session" and is a long string of characters
    - If a directory with the same name as the target directory already exists, the script will prompt for confirmation before overwriting it
  `)
  .example('bun sd -n find-stars -d 2', 'Creates a new directory named "02_find-stars" with the files "index.ts", "index.test.ts" and "input.txt". The last file containing the puzzle input downlaoded from AOC.')
  
  .alias('n', 'name')
  .describe('n', 'The name of the challenge')
  .nargs('n', 1)
  
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

const titleRegex = /(?<=<article class="day-desc"><h2>--- Day \d: )(.|\n)*(?= ---<\/h2>)/g

const urlSite = `https://adventofcode.com/${argv.y}/day/${argv.d}`
const urlInput = `${urlSite}/input`

console.log("Fetching puzzle title: " + urlSite)
console.log("Fetching puzzle input from: " + urlInput)
console.log("")

Promise.all([
  fetch(urlSite, {
    headers: {
      cookie: `session=${process.env.AOC_SESSION_COOKIE}`,
    }
  }),
  fetch(urlInput, {
    headers: {
      cookie: `session=${process.env.AOC_SESSION_COOKIE}`,
    },
  })
])
.then(res => Promise.all(res.map(r => r.text())))
.then(([siteData, inputData]) => {
  const match = siteData.match(titleRegex)
  const challengeTitle: string = (argv.n as string | undefined) || match?.[0].toLocaleLowerCase() || 'challenge'
  const targetDir = `./${formatDay(argv.d)}_${challengeTitle}`
  const indexFileTemplate = getDayTemplate()
  const testFileTemplate = getTestFileTemplate(formatDay(argv.d))

  if (existsSync(targetDir)) {
    const answer = prompt(`Directory ${targetDir} already exists, overwrite? [y/n]`)
    
    if (['y', 'yes'].includes(answer?.toLocaleLowerCase() || 'n')) {
      console.log('Overwriting directory')
    } else {
      console.log('Aborting')
      process.exit(0)
    }
  }

  logTable([
    ['Creating directory', targetDir],
    ['For puzzle name', challengeTitle],
    ['For puzzle day', formatDay(argv.d)]
  ])

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
