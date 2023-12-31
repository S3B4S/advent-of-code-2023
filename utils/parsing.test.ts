import { expect, test } from 'bun:test'
import { Board } from './parsing'

test("Board - insert column in between", () => {
  const board = new Board<string>(`
123
456
  `.trim())

  expect(board.insertColumn(1, ["5", "6"])).toBeTrue()
  expect(board.content).toEqual([
    ["1", "5", "2", "3"],
    ["4", "6", "5", "6"],
  ])
})

test("Board - insert column at start", () => {
  const board = new Board<string>(`
123
456
  `.trim())

  expect(board.insertColumn(0, ["5", "6"])).toBeTrue()
  expect(board.content).toEqual([
    ["5", "1", "2", "3"],
    ["6", "4", "5", "6"],
  ])
})

test("Board - insert column at end", () => {
  const board = new Board<string>(`
123
456
  `.trim())

  expect(board.insertColumn(3, ["5", "6"])).toBeTrue()
  expect(board.content).toEqual([
    ["1", "2", "3", "5"],
    ["4", "5", "6", "6"],
  ])
})

test("Board - insert column of unequal length", () => {
  const board = new Board<string>(`
123
456
  `.trim())

  expect(board.insertColumn(3, ["5", "6", "7"])).toBeFalse()
  expect(board.content).toEqual([
    ["1", "2", "3"],
    ["4", "5", "6"],
  ])
})

test("Board - insert row in between", () => {
  const board = new Board<string>(`
123
456
  `.trim())

  expect(board.insertRow(1, ["5", "6", "7"])).toBeTrue()
  expect(board.content).toEqual([
    ["1", "2", "3"],
    ["5", "6", "7"],
    ["4", "5", "6"],
  ])
})

test("Board - insert row at start", () => {
  const board = new Board<string>(`
123
456
  `.trim())

  expect(board.insertRow(0, ["5", "6", "7"])).toBeTrue()
  expect(board.content).toEqual([
    ["5", "6", "7"],
    ["1", "2", "3"],
    ["4", "5", "6"],
  ])
})

test("Board - insert row at end", () => {
  const board = new Board<string>(`
123
456
  `.trim())

  expect(board.insertRow(2, ["5", "6", "7"])).toBeTrue()
  expect(board.content).toEqual([
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["5", "6", "7"],
  ])
})

test("Board - insert row of unequal length", () => {
  const board = new Board<string>(`
123
456
  `.trim())

  expect(board.insertRow(2, ["5", "6"])).toBeFalse()
  expect(board.content).toEqual([
    ["1", "2", "3"],
    ["4", "5", "6"],
  ])
})

test("Board - transpose", () => {
  const board = new Board<string>(`
123
456
  `.trim())

  expect(board.transpose().content).toEqual([
    ["1", "4"],
    ["2", "5"],
    ["3", "6"],
  ])
})

test("Board - transpose twice restores to original", () => {
  const board = new Board<string>(`
123
456
  `.trim())

  expect(board.transpose().transpose().content).toEqual([
    ["1", "2", "3"],
    ["4", "5", "6"],
  ])
})

test("Board - iterate columns", () => {
  const board = new Board<string>(`
123
456
  `.trim())

  const columns = [] as string[][]
  board.iterateColumns(column => columns.push(column))

  expect(columns).toEqual([
    ["1", "4"],
    ["2", "5"],
    ["3", "6"],
  ])
})

test("Board - iterate rows", () => {
  const board = new Board<string>(`
123
456
  `.trim())

  const rows = [] as string[][]
  board.iterateRows(row => rows.push(row))

  expect(rows).toEqual([
    ["1", "2", "3"],
    ["4", "5", "6"],
  ])
})
