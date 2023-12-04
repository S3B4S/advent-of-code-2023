import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { getDayTemplate, getTestFileTemplate } from './templates'
import { getBorderCharacters, table } from 'table'

const logTable = (content: any) => {
  console.log(table(content, {
    border: getBorderCharacters('norc'),
  }))
}

const formatDay = (day: number) => String(day).padStart(2, '0')

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

if (!process.env.AOC_SESSION_COOKIE) {
  console.error('AOC_SESSION_COOKIE environment variable is not set, please set it to your AOC session cookie. This is required to download the puzzle input.')
  process.exit(1)
}

const titleRegex = /(?<=<article class="day-desc"><h2>--- Day \d: )([\w\?\! ]*)(?= ---<\/h2>)/g
const exampleInputRegex = /(?<=<pre><code>)([\s\S]*?)(?=<\/code><\/pre>)/g

const urlSite = `https://adventofcode.com/${argv.y}/day/${argv.d}`
const urlInput = `${urlSite}/input`

logTable([
  ["Fetching puzzle data from", urlSite],
  ["Fetching puzzle input from", urlInput]
])
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
  const exampleInput = siteData.match(exampleInputRegex)?.[0]
  const challengeTitleMatch = siteData.match(titleRegex)
  const challengeTitle = (argv.n as string | undefined) || challengeTitleMatch?.[0] || 'challenge'
  const formattedChallengeTitle = challengeTitle.replaceAll(/[\?\!]/g, '').replaceAll(/ /g, '-').toLocaleLowerCase()
  const targetDir = `./${formatDay(argv.d)}_${formattedChallengeTitle}`
  const indexFileTemplate = getDayTemplate()
  const testFileTemplate = getTestFileTemplate(formatDay(argv.d), (exampleInput || '').trim())

  logTable([
    ['Target directory', targetDir],
    ['For puzzle name', formattedChallengeTitle],
    ['For puzzle day', formatDay(argv.d)],
    ['Example input found', exampleInput ? 'Yes' : 'No'],
  ])
  
  if (existsSync(targetDir)) {
    console.log('')
    const answer = prompt(`Directory ${targetDir} already exists, overwrite? [y/n]`)
    
    if (['y', 'yes'].includes(answer?.toLocaleLowerCase() || 'n')) {
      console.log('Overwriting directory')
    } else {
      console.log('Aborting')
      process.exit(0)
    }
  }

  mkdirSync(targetDir, { recursive: true })
  writeFileSync(`${targetDir}/index.ts`, indexFileTemplate)
  writeFileSync(`${targetDir}/index.test.ts`, testFileTemplate)
  writeFileSync(`${targetDir}/input.txt`, inputData)
})
