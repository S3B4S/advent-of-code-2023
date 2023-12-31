import { Board, CoordinateRecord, Direction, serialiseCoord, stepInDirection, unserialiseCoord } from "@/utils/parsing"
import { P, match } from "ts-pattern"


const tiles = {
  "|": {
    moveIn(dir: Direction) {
      return match(dir)
        .with(P.union(Direction.East, Direction.West), () => [Direction.North, Direction.South])
        .with(Direction.North, () => [Direction.North])
        .with(Direction.South, () => [Direction.South])
        .otherwise(() => [])
    },
  },
  "-": {
    moveIn(dir: Direction) {
      return match(dir)
        .with(P.union(Direction.North, Direction.South), () => [Direction.East, Direction.West])
        .with(Direction.East, () => [Direction.East])
        .with(Direction.West, () => [Direction.West])
        .otherwise(() => [])
    },
  },
  ".": {
    moveIn(dir: Direction) {
      return match(dir)
        .with(Direction.North, () => [Direction.North])
        .with(Direction.East, () => [Direction.East])
        .with(Direction.South, () => [Direction.South])
        .with(Direction.West, () => [Direction.West])
        .otherwise(() => [])
    }
  },
  "/": {
    moveIn(dir: Direction) {
      return match(dir)
        .with(Direction.North, () => [Direction.East])
        .with(Direction.East, () => [Direction.North])
        .with(Direction.South, () => [Direction.West])
        .with(Direction.West, () => [Direction.South])
        .otherwise(() => [])
    },
  },
  "\\": {
    moveIn(dir: Direction) {
      return match(dir)
        .with(Direction.North, () => [Direction.West])
        .with(Direction.East, () => [Direction.South])
        .with(Direction.South, () => [Direction.East])
        .with(Direction.West, () => [Direction.North])
        .otherwise(() => [])
    },
  },
}

type Tile = keyof typeof tiles

type Beam = {
  currentPos: CoordinateRecord,
  currentDirection: Direction,
}
export const solvePart1 = (input: string, startingBeam: Beam = {
  currentPos: { x: 0, y: 0 },
  currentDirection: Direction.East,
}) => {
  const board = new Board<Tile>(input)

  let beams: Beam[] = [startingBeam]

  const history = new Set<string>()
  while (beams.length > 0) {
    const newBeams: Beam[] = []
    beams.forEach((beam) => {
      // See how we need to step out of current tile
      history.add(serialiseCoord(beam.currentPos) + '|' + beam.currentDirection)
      
      const nextPositions = tiles[board.get(beam.currentPos)]
        .moveIn(beam.currentDirection)
        .map((dir) => ({ coord: stepInDirection(beam.currentPos, dir), dir }))

      nextPositions.forEach((nextPos) => {
        if (board.isOutsideBounds(nextPos.coord) || history.has(serialiseCoord(nextPos.coord) + '|' + nextPos.dir)) return
        
        newBeams.push({
          currentPos: nextPos.coord,
          currentDirection: nextPos.dir,
        })
      })
    })

    beams = newBeams
  }

  // Paint the board for debugging
  [...history.values()].map(pos => {
    const [coord, dir] = pos.split('|')
    const { y, x } = unserialiseCoord(coord)
    board.mapCell({ y, x }, () => match(dir)
      .with(Direction.North, () => '^')
      .with(Direction.East, () => '>')
      .with(Direction.South, () => 'v')
      .with(Direction.West, () => '<')
      .otherwise(() => 'X') as Tile
    )
  })

  // Now from the history, we should only count the unique coordinates
  const allPositions = new Set<string>()
  history.forEach((pos) => {
    const [coord] = pos.split('|')
    allPositions.add(coord)
  })

  return allPositions.size
}

// This could be optimised by memoisation,
// where if you know if you move from coord X in direction Y, 
// you will light up Z amount of tiles.
// Would be a fun one to implement later.
export const solvePart2 = (input: string) => {
  const board = new Board<Tile>(input)
  const allAmounts = []

  for (const rowI of [0, board.amountRows() - 1]) {
    for (let colI = 0; colI < board.amountColumns(); colI++) {
      allAmounts.push(solvePart1(input, { currentPos: { y: rowI, x: colI }, currentDirection: rowI === 0 ? Direction.South : Direction.North} ))
    }
  }

  for (const colI of [0, board.amountColumns() - 1]) {
    for (let rowI = 0; rowI < board.amountRows(); rowI++) {
      allAmounts.push(solvePart1(input, { currentPos: { y: rowI, x: colI }, currentDirection: colI === 0 ? Direction.East : Direction.West} ))
    }
  }
  
  return Math.max(...allAmounts)
}
