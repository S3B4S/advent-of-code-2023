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

export const addCoordinate = (base: CoordinateRecord, toAdd: CoordinateRecord) => ({
  y: base.y + toAdd.y,
  x: base.x + toAdd.x,
})

export interface CoordinateRecord {
  y: Row,
  x: Column,
}

export const coordinateToString = (c: CoordinateRecord) => `${c.y},${c.x}`

// @TODO would be cool if I could pass in record as characters as type parameter to board
/**
 * m x n board
 * - Access by y / row first, then by x / column
 * - Positive coordinates only
 * - y coordinates grow positive as going downwards / south
 * - x coordinates grow positive as going rightwards / east
 */
export class Board {
  content: string[][]

  constructor(boardStr: string) {
    this.content = boardStr.split('\n').map(l => l.split(''))
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
  set(c: CoordinateRecord, tile: string) {
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

  forEach(fn: (tile: string, coordinate: CoordinateRecord) => any) {
    return this.content.forEach((row, rowI) => row.forEach((tile, colI) => fn(tile, { y: rowI, x: colI })))
  }

  adjacentCoordinates(coord: CoordinateRecord, limitedTo?: Direction[]) {
    // @TODO Check why Object.keys is unsafe
    const checkDirections: Direction[] = limitedTo ?? (Object.keys(relativeCoordinates) as unknown as Direction[])
    
    return checkDirections
      .map(dir => addCoordinate(relativeCoordinates[dir], coord))
      .filter(c => !(c.x < 0 || c.y < 0))
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
