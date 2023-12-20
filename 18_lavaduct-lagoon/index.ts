import { Queue } from "@/utils/adt"
import { Board, Characters, CoordinateRecord, Direction, parseInputLines, serialiseCoord, stepInDirection, unserialiseCoord } from "@/utils/parsing"
import chalk from "chalk"
import { match } from "ts-pattern"

type Direction = 'East' | 'West' | 'North' | 'South'
type Color = string
type Instruction = [Direction, number]

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

      return [direction, parseInt(amount)] as Instruction
    })
  
  const row = `.`.repeat(450) + '\n'
  const b = row.repeat(450)

  const board = new Board(b)
  const iterator = board.iterateInDirection({ y: 0, x: 0 })

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
  const instructions = parseInputLines(input)
    .map(line => {
      const [_, __, color] = line.split(/\W+/).slice(0, -1)
      
      const direction = match(color.at(-1)!)
      .with('0', () => 'East')
      .with('1', () => 'South')
      .with('2', () => 'West')
      .with('3', () => 'North')
      .otherwise(() => { throw new Error(`Unknown direction ${color.at(-1)}`) })
      
      return [direction, hexadecimalToDecimal(color.slice(0, -1))] as Instruction
    })

  const wall = [] as CoordinateRecord[]
  const startPos = { y: 0, x: 0 }
  let currentPos = startPos
  wall.push(currentPos)

  // We also need to add them so we can easily access the coordinates by a given y coordinate
  const wallByY = new Map<number, CoordinateRecord[]>()

  // Keep track of the most negative y coordinate,
  // so we can start from there by going through the rows
  console.log('Construct the wall & bounding box!')
  const boundingBox = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }
  // let mostNegativeY = 0
  // let mostPositiveY = 0

  // console.log('Going to go through the instructions!')

  for (const instruction of instructions) {
    for (let i = 0; i < instruction[1]; i++) {
      // if (i % 1000 === 0) console.log(i)
      currentPos = stepInDirection(currentPos, match(instruction[0])
        .with('East', () => Direction.East)
        .with('West', () => Direction.West)
        .with('North', () => Direction.North)
        .with('South', () => Direction.South)
        .otherwise(() => { throw new Error(`Unknown direction ${instruction[0]}`) })
      )
      if (i !== 0 && currentPos.y === startPos.y && currentPos.x === startPos.x) break // We have returned, don't push the last coord
      if (!wallByY.has(currentPos.y)) wallByY.set(currentPos.y, [])
      // if (currentPos.y === 2) console.log(currentPos)
      wallByY.get(currentPos.y)!.push(currentPos)
      wall.push(currentPos)
      // if (wallByY.size % 1000 === 0) console.log(wallByY.size)
      boundingBox.top = Math.min(boundingBox.top, currentPos.y)
      boundingBox.bottom = Math.max(boundingBox.bottom, currentPos.y)
      boundingBox.left = Math.min(boundingBox.left, currentPos.x)
      boundingBox.right = Math.max(boundingBox.right, currentPos.x)
      // mostPositiveY = Math.max(mostPositiveY, currentPos.y)
    }
  }

  // console.log(boundingBox);
  
  // We know that there exists a wall which is on the border of the bounding box
  // which has some space on the other side
  // That space will be the start of our inner wall

  
  console.log('Construct the inner wall!')
  // There should be a wall on y, and empty space on y + 1
  // const wallsTopRow = wallByY.get(boundingBox.top)!
  // const wallsNextRow = wallByY.get(boundingBox.top + 1)!
  
  // let innerTile: CoordinateRecord | undefined = undefined
  // for (const wall of wallsTopRow.values()) {
  //   if (!wallsNextRow.some(nextWall => nextWall.y === wall.y + 1 && nextWall.x === wall.x)) {
  //     // We have found our space on the inner side
  //     innerTile = { y: wall.y + 1, x: wall.x }
  //     break
  //   }
  // }

  // if (!innerTile) throw new Error('Could not find inner tile')
  
  // // Now we can start looping this inner tile to find the inner wall
  // const queue = new Queue<CoordinateRecord>()
  // const visited = new Set<string>()
  // queue.enqueue(innerTile)

  // const innerWall = [] as CoordinateRecord[]

  // while(!queue.isEmpty()) {
  //   console.log(queue.size())
  //   if (queue.size() % 1000 === 0) {console.log(queue.size)}
  //   const current = queue.dequeue()
  //   visited.add(serialiseCoord(current!))

  //   // Check top, left, right & bottom
  //   const nbs = [Direction.North, Direction.East, Direction.South, Direction.West].map(dir => stepInDirection(current!, dir))
  //   // The nb must not be a wall, and it must be a attached to a wall
  //   for (const nb /* yes, really */ of nbs) {
  //     if (wallByY.has(nb.y) && wallByY.get(nb.y)!.some(wall => wall.x === nb.x)) continue

  //     // Check if it connects to a wall
  //     const connectsToWall = [Direction.North, Direction.East, Direction.South, Direction.West, Direction.NorthEast, Direction.NorthWest, Direction.SouthEast, Direction.SouthWest]
  //       .map(dir => stepInDirection(nb, dir))
  //       .some(nb => wallByY.has(nb.y) && wallByY.get(nb.y)!.some(wall => wall.x === nb.x))

  //     if (connectsToWall) {
  //       if (!visited.has(serialiseCoord(nb))) queue.enqueue(nb)
  //       innerWall.push(nb)
  //     }
  //   }
  // }

  // We can follow the same steps, but amount - 2 for every instruction to find all inner walls

  // console.log(innerTile);
    // if (y === 0) break
  
  // Plant start of inner wall, we have the most negative Y, so we know the inner wall must start on mostNegativeY + 1

  console.log('Sort the wall!');
  // Sort every entry of the wall by x coordinate
  [...wallByY.entries()].forEach(([y, coords]) => {
    wallByY.set(y, coords.sort((a, b) => a.x - b.x))
  })

  // const boundariesWithin = []

  console.log('Calculate the amount of tiles inside the wall!')
  // console.log(wallByY.get(7))
  let countTilesInside = 0
  const notSureRows = new Set<number>()
  // Now we iterate through wallByY, and for each row, we count the amount of cells present within boundaries
  for (let row = 1; row < wallByY.size - 1; row++) {
    // console.log('row', row)
    const currentRow = wallByY.get(row)!
    // Iterate through pairs, check distance to next wall
    
    // console.log('row: ' + row)
    // if (row === 3) console.log('66', currentRow)
    let isOpen = true
    let countOfRow = 0
    if (!currentRow) {continue}
    for (let i = 0; i < currentRow.length - 1; i++) {
      // if (row === 3) console.log('4', currentRow[i])

      if (currentRow[i].x + 1 === currentRow[i + 1].x) {
        // If at some point there are multiple walls in a row, we don't know what to do
        // So I'm putting it in "not sure" and then handle this case differently
        // Probably scan vertically instead for this case
        notSureRows.add(row)
        break
      }

      // if (row === 3) console.log('3333')

      // We have a gap between the walls, toggle the status
      // Check if there's an inner wall present in the gap, 
      // we can do this by checking the first wall in the next column
      // @TODO sort innerwall by Y coordinates too

      if (isOpen) {
        // console.log('  before: ' + countTilesInside)
        // boundariesWithin.push([currentRow[i], currentRow[i + 1]])
        // console.log('Is open', currentRow[i], currentRow[i + 1])
        countOfRow = countOfRow + currentRow[i + 1].x - currentRow[i].x - 1
        // countTilesInside = countTilesInside + currentRow[i + 1].x - currentRow[i].x - 1
        // console.log('  after: ' + countTilesInside)
      }
      
      isOpen = !isOpen
    }
    if (notSureRows.has(row)) continue
    countTilesInside = countTilesInside + countOfRow
    // if (row === 7) {
    //   console.log(countTilesInside)
    // }
  }

  // console.log('not sure rows')
  // console.log([...notSureRows.values()])
  for (const y of notSureRows.values()) {
    const currentRow = wallByY.get(y)!
    // For these rows, we need to do some more checking
    let isOpen = false
    for (let i = 0; i < currentRow.length - 1; i++) {
      // Check if there's no wall in the next column
      if (currentRow[i].x + 1 !== currentRow[i + 1].x) {
        // If there isn't, we can switch the status
        isOpen = !isOpen
        // If there is, we can count the amount of tiles in the gap
        // countTilesInside = countTilesInside + currentRow[i + 1].x - currentRow[i].x - 1
        if (isOpen) {
          countTilesInside = countTilesInside + currentRow[i + 1].x - currentRow[i].x - 1
        }
      } else {
        // If there's a wall after this as well, we have a "stacked" wall, and we need
        // to apply a different rule
        // We will go all the way to the end of the stacked wall
        const start = currentRow[i]
        
        // let isEndOfRow = false
        let end = currentRow[i + 1]
        let j = i + 1 // The j index is 1 step ahead of i
        while (end.x + 1 === currentRow[j + 1]?.x) {
          end = currentRow[j + 1]
          j = j + 1
        }

        i = j - 1

        // console.log('--------')
        // console.log({start, end, isOpen})
        
        // Now that we know the start & end, we will look where the outgoing walls are
        // Find the wall that's around first first
        let startWall = undefined
        if (wallByY.get(y - 1)?.some(wall => wall.x === start.x)) {
          startWall = wallByY.get(y - 1)!.find(wall => wall.x === start.x)!
        } else if (wallByY.get(y + 1)?.some(wall => wall.x === start.x)) {
          startWall = wallByY.get(y + 1)!.find(wall => wall.x === start.x)!
        }

        let endWall = undefined
        if (wallByY.get(y - 1)?.some(wall => wall.x === end.x)) {
          endWall = wallByY.get(y - 1)!.find(wall => wall.x === end.x)!
        } else if (wallByY.get(y + 1)?.some(wall => wall.x === end.x)) {
          endWall = wallByY.get(y + 1)!.find(wall => wall.x === end.x)!
        }

        // If both the start & end wall are on the same side,
        // then the situation remains unchanges
        if (startWall?.y === endWall?.y) {
          isOpen = !isOpen 
          // The thing is, next iteration it will be swapped again, since we detect a new gap
          // So it will go back to "isOpen"
        // If it's on opposite ends, we know that we need to flip the situation
        } else {
          // Next iteration this will be swapped, so it will then be toggled
          isOpen = isOpen
        }

        // console.log('--after toggle--')
        // console.log(isOpen)
      }
    }
  }

  // const b = `.`.repeat(19) + '\n'
  // const board = new Board(b.repeat(12))

  // for (const w of wall) {
  //   board.mapCell(w, _ => chalk.red(Characters.WhiteRetroBlock))
  // }

  // for (let y = 0; y < boundingBox.bottom; y++) {
  //   if (notSureRows.has(y) || y === boundingBox.top || y === boundingBox.bottom) continue
  //   board.mapCell({ y, x: 0 }, _ => chalk.green(Characters.WhiteRetroBlock))
  //   board.mapCell({ y, x: 0 }, _ => chalk.green(Characters.WhiteRetroBlock))
  // }

  // console.log(board.toString())
  // console.log({ countTilesInside })
  return countTilesInside + wall.length
}

const hexadecimalToDecimal = (hex: string) => parseInt(hex, 16)
