/**
 * Parses a string of lines into an array of lines
 * 
 * For example:
 * 541532
 * 453215123
 * 315321
 * 5321523
 * 53215113
 * 
 * Returns:
 * ['541532', '453215123', '315321', '5321523', '53215113']
 */
export const parseInputLines = (input: string) => {
  return input.trim().split('\n')
}

/**
 * Parses "blocks" of lines, where each block has a double newline between
 * 
 * For example:
 * 541532
 * 453215123
 * 
 * 315321
 * 5321523
 * 53215113
 * 
 * 351252
 * 3211235
 * 
 * 5312523
 * 
 * Returns:
 * [
 *   ['541532', '453215123'],
 *   ['315321', '5321523', '53215113'],
 *   ['351252', '3211235'],
 *   ['5312523'],
 * ]
 */
export const parseInputBlocks = (input: string) => {
  return input
    .split('\n\n')
    .map(block => block.split('\n')
    .filter(substr => substr !== ""))
}

export const Characters = {
  WhiteRetroBlock: "█",  
  Space: " ",
  Dot: ".",
  HashTag: "#",
  Tilde: "~",
  Star: "*",
  Plus: "+",
  At: "@",
}

export type Row = number
export type Column = number
export type Coordinate = [Row, Column]
export enum Direction {
  NorthWest = "NW",
  North = "N",
  NorthEast = "NE",
  East = "E",
  SouthEast = "SE",
  South = "S",
  SouthWest = "SW",
  West = "W",
}

export const relativeCoordinates: Record<Direction, CoordinateRecord> = {
  [Direction.NorthWest]: { y: -1, x: -1 },
  [Direction.North]: { y: -1, x: 0 },
  [Direction.NorthEast]: { y: -1, x: 1 },
  [Direction.East]: { y: 0, x: 1 },
  [Direction.SouthEast]: { y: 1, x: 1 },
  [Direction.South]: { y: 1, x: 0 },
  [Direction.SouthWest]: { y: 1, x: -1 },
  [Direction.West]: { y: 0, x: -1 },
}

export const relativeDirection = (from: CoordinateRecord, to: CoordinateRecord): Direction | undefined => {
  const relativeCoordinate = {
    y: to.y - from.y,
    x: to.x - from.x,
  }

  return Object.entries(relativeCoordinates).find(([, coord]) => coord.y === relativeCoordinate.y && coord.x === relativeCoordinate.x)?.[0] as Direction | undefined
}

export const addCoordinate = (base: CoordinateRecord, toAdd: CoordinateRecord) => ({
  y: base.y + toAdd.y,
  x: base.x + toAdd.x,
})

export interface CoordinateRecord {
  y: Row,
  x: Column,
}

// @TODO update coordinateToString to serialiseCoord
export const coordinateToString = (c: CoordinateRecord) => `${c.y},${c.x}`
export const serialiseCoord = coordinateToString

export const coordStringToCoordRecord = (s: string): CoordinateRecord => {
  const [y, x] = s.split(',').map(Number)
  return { y, x }
}
export const unserialiseCoord = coordStringToCoordRecord

// @TODO would be cool if I could pass in record as characters as type parameter to board
/**
 * m x n board
 * - Access by y / row first, then by x / column
 * - Positive coordinates only
 * - y coordinates grow positive as going downwards / south
 * - x coordinates grow positive as going rightwards / east
 */
export class Board<T> {
  content: T[][]

  constructor(boardStr: string) {
    this.content = boardStr.split('\n').map(l => l.split('')) as T[][]
  }

  /**
   * @param c coordinate of the tile to get
   * @returns contents of the tile
   */
  get(c: CoordinateRecord) {
    return this.content[c.y] && this.content[c.y][c.x]
  }

  /**
   * @param c the coordinate where to update the tile
   * @param tile the tile to put in
   * @returns boolean depending on whether setting the value succeeded or not
   */
  set(c: CoordinateRecord, tile: T) {
    if (!(this.content[c.y] && this.content[c.y][c.x])) {
      return false
    }

    this.content[c.y][c.x] = tile
    return true
  }

  amountRows() {
    return this.content.length
  }

  amountColumns() {
    return this.content[0].length
  }

  transpose(): Board<T> {
    const transposedContent: T[][] = [];
    for (let i = 0; i < this.amountColumns(); i++) {
      const column: T[] = [];
      for (let j = 0; j < this.amountRows(); j++) {
        column.push(this.content[j][i]);
      }
      transposedContent.push(column);
    }
    return new Board<T>(transposedContent.map(row => row.join('')).join('\n'));
  }

  intersperse(seperator: T) {
    const newColumns = this.content.map(column => column.flatMap((tile, i) => i === column.length - 1 ? [tile] : [tile, seperator]))
    const newAmountColumns = newColumns[0].length
    const rowToIntersperse = [] as T[]
    for (let i = 0; i < newAmountColumns; i++) {
      rowToIntersperse.push(seperator)
    }

    const newRows = newColumns.flatMap((row, i) => i === this.amountRows() - 1 ? [[...row]] : [[...row], [...rowToIntersperse]])
    this.content = newRows as T[][]
  }

  iterateColumns(fn: (column: T[], i: number) => any) {
    return this.transpose().content.forEach(fn)
  }

  columns() {
    return this.transpose().content
  }

  rows() {
    return this.content
  }

  iterateRows(fn: (row: T[], i: number) => any) {
    return this.content.forEach(fn)
  }

  insertColumn(c: Column, column: T[]) {
    if (column.length !== this.amountRows()) {
      return false /* Column should be as big as the other ones */
    }

    this.content = this.content.map((row, i) => {
      const newRow = [...row]
      newRow.splice(c, 0, column[i])
      return newRow
    })

    return true
  }

  insertRow(r: Row, row: T[]) {
    if (row.length !== this.amountColumns()) {
      return false /* Row should be as big as the other ones */
    }

    this.content.splice(r, 0, row)
    return true
  }

  isOnBounds(coord: CoordinateRecord) {
    return coord.y === 0 || coord.x === 0 || coord.y === this.amountRows() - 1 || coord.x === this.amountColumns() - 1
  }

  isOutsideBounds(coord: CoordinateRecord) {
    return coord.y < 0 || coord.x < 0 || coord.y >= this.amountRows() || coord.x >= this.amountColumns()
  }

  forEach(fn: (tile: T, coordinate: CoordinateRecord) => any) {
    return this.content.forEach((row, rowI) => row.forEach((tile, colI) => fn(tile, { y: rowI, x: colI })))
  }

  find(tile: T): CoordinateRecord {
    const y = this.content.findIndex(row => row.includes(tile))
    const x = this.content[y].indexOf(tile)
    return { x, y }
  }

  adjacentCoordinates(coord: CoordinateRecord, limitedTo?: Direction[]) {
    // @TODO Check why Object.keys is unsafe
    const checkDirections: Direction[] = limitedTo ?? (Object.keys(relativeCoordinates) as unknown as Direction[])
    
    return checkDirections
      .map(dir => addCoordinate(relativeCoordinates[dir], coord))
      .filter(c => !this.isOutsideBounds(c))
  }

  adjacentTiles(coord: CoordinateRecord, limitedTo?: Direction[]) {
    const coords = this.adjacentCoordinates(coord, limitedTo)
    return coords.map(c => this.get(c))
  }

  adjacentTilesWithCoordinates(coord: CoordinateRecord, limitedTo?: Direction[]) {
    const coords = this.adjacentCoordinates(coord, limitedTo)
    return coords.map(c => ({
      ...c,
      tile: this.get(c)
    }))
  }

  toString() {
    return this.content.map(l => l.join('')).join('\n')
  }
}
