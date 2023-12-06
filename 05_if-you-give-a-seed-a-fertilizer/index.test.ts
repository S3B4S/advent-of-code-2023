import { solvePart1, solvePart2 } from ".";
import { expect, test } from 'bun:test'
import { getFileInput, testWrapper } from "@/utils/misc";

const fileInput = getFileInput(import.meta.dir)
const exampleInput = `
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`.trim()

testWrapper(`Day 05`, () => {
  test.skip("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(0)
  })
  
  test.skip("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(0)
  })

  test("Part 2 - Example input 1", () => {
    expect(solvePart2(`seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48`.trim()).minimum).toEqual(57)
  })

  test("Part 2 - Example input 2", () => {
    expect(solvePart2(`seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15`.trim()).minimum).toEqual(57)
  })

  test("Part 2 - Example input 3", () => {
    expect(solvePart2(`seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4
`.trim()).minimum).toEqual(53)
  })

  test("Part 2 - Example input 4", () => {
    expect(solvePart2(`seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70
`.trim()).minimum).toEqual(46)
  })

  test("Part 2 - Case 1", () => {
    expect(solvePart2(`seeds: 50 11

seed-to-soil map:
2 53 13
`.trim()).minimum).toEqual(2) // Outcome: [50, 3], [2, 8]
  })

  test("Part 2 - Case 1 - End of seed range === start of source range", () => {
    expect(solvePart2(`seeds: 50 11

seed-to-soil map:
2 60 13
`.trim()).minimum).toEqual(2) // Outcome: [2, 1], [50, 10]
  })

  test("Part 2 - Case 2", () => {
    expect(solvePart2(`seeds: 50 11

seed-to-soil map:
100 3 55
`.trim()).minimum).toEqual(58) // Outcome: [100, 8], [58, 4]
  })

  test("Part 2 - Case 2 - Start of seed range === end of source range", () => {
    expect(solvePart2(`seeds: 50 11

seed-to-soil map:
110 40 11
`.trim()).minimum).toEqual(51) // Outcome: [120, 1], [51, 10]
  })

  test("Part 2 - Case 3 - Breaks in 3 parts", () => {
    expect(solvePart2(`seeds: 50 11

seed-to-soil map:
100 53 3
`.trim()).minimum).toEqual(50) // Outcome: [50, 3], [100, 3], [56, 5]
  })

  test("Part 2 - Case 3 - Starts are the same", () => {
    expect(solvePart2(`seeds: 50 11

seed-to-soil map:
100 53 8
`.trim()).minimum).toEqual(50) // Outcome: [50, 3], [100, 3], [56, 5]
  })

  test("Part 2 - Case 3 - Ends are the same", () => {
    expect(solvePart2(`seeds: 50 11

seed-to-soil map:
100 50 3
`.trim()).minimum).toEqual(53) // Outcome: [100, 3], [53, 8]
  })

  test("Part 2 - Case 4 - Both ends out of boundary", () => {
    expect(solvePart2(`seeds: 50 11

seed-to-soil map:
100 40 31
`.trim()).minimum).toEqual(110) // Outcome: [110, 11]
  })

  test("Part 2 - Case 4 - Map source start on boundary", () => {
    expect(solvePart2(`seeds: 50 11

seed-to-soil map:
100 50 31
`.trim()).minimum).toEqual(100) // Outcome: [110, 11]
  })

  test("Part 2 - Case 4 - Map source end on boundary", () => {
    expect(solvePart2(`seeds: 50 11

seed-to-soil map:
100 40 21
`.trim()).minimum).toEqual(110) // Outcome: [110, 11]
  })

  test("Part 2 - Example input all", () => {
    expect(solvePart2(exampleInput).minimum).toEqual(46)
  })

  // Both ends "outside" bonds
  test("Part 2 - Sourcerange both ends outside & new range is minimum", () => {
    expect(solvePart2(`
seeds: 50 11

seed-to-soil map:
100 40 21
    `.trim()).minimum).toEqual(110) // [110, 11]
  })

  test("Part 2 - Sourcerange both ends on boundaries", () => {
    expect(solvePart2(`
seeds: 50 11

seed-to-soil map:
47 50 11
    `.trim()).minimum).toEqual(47) // [47, 11]
  })

  test("Part 2 - Sourcerange start outside, end on boundary", () => {
    expect(solvePart2(`
seeds: 50 11

seed-to-soil map:
47 40 21
    `.trim()).minimum).toEqual(57) // [57, 11]
  })

  test("Part 2 - Sourcerange start on boundary, end outside", () => {
    expect(solvePart2(`
seeds: 50 11

seed-to-soil map:
90 50 21
    `.trim()).minimum).toEqual(90) // [90, 11]
  })
  
  test("Part 2 - Sourcerange start outside, end in between", () => {
    expect(solvePart2(`
seeds: 50 11

seed-to-soil map:
90 40 15
    `.trim()).minimum).toEqual(55) // [55, 6], [100, 5]
  })

  test("Part 2 - Sourcerange start outside, end on start boundary", () => {
    expect(solvePart2(`
seeds: 50 11

seed-to-soil map:
2 40 11
    `.trim()).minimum).toEqual(12) // [12, 1] [51, 10]
  })

  test("Part 2 - Sourcerange end outside, start in between", () => {
    const res = solvePart2(`
seeds: 50 11

seed-to-soil map:
2 55 46`.trim())
    expect(res.minimum).toEqual(2)
    expect(res.seedRanges.sort()).toEqual([[2, 6], [50, 5]].sort())
  })

  test("Part 2 - Sourcerange end outside, start on end boundary", () => {
    const res = solvePart2(`
seeds: 50 11

seed-to-soil map:
2 60 41`.trim())
    expect(res.minimum).toEqual(2)
    expect(res.seedRanges.sort()).toStrictEqual([[50, 10], [2, 1]].sort())
  })

  test("Part 2 - Sourcerange both ends within boundaries", () => {
    const res = solvePart2(`
seeds: 50 11

seed-to-soil map:
134 52 4`.trim())
    expect(res.minimum).toEqual(50)
    expect(res.seedRanges.sort()).toStrictEqual([[50, 2], [134, 4], [56, 5]].sort())
  })

  test("Part 2 - Sourcerange start on start boundary, end within boundaries", () => {
    const res = solvePart2(`
seeds: 50 11

seed-to-soil map:
0 50 4`.trim())
    expect(res.minimum).toEqual(0)
    expect(res.seedRanges.sort()).toStrictEqual([[54, 7], [0, 4]].sort())
  })

  test("Part 2 - Sourcerange end on end boundary, start within boundaries", () => {
    const res = solvePart2(`
seeds: 50 11

seed-to-soil map:
9876 57 4`.trim())
    expect(res.minimum).toEqual(50)
    expect(res.seedRanges.sort()).toStrictEqual([[50, 7], [9876, 4]].sort())
  })

  test("Part 2 - Example input 2.1", () => {
    const res = solvePart2(`
seeds: 8 16 27 2 34 21

seed-to-soil map:
51 21 7
2 42 21`.trim())
    expect(res.minimum).toEqual(2)
    expect(res.seedRanges.sort()).toStrictEqual([[8, 13], [51, 3], [57, 1], [28, 1], [34, 8], [2, 13]].sort())
  })
    
  test("Part 2 - Example input 2.2", () => {
    const res = solvePart2(`
seeds: 8 16 27 2 34 21

seed-to-soil map:
51 21 7
2 42 21

soil-to-fertilizer map:
5000 13 48`.trim())
    expect(res.minimum).toEqual(2)
    expect(res.seedRanges.sort()).toStrictEqual([
      [8, 5],
      [5000, 8],
      [5038, 3],
      [5044, 1],
      [5015, 1],
      [5021, 8],
      [2, 11],
      [5000, 2]
    ].sort())
  })
    
  test("Part 2 - File input", () => {
    expect(solvePart2(fileInput).minimum).toEqual(0)
  })
})

// 9357724: not it.
// 83479719: too high
