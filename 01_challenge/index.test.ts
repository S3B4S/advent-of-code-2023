import { solvePart1, solvePart2 } from ".";
import { expect, test } from 'bun:test'
import { getFileInput, testWrapper } from "@/utils/misc";

const fileInput = getFileInput(import.meta.dir)
const exampleInput = `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`.trim()

const exampleInput2 = `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`.trim()

testWrapper(`Day 01`, () => {
  test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(142)
  })
  
  test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(54630)
  })

  test("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput2)).toEqual(281)
  })
  
  test("Part 2 - Example input 2", () => {
    expect(solvePart2(`
      eightfivesssxxmgthreethreeone1sevenhnz
      hzdlftdtfqfdbxgsix9onetwo13
      29threelgxljfhrjr
      pxvmbjprllmbfpzjxsvhc5
      seven2jtgjltvzbcdnjtsfiveonebhkzld
      twothreesixeight6eight6
      nptjqqxoneninert1927
      7beighttwob
      6onesix
    `.trim())).toEqual(480)
  })

  test("Part 2 - Example input 3", () => {
    expect(solvePart2(`
      fgjqhqvtwozjfxgxpkz1six
      3dxnvg4ninetwo
      5twoone9lnvdxhctn
      dnjpqnplxq9rxfour6one4slqlhsnc
      tgkfourthreetwofive4npnnvthjgf8
      tjzjppnsksix4
      lmfkvgfzfmhxqrcvsgt28ssmhm5fivethree
      fourninefjxpvpbnhm29oneninesix
      hmxjs2sevenfive68nine
      five3eightsfvftdxl
      35sjcqtqpqz7fiveeight
      lbchtbsnhmxlq1rcjrlvgmdjmjhtk
      2gmzrn34eightkdpsgnine
      sevenljzcxlgpskvkprjb6
      sixkbsdxjvsncj2four
      1sixbl9seventwotgtfcstqgv4lc
      89threeseven5tnshndjcsxc
      42
    `.trim())).toEqual(838)
  })

  test("Part 2 - Example input 4", () => {
    expect(solvePart2(`5twoone9lnvdxhctn`)).toEqual(59)
  })

  test("Part 2 - Example input 5", () => {
    expect(solvePart2(`oneeight`)).toEqual(18)
  })

  test("Part 2 - Example input 6", () => {
    expect(solvePart2(`one`)).toEqual(11)
  })
  
  test("Part 2 - Example input 7", () => {
    expect(solvePart2(`oneight`)).toEqual(18)
  })

  test("Part 2 - Example input 8", () => {
    expect(solvePart2(`twone`)).toEqual(21)
  })
  
  test("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(54770)
  })
})
