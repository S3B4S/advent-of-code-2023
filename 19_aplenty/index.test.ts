import { minusInterval, minusIntervalFromList, overlapInInterval, solvePart1, solvePart2 } from ".";
import { expect, test } from 'bun:test'
import { getFileInput, testWrapper } from "@/utils/misc";

const fileInput = getFileInput(import.meta.dir)
const exampleInput = `
px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}
`.trim()

testWrapper(`Day 19`, () => {
  test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(19114)
  })
  
  test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(402185)
  })

  test("Part 2 - Interval", () => {
    expect(overlapInInterval({
      gte: 0,
      lte: 1000,
    }, {
      gte: 500,
      lte: 1500,
    })).toStrictEqual({
      gte: 500,
      lte: 1000,
    })
  })

  test("Part 2 - Interval encapsulating", () => {
    expect(overlapInInterval({
      gte: 500,
      lte: 1000,
    }, {
      gte: 200,
      lte: 1500,
    })).toStrictEqual({
      gte: 500,
      lte: 1000,
    })
  })

  test("Part 2 - No interval", () => {
    expect(overlapInInterval({ gte: 3, lte: 4 }, { gte: 5, lte: 6 })).toStrictEqual({
      gte: 0,
      lte: 0,
    })
  })

  test("Part 2 - Minus interval - No overlap", () => {
    expect(minusInterval({
      gte: 0,
      lte: 1000,
    }, {
      gte: 1002,
      lte: 1500,
    })).toStrictEqual([{
      gte: 0,
      lte: 1000,
    }])
  })

  test("Part 2 - Minus interval - equal", () => {
    expect(minusInterval({
      gte: 0,
      lte: 1000,
    }, {
      gte: 0,
      lte: 1000,
    })).toStrictEqual([{
      gte: 0,
      lte: 0,
    }])
  })

  test("Part 2 - Minus interval - start equal, b bigger", () => {
    expect(minusInterval({
      gte: 0,
      lte: 1000,
    }, {
      gte: 0,
      lte: 1200,
    })).toStrictEqual([{
      gte: 0,
      lte: 0,
    }])
  })

  test("Part 2 - Minus interval - start equal, b smaller", () => {
    expect(minusInterval({
      gte: 0,
      lte: 1000,
    }, {
      gte: 0,
      lte: 800,
    })).toStrictEqual([{
      gte: 801,
      lte: 1000,
    }])
  })

  test("Part 2 - Minus interval - End equal, b bigger", () => {
    expect(minusInterval({
      gte: 200,
      lte: 1000,
    }, {
      gte: 0,
      lte: 1000,
    })).toStrictEqual([{
      gte: 0,
      lte: 0,
    }])
  })

  test("Part 2 - Minus interval - End equal, b smaller", () => {
    expect(minusInterval({
      gte: 200,
      lte: 1000,
    }, {
      gte: 400,
      lte: 1000,
    })).toStrictEqual([{
      gte: 200,
      lte: 399,
    }])
  })

  test("Part 2 - Minus interval - Cuts at end", () => {
    expect(minusInterval({
      gte: 0,
      lte: 1000,
    }, {
      gte: 500,
      lte: 1500,
    })).toStrictEqual([{
      gte: 0,
      lte: 499,
    }])
  })

  test("Part 2 - Minus interval - Splits interval", () => {
    expect(minusInterval({
      gte: 0,
      lte: 1000,
    }, {
      gte: 200,
      lte: 800,
    })).toStrictEqual([{
      gte: 0,
      lte: 199,
    }, {
      gte: 801,
      lte: 1000,
    }])
  })

  test("Part 2 - Minus interval from list", () => {
    expect(minusIntervalFromList({
      gte: 0,
      lte: 1000,
    }, [{
      gte: 200,
      lte: 800,
    }, {
      gte: 900,
      lte: 1500,
    }])).toStrictEqual([{
      gte: 0,
      lte: 199,
    }, {
      gte: 801,
      lte: 899,
    }])
  })

  test("Part 2 - Small example", () => {
    expect(solvePart2(`
in{x<2:px,R}
px{m<2:gd,R}
gd{a<3:qe,R}
qe{s<1:A,R}
    `.trim(), 0, 10)).toEqual(12)
  })

  test("Part 2 - Small example", () => {
    expect(solvePart2(`
in{x<3:px,R}
px{m>3:mm,R}
mm{m<7:gd,R}
gd{a<11:qe,R}
qe{s<5:A,R}
    `.trim(), 0, 10)).toEqual(3 * 3 * 11 * 5)
  })

  // Not sure if this is still correct
  test("Part 2 - Small example - Overlap, second interval does add some more combinations", () => {
    expect(solvePart2(`
in{x<3:px,in2}
px{m>3:mm,R}
mm{m<7:gd,R}
gd{a<11:qe,R}
qe{s<5:A,R}
in2{x<4:aa,R}
aa{m>3:hh,R}
hh{m<6:bb,R}
bb{a<3:cc,R}
cc{s<3:A,R}
    `.trim(), 0, 10)).toEqual(3 * 3 * 11 * 5 + 1 * 2 * 3 * 3)
  })


  test("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(167409079868000)
  })
  
  test("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(130291480568730)
  })
})
