import { Board, CoordinateRecord } from "@/utils/parsing"

export const solvePart1 = (input: string) => {
  const board = new Board(input.trim())
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
      
      // Manhatten distance between the two coords
      const distance = Math.abs(coord1.x - coord2.x) + Math.abs(coord1.y - coord2.y)
      count++
      totalDistance += distance
    }
  }
  
  return totalDistance
}

export const solvePart2 = (input: string) => {
  return 0
}
