import { Hand, solvePart1, solvePart2, typeOfHand, typeOfHandWithJoker } from ".";
import { expect, test } from 'bun:test'
import { getFileInput, testWrapper } from "@/utils/misc";

const fileInput = getFileInput(import.meta.dir)
const exampleInput = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`.trim()

testWrapper(`Day 07`, () => {
  test("Part 1 - Five of a kind", () => {
    expect(typeOfHand("AAAAA")).toEqual(Hand.FiveOfAKind)
  })

  test("Part 1 - Four of a kind", () => {
    expect(typeOfHand("8888Q")).toEqual(Hand.FourOfAKind)
  })

  test("Part 1 - Full house", () => {
    expect(typeOfHand("22233")).toEqual(Hand.FullHouse)
  })

  test("Part 1 - Three of a kind", () => {
    expect(typeOfHand("66613")).toEqual(Hand.ThreeOfAKind)
  })

  test("Part 1 - Two pair", () => {
    expect(typeOfHand("QQJJ5")).toEqual(Hand.TwoPair)
  })

  test("Part 1 - One pair", () => {
    expect(typeOfHand("11A4Q")).toEqual(Hand.OnePair)
  })

  test("Part 1 - High card", () => {
    expect(typeOfHand("Q841JT")).toEqual(Hand.HighCard)
  })

  test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(6440)
  })

  test("Part 1 - Example input 2 - Ordering 1", () => {
    expect(solvePart1(`
QQQKA 28
QQQK9 684
QQQK8 765
QQQJA 483
QQQ8A 220
    `.trim())).toEqual(28 * 5 + 684 * 4 + 765 * 3 + 483 * 2 + 220 * 1)
  })

  test("Part 1 - Example input 2 - Ordering 2", () => {
    expect(solvePart1(`
QQQK8 765
QQQKA 28
QQQK9 684
QQQJA 483
QQQ8A 220
    `.trim())).toEqual(28 * 5 + 684 * 4 + 765 * 3 + 483 * 2 + 220 * 1)
  })

  test("Part 1 - Example input 2 - Ordering 3", () => {
    expect(solvePart1(`
QQQ8A 220
QQQK8 765
QQQKA 28
QQQK9 684
QQQJA 483
    `.trim())).toEqual(28 * 5 + 684 * 4 + 765 * 3 + 483 * 2 + 220 * 1)
  })

  test("Part 1 - Example input 2 - Ordering 4", () => {
    expect(solvePart1(`
QQQK9 684
QQQ8A 220
QQQK8 765
QQQKA 28
QQQJA 483
    `.trim())).toEqual(28 * 5 + 684 * 4 + 765 * 3 + 483 * 2 + 220 * 1)
  })
  
  test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(250254244)
  })

  test("Part 2 - Joker - Five of a kind", () => {
    expect(typeOfHandWithJoker("AAAAA")).toEqual(Hand.FiveOfAKind)
    expect(typeOfHandWithJoker("AAAAJ")).toEqual(Hand.FiveOfAKind)
    expect(typeOfHandWithJoker("AAAJJ")).toEqual(Hand.FiveOfAKind)
    expect(typeOfHandWithJoker("AAJJJ")).toEqual(Hand.FiveOfAKind)
    expect(typeOfHandWithJoker("AJJJJ")).toEqual(Hand.FiveOfAKind)
    expect(typeOfHandWithJoker("JJJJJ")).toEqual(Hand.FiveOfAKind)
  })

  test("Part 2 - Joker - Four of a kind", () => {
    expect(typeOfHandWithJoker("8888Q")).toEqual(Hand.FourOfAKind)
    expect(typeOfHandWithJoker("J888Q")).toEqual(Hand.FourOfAKind)
    expect(typeOfHandWithJoker("JJ88Q")).toEqual(Hand.FourOfAKind)
    expect(typeOfHandWithJoker("JJJ8Q")).toEqual(Hand.FourOfAKind)
    expect(typeOfHandWithJoker("QQJJ5")).toEqual(Hand.FourOfAKind)
  })

  test("Part 2 - Joker - Full house", () => {
    expect(typeOfHandWithJoker("22233")).toEqual(Hand.FullHouse)
    expect(typeOfHandWithJoker("J2233")).toEqual(Hand.FullHouse)
  })

  test("Part 2 - Joker - Three of a kind", () => {
    expect(typeOfHandWithJoker("66613")).toEqual(Hand.ThreeOfAKind)
    expect(typeOfHandWithJoker("66J13")).toEqual(Hand.ThreeOfAKind)
    expect(typeOfHandWithJoker("6JJ13")).toEqual(Hand.ThreeOfAKind)
    expect(typeOfHandWithJoker("QQJA5")).toEqual(Hand.ThreeOfAKind)
  })
  
  test("Part 2 - Joker - Two pair", () => {
    expect(typeOfHandWithJoker("66113")).toEqual(Hand.TwoPair)
  })

  test("Part 2 - Joker - One pair", () => {
    expect(typeOfHandWithJoker("J1A4Q")).toEqual(Hand.OnePair)
  })

  test("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(5905)
  })
  
  test("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(250087440)
  })
})
