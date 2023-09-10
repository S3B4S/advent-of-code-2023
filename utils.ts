import figlet from "figlet"
import { readFileSync } from "fs"

const figletOptions: figlet.Options = {
  font: "Small",
}

/**
 * Wraps a set of tests in a group with a title
 * @param str the title of the test group
 * @param body the tests to run
 */
export const testWrapper = (str: string, body: () => void) => {
  console.group()
  console.log(figlet.textSync(str, figletOptions))
  console.log()

  body()

  console.groupEnd()
}

/**
 * Assumes the directory is named "DD_name"
 * @returns The day of the directory, e.g. "01"
 */
export const getDayOfDirectory = (dir: string) => dir.split('/').pop()?.split('_').shift()

/**
 * 
 * @param dir The directory of the day, e.g. "<path-to>/01_challenge"
 * @returns The contents of the file named `input.txt` in the directory
 */
export const getFileInput = (dir: string) => readFileSync(dir + '/input.txt', { encoding: 'utf-8' })
