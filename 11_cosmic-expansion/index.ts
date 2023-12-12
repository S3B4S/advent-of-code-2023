import { Board, CoordinateRecord } from "@/utils/parsing"

export const solvePart1 = (input: string) => {
  const board = new Board<'.' | '#'>(input.trim())
  const columnsIndicesToDuplicate = board.columns().flatMap((column, index) => column.every(row => row === ".") ? index : [])
  const rowsIndicesToDuplicate = board.rows().flatMap((row, index) => row.every(column => column === ".") ? index : [])

  let incrementBy = 0
  columnsIndicesToDuplicate.forEach(index => {
    board.insertColumn(index + incrementBy, board.columns()[index + incrementBy])
    incrementBy++
  })

  incrementBy = 0
  rowsIndicesToDuplicate.forEach(index => {
    board.insertRow(index + incrementBy, board.rows()[index + incrementBy])
    incrementBy++
  })

  const galaxyPositions = board.asArray()
    .filter(cell => cell.tile === "#")
    .map(cell => cell.coord)

  // O(n^2) but n is small
  let totalDistance = 0
  let count = 0
  for (let i = 0; i < galaxyPositions.length; i++) {
    for (let j = i; j < galaxyPositions.length; j++) {
      if (i === j) continue
      const coord1 = galaxyPositions[i]
      const coord2 = galaxyPositions[j]
      
      // Manhatten distance between the two coords
      const distance = Math.abs(coord1.x - coord2.x) + Math.abs(coord1.y - coord2.y)
      count++
      totalDistance += distance
    }
  }
  
  return totalDistance
}

// We can also just take a look at how many "empty" rows/columns
// The distance between two galaxy cross
// And then take that into account in the math
export const solvePart2 = (input: string, expandBy: number) => {
  const board = new Board(input.trim())
  const columnsIndicesToDuplicate = board.columns().flatMap((column, index) => column.every(row => row === ".") ? index : [])
  const rowsIndicesToDuplicate = board.rows().flatMap((row, index) => row.every(column => column === ".") ? index : [])

  const galaxyPositions = [] as CoordinateRecord[]
  board.forEach((tile, coord) => {
    if (tile === "#") {
      galaxyPositions.push(coord)
    }
  })

  // O(n^2) but n is small
  let totalDistance = 0
  let count = 0
  for (let i = 0; i < galaxyPositions.length; i++) {
    for (let j = i; j < galaxyPositions.length; j++) {
      if (i === j) continue
      const coord1 = galaxyPositions[i]
      const coord2 = galaxyPositions[j]
    
      // Count the amount of empty rows/columns before the two coords
      let amountEmptyColsCoord1 = 0
      let amountEmptyColsCoord2 = 0
      columnsIndicesToDuplicate.forEach(index => {
        if (isInBetween(0, index, coord1.x)) {
          amountEmptyColsCoord1++
        }

        if (isInBetween(0, index, coord2.x)) {
          amountEmptyColsCoord2++
        }
      })

      let amountEmptyRowsCoord1 = 0
      let amountEmptyRowsCoord2 = 0
      rowsIndicesToDuplicate.forEach(index => {
        if (isInBetween(0, index, coord1.y)) {
          amountEmptyRowsCoord1++
        }

        if (isInBetween(0, index, coord2.y)) {
          amountEmptyRowsCoord2++
        }
      })

      const movedCoord1 = {
        ...coord1,
        x: coord1.x + amountEmptyColsCoord1 * (expandBy - 1),
        y: coord1.y + amountEmptyRowsCoord1 * (expandBy - 1)
      }

      // For every empty row/column, we need to push the target further away by expandBy
      const movedCoord2 = {
        ...coord2,
        x: coord2.x + amountEmptyColsCoord2 * (expandBy - 1),
        y: coord2.y + amountEmptyRowsCoord2 * (expandBy - 1)
      }

      const distance = Math.abs(movedCoord1.x - movedCoord2.x) + Math.abs(movedCoord1.y - movedCoord2.y)
      count++
      totalDistance += distance
    }
  }

  return totalDistance;
}

const isInBetween = (x: number, a: number, y: number) => a >= x && a <= y
