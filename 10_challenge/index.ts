import { Queue } from "@/utils/adt"
import { LinkedListNode } from "@/utils/list"
import { Board, Characters, CoordinateRecord, Direction, coordStringToCoordRecord, coordinateToString, relativeDirection } from "@/utils/parsing"
import chalk from "chalk"
import { randomUUID } from "crypto"
import { match } from "ts-pattern"

class PipeBoard extends Board {
  typeTiles = {
    '|': {
      name: 'vertical',
      validEntries: [Direction.South, Direction.North],
      move: (incoming: Direction) => match(incoming)
      // Read as "moving in while walking towards north, will lead you towards north"
        .with(Direction.North, () => Direction.North)
        .with(Direction.South, () => Direction.South)
        .otherwise(() => undefined)
      
    },
    '-': {
      name: 'horizontal',
      validEntries: [Direction.East, Direction.West],
      move: (incoming: Direction) => match(incoming)
        .with(Direction.East, () => Direction.East)
        .with(Direction.West, () => Direction.West)
        .otherwise(() => undefined)
    },
    'L': {
      name: 'northAndEast',
      validEntries: [Direction.North, Direction.East],
      move: (incoming: Direction) => match(incoming)
        .with(Direction.South, () => Direction.East)
        .with(Direction.West, () => Direction.North)
        .otherwise(() => undefined)
    },
    'J': {
      name: 'northAndWest',
      validEntries: [Direction.North, Direction.West],
      move: (incoming: Direction) => match(incoming)
        .with(Direction.South, () => Direction.West)
        .with(Direction.East, () => Direction.North)
        .otherwise(() => undefined)
    },
    '7': {
      name: 'southAndWest',
      validEntries: [Direction.South, Direction.West],
      move: (incoming: Direction) => match(incoming)
        .with(Direction.North, () => Direction.West)
        .with(Direction.East, () => Direction.South)
        .otherwise(() => undefined)
    },
    'F': {
      name: 'southAndEast',
      validEntries: [Direction.South, Direction.East],
      move: (incoming: Direction) => match(incoming)
        .with(Direction.North, () => Direction.East)
        .with(Direction.West, () => Direction.South)
        .otherwise(() => undefined)
    },
    'S': {
      name: 'start',
      validEntries: [],
      move: (incoming: Direction) => undefined
    },
    '.': {
      name: 'empty',
      validEntries: [], move: (incoming: Direction) => undefined
    },
  }
}

export const solvePart1 = (input: string) => {
  const board = new PipeBoard(input)  
  const startPosition = board.find('S')

  // For every possible outgoing direction at startPosition,
  // create a new linked list which points to the start with the head
  // <linkedListId, linkedList>
  const routes = new Map<string, [LinkedListNode]>()
  const visitedTiles = new Set<string>()

  board.adjacentTilesWithCoordinates(startPosition, [Direction.North, Direction.East, Direction.South, Direction.West]).forEach(({ tile, x, y }) => {
    const relDirection = relativeDirection(startPosition, { x, y })
    const isValid = Boolean(board.typeTiles[tile as keyof typeof board.typeTiles].move(relDirection!))
    if (isValid) {
      const node = new LinkedListNode({ tile, x, y, count: 1, incoming: relDirection, foundCycle: false })
      routes.set(node.id, [node])
      visitedTiles.add(coordinateToString({ x, y }))
    }
  })

  while ([...routes.values()].some(route => route.at(-1)!.value.foundCycle === false)) {
    for (const route of routes.values()) {
      if (route.at(-1)!.value.foundCycle) continue
      const lastNode = route.at(-1)!
      const outgoingDirection = board.typeTiles[lastNode.value.tile as keyof typeof board.typeTiles].move(lastNode.value.incoming)
      const newCoordinate = board.adjacentTilesWithCoordinates(lastNode.value, [outgoingDirection!])[0]      
      // If the new tile already has this coordinate, then it means we've started to detect a cycle
      if (visitedTiles.has(coordinateToString(newCoordinate))) {
        lastNode.value.foundCycle = true
        continue
      }
  
      const currentNode = new LinkedListNode({ tile: newCoordinate.tile, x: newCoordinate.x, y: newCoordinate.y, count: lastNode.value.count + 1, incoming: outgoingDirection, foundCycle: false })
      route.push(currentNode)
      lastNode.next = currentNode
      currentNode.previous = lastNode
      visitedTiles.add(coordinateToString(newCoordinate))
    }
  }

  // Find highest count
  // routes.values().next().value[0].printPath()
  return [...routes.values()].reduce((acc, route) => {
    return route.at(-1)?.value.count > acc ? route.at(-1)?.value.count : acc
  }, 0)
}

// !!!
// >Any tile that isn't part of the main loop can count as being enclosed by the loop
// So, we don't need to explicitly check for dots, we can check for the area encased by the loop
// as long as it doesn't "escape" to outside the loop
export const solvePart2 = (input: string) => {
  const board = new PipeBoard(input)  
  const startPosition = board.find('S')

  // For every possible outgoing direction at startPosition,
  // create a new linked list which points to the start with the head
  // <linkedListId, linkedList>
  const routes = new Map<string, [LinkedListNode]>()
  const visitedTiles = new Set<string>()

  board.adjacentTilesWithCoordinates(startPosition, [Direction.North, Direction.East, Direction.South, Direction.West]).forEach(({ tile, x, y }) => {
    const relDirection = relativeDirection(startPosition, { x, y })
    const isValid = Boolean(board.typeTiles[tile as keyof typeof board.typeTiles].move(relDirection!))
    if (isValid) {
      const node = new LinkedListNode({ tile, x, y, count: 1, incoming: relDirection, foundCycle: false })
      routes.set(node.id, [node])
      visitedTiles.add(coordinateToString({ x, y }))
    }
  })

  while ([...routes.values()].some(route => route.at(-1)!.value.foundCycle === false)) {
    for (const route of routes.values()) {
      if (route.at(-1)!.value.foundCycle) continue
      const lastNode = route.at(-1)!
      const outgoingDirection = board.typeTiles[lastNode.value.tile as keyof typeof board.typeTiles].move(lastNode.value.incoming)
      lastNode.value.outgoingDirection = outgoingDirection
      const newCoordinate = board.adjacentTilesWithCoordinates(lastNode.value, [outgoingDirection!])[0]      
      // If the new tile already has this coordinate, then it means we've started to detect a cycle
      if (visitedTiles.has(coordinateToString(newCoordinate))) {
        lastNode.value.foundCycle = true
        continue
      }
  
      const currentNode = new LinkedListNode({ tile: newCoordinate.tile, x: newCoordinate.x, y: newCoordinate.y, count: lastNode.value.count + 1, incoming: outgoingDirection, foundCycle: false })
      route.push(currentNode)
      lastNode.next = currentNode
      currentNode.previous = lastNode
      visitedTiles.add(coordinateToString(newCoordinate))
    }
  }

  // console.log(routes)
  console.log(board.toString())
  // Find highest count
  const highestCount = [...routes.values()].reduce((acc, route) => {
    return route.at(-1)?.value.count > acc ? route.at(-1)?.value.count : acc
  }, 0)

  const longestRouteCoordinates = new Set<string>()
  longestRouteCoordinates.add(coordinateToString(startPosition))
  const longestRoutes = [...routes.values()].filter(route => route.at(-1)?.value.count === highestCount || route.at(-1)?.value.count === highestCount - 1)
  longestRoutes.forEach(route => {
    route[0].iterateUntilLast(node => {
      longestRouteCoordinates.add(coordinateToString({ x: node.value.x, y: node.value.y }))
      board.content[node.value.y][node.value.x] = match(node.value.outgoingDirection)
        .with(Direction.North, () => 'N')
        .with(Direction.East, () => 'E')
        .with(Direction.South, () => 'S')
        .with(Direction.West, () => 'W')
        .otherwise(() => 'X')
    })
  })

  // console.log(longestRouteCoordinates)

  // First we're going to flood and mark the areas that are surrounded by the loop
  // Ignoring the bits that can "spill" in between the pipes
  // After that, we go through each area and check if it's able to "spill" between the pipes
  // to an area that has not been previously marked
  // If it does, then we can no longer consider this an enclosed area

  let currentWave = new Set<string>()

  longestRouteCoordinates.forEach(coordinate => {
    // safeTiles.add(coordinate)
    const [y, x] = coordinate.split(',').map(Number)
    board
      .adjacentCoordinates({ x, y }, [Direction.North, Direction.East, Direction.South, Direction.West])
      .forEach(coordinate => {
      if (!longestRouteCoordinates.has(coordinateToString(coordinate))) {
        currentWave.add(coordinateToString(coordinate))
        board.content[coordinate.y][coordinate.x] = chalk.blue('X')
      }
    })
  })

  longestRouteCoordinates.forEach(coordinate => {
    board.set(coordStringToCoordRecord(coordinate), chalk.black(board.get(coordStringToCoordRecord(coordinate))))
  })

  board.set(startPosition, chalk.yellow('S'))

  console.log()
  console.log('First initial wave')
  console.log(board.toString())
  console.log()
  
  const safeTiles = new Set<string>()
  const unsafeTiles = new Set<string>()

  // Go over each tile in the current wave
  // For each tile, flood the area it's in and check if the area is enclosed by the main loop
  // If it is, then mark it as safe
  // If a boundary is detected or an other "unsafe" tile, we know the current tile is also not safe

  // A map where key is id of the area
  // The set is the coordinates that appear in it
  const areas = new Map<string, Set<string>>()
  currentWave.forEach(coordString => {
    const coordRecord = coordStringToCoordRecord(coordString)
    // Check if it's been marked as safe or unsafe already
    if (safeTiles.has(coordString) || unsafeTiles.has(coordString)) return

    // If these two don't immediately hold up, let's try to flood the current area
    // And see if the area is enclosed by the main loop
    const currentAreaSurroundingTiles = new Set<string>()
    const visited = new Set<string>()
    const toVisit = new Queue<CoordinateRecord>()
    toVisit.enqueue(coordRecord)

    while (!toVisit.isEmpty()) {
      let current = toVisit.dequeue()!
      visited.add(coordinateToString(current))

      board.adjacentCoordinates(current).forEach(neighbour => {
        const neighbourStr = coordinateToString(neighbour)
        
        if (longestRouteCoordinates.has(coordinateToString(neighbour))) {
          currentAreaSurroundingTiles.add(coordinateToString(neighbour))
          return
        }

        if (visited.has(neighbourStr) || toVisit.some(item => item.y === neighbour.y && item.x === neighbour.x)) return
        // if (!visited.has(neighbourStr) && !toVisit.has(neighbour)) {
          // console.log(coordinateToString(neighbour))
          toVisit.enqueue(neighbour)
        // }
      })
    }

    // We check if any of the visited areas have been marked as unsafe.
    // Or is on a boundary
    // If it contains, then the entire area is unsafe.
    const containsUnsafe = [...visited].some(coordString => unsafeTiles.has(coordString) || board.isOnBounds(coordStringToCoordRecord(coordString)))
    if (containsUnsafe) {
      visited.forEach(coordString => {
        unsafeTiles.add(coordString)
      })
      return
    }

    // At this point, we know that this area is safe, so we can add it to the safe tiles
    visited.forEach(coordString => {
      safeTiles.add(coordString)
    })

    areas.set(randomUUID(), visited)
  })

  safeTiles.forEach(coordinate => {
    board.set(coordStringToCoordRecord(coordinate), chalk.green(Characters.At))
  })

  unsafeTiles.forEach(coordinate => {
    board.set(coordStringToCoordRecord(coordinate), chalk.red(Characters.At))
  })

  // Now for every area, we want to check if it's possible for it to "slip" outside between the pipes
  // We first check if there's an opening around it.
  // If there is, then the opening must lead to an "unsafe" area
  // !! Important. If we turn a safe area into an unsafe one, we need to re-check previously checked areas.
  // because they might have led to this safe area before, believeing it was safe, but now it's not so we need to re-check and
  // mark that one unsafe as well
  // We can keep track of this by keeping a list of areas that have been checked and which area they connect to

  console.log(board.toString())

  // console.log(areas)

  return [...routes.values()].find(route => route.at(-1)?.value.count === highestCount)?.at(-1)?.value.count
}
