import { Queue } from "@/utils/adt"
import { Board, Characters, CoordinateRecord, parseInputLines, serialiseCoord, unserialiseCoord } from "@/utils/parsing"
import chalk from "chalk"
import { match } from "ts-pattern"

type Direction = 'East' | 'West' | 'North' | 'South'
type Color = string
type Instruction = [Direction, number, Color]

export const solvePart1 = (input: string) => {
  const instructions = parseInputLines(input)
    .map(line => {
      const [dir, amount, color] = line.split(/\W+/).slice(0, -1)
      
      const direction = match(dir)
        .with('R', () => 'East')
        .with('L', () => 'West')
        .with('U', () => 'North')
        .with('D', () => 'South')
        .otherwise(() => { throw new Error(`Unknown direction ${dir}`) })

      return [direction, parseInt(amount), color] as Instruction
    })
  
  const row = `.`.repeat(450) + '\n'
  const b = row.repeat(450)

  const board = new Board(b)
  const iterator = board.iterateInDirection({ y: 50, x: 20 })

  let countWall = 0
  for (const instruction of instructions) {
    
    for (let i = 0; i < instruction[1]; i++) {
      const currentPos = iterator[instruction[0]]()!
      
      board.mapCell(currentPos.coordinate, _ => Characters.HashTag)
      countWall = countWall + 1
    }
  }

  
  // @TODO - This is a hacky way to get a random point inside the board, and only works when we know the actual input
  // Random point which will be in the middle of the board (confirmed after running and inspecting the output)
  const randomPointInside = { x: 50, y: 50 }
  board.mapCell(randomPointInside, _ => chalk.green(Characters.WhiteRetroBlock))

  // We start the fill from here onwards
  const queue = new Queue<CoordinateRecord>()
  const visited = new Set<string>()

  queue.enqueue(randomPointInside)

  while (!queue.isEmpty()) {
    const current = queue.dequeue()! // We know the queue is not empty
    visited.add(serialiseCoord(current))

    board.adjacentTilesWithCoordinates(current).forEach(({ tile, y, x }) => {
      // If it's a wall, don't queue it up
      if (tile === Characters.HashTag) return
      
      // If we haven't visited this cell before, it's not in queue, and it's a floor, then we can queue to visit it
      if (!visited.has(serialiseCoord({ y, x })) && !queue.some(c => c.y === y && c.x === x) && tile === Characters.Dot) {
        queue.enqueue({ y, x })
      }
    })
  }

  [...visited.values()].forEach(coordSerialised => {
    const coord = unserialiseCoord(coordSerialised)
    board.mapCell(coord, _ => chalk.red(Characters.WhiteRetroBlock))
  })

  // console.log(board.toString())
  return countWall + visited.size
}

export const solvePart2 = (input: string) => {
  
}
