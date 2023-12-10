import { Queue } from "@/utils/adt"
import { LinkedListNode } from "@/utils/list"
import { Board, Characters, CoordinateRecord, Direction, addCoordinate, coordStringToCoordRecord, coordinateToString, relativeDirection } from "@/utils/parsing"
import chalk from "chalk"
import { randomUUID } from "crypto"
import { match } from "ts-pattern"

class PipeBoard extends Board {
  typeTiles = {
    '|': {
      name: 'vertical',
      move: (incoming: Direction) => match(incoming)
      // Read as "moving in while walking towards north, will lead you towards north"
        .with(Direction.North, () => Direction.North)
        .with(Direction.South, () => Direction.South)
        .otherwise(() => undefined),
      allowsOutgoing: [Direction.North, Direction.South],
      allowsIncoming: [Direction.North, Direction.South],
    },
    '-': {
      name: 'horizontal',
      move: (incoming: Direction) => match(incoming)
        .with(Direction.East, () => Direction.East)
        .with(Direction.West, () => Direction.West)
        .otherwise(() => undefined),
      allowsOutgoing: [Direction.East, Direction.West],
      allowsIncoming: [Direction.East, Direction.West],
    },
    'L': {
      name: 'northAndEast',
      move: (incoming: Direction) => match(incoming)
        .with(Direction.South, () => Direction.East)
        .with(Direction.West, () => Direction.North)
        .otherwise(() => undefined),
        allowsOutgoing: [Direction.North, Direction.East],
      allowsIncoming: [Direction.South, Direction.West],
    },
    'J': {
      name: 'northAndWest',
      move: (incoming: Direction) => match(incoming)
        .with(Direction.South, () => Direction.West)
        .with(Direction.East, () => Direction.North)
        .otherwise(() => undefined),
      allowsOutgoing: [Direction.North, Direction.West],
      allowsIncoming: [Direction.South, Direction.East],
    },
    '7': {
      name: 'southAndWest',
      move: (incoming: Direction) => match(incoming)
        .with(Direction.North, () => Direction.West)
        .with(Direction.East, () => Direction.South)
        .otherwise(() => undefined),
      allowsOutgoing: [Direction.West, Direction.South],
      allowsIncoming: [Direction.East, Direction.North],
    },
    'F': {
      name: 'southAndEast',
      move: (incoming: Direction) => match(incoming)
        .with(Direction.North, () => Direction.East)
        .with(Direction.West, () => Direction.South)
        .otherwise(() => undefined),
      allowsOutgoing: [Direction.South, Direction.East],
      allowsIncoming: [Direction.West, Direction.North],
    },
    'S': {
      name: 'start',
      move: (incoming: Direction) => undefined,
      allowsOutgoing: [Direction.North, Direction.East, Direction.South, Direction.West],
      allowsIncoming: [Direction.North, Direction.East, Direction.South, Direction.West],
    },
    '.': {
      name: 'empty',
      move: (incoming: Direction) => undefined,
      allowsOutgoing: [] as Direction[],
      allowsIncoming: [] as Direction[],
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
      // board.content[node.value.y][node.value.x] = match(node.value.outgoingDirection)
      //   .with(Direction.North, () => 'N')
      //   .with(Direction.East, () => 'E')
      //   .with(Direction.South, () => 'S')
      //   .with(Direction.West, () => 'W')
      //   .otherwise(() => 'X')
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
    const [y, x] = coordinate.split(',').map(Number)
    board
      .adjacentCoordinates({ x, y }, [Direction.North, Direction.East, Direction.South, Direction.West])
      .forEach(coordinate => {
      if (!longestRouteCoordinates.has(coordinateToString(coordinate))) {
        currentWave.add(coordinateToString(coordinate))
      }
    })
  })
  
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

  // For debugging in console
  console.log()

  const copyBoard = new Board(board.toString())

  longestRouteCoordinates.forEach(coordinate => {
    copyBoard.set(coordStringToCoordRecord(coordinate), chalk.black(copyBoard.get(coordStringToCoordRecord(coordinate))))
  })

  copyBoard.set(startPosition, chalk.yellow('S'))

  safeTiles.forEach(coordinate => {
    copyBoard.set(coordStringToCoordRecord(coordinate), chalk.green(Characters.At))
  })

  unsafeTiles.forEach(coordinate => {
    copyBoard.set(coordStringToCoordRecord(coordinate), chalk.red(Characters.At))
  })

  console.log(copyBoard.toString())

  // We're going to add padding around _every_ tile
  // And then re-close where the pipes do connect
  // That way we can easily check for openings

  board.intersperse(Characters.Dot)
  // console.log('INTERSPERSED')
  // console.log(board.toString())
  // console.log()
  
  // board.set({ y: 3, x: 2}, '|')
  // console.log(board.toString())

  // Now, for every pipe, we're going to check if we can connect it straight to its neighbours without leaving any room
  // If we can, then we can close it off

  const padding = 1
  const toVisit = new Queue<CoordinateRecord>()
  const visited = new Set<string>()
  toVisit.enqueue({ y: 0, x: 0 })

  while (toVisit.size() > 0) {
    const currentRecord = toVisit.dequeue()!
    visited.add(coordinateToString(currentRecord))

    board.adjacentCoordinates(currentRecord, [Direction.North, Direction.East, Direction.South, Direction.West]).forEach((nb, index) => {
      const nbIsInDirection = relativeDirection(currentRecord, nb)!

      const paddedNb = match(nbIsInDirection)
        .with(Direction.North, () => ({ y: nb.y - padding, x: nb.x }))
        .with(Direction.East, () => ({ y: nb.y, x: nb.x + padding }))
        .with(Direction.South, () => ({ y: nb.y + padding, x: nb.x }))
        .with(Direction.West, () => ({ y: nb.y, x: nb.x - padding }))
        .run()

      if (board.isOutsideBounds(paddedNb)) return
      
      const coordinateInBetween = match(nbIsInDirection)
        .with(Direction.North, () => ({ y: paddedNb.y + 1, x: paddedNb.x }))
        .with(Direction.East, () => ({ y: paddedNb.y, x: paddedNb.x - 1 }))
        .with(Direction.South, () => ({ y: paddedNb.y - 1, x: paddedNb.x }))
        .with(Direction.West, () => ({ y: paddedNb.y, x: paddedNb.x + 1 }))
        .run()

      if (board.get(paddedNb) === Characters.Dot || board.get(currentRecord) === Characters.Dot) {
        board.set(coordinateInBetween, chalk.red(Characters.Dot))
      } else if (board.typeTiles[board.get(paddedNb) as keyof typeof board.typeTiles].allowsIncoming.includes(nbIsInDirection) && board.typeTiles[board.get(currentRecord) as keyof typeof board.typeTiles].allowsOutgoing.includes(nbIsInDirection)) {
        if (nbIsInDirection === Direction.North || nbIsInDirection === Direction.South) {
          board.set(coordinateInBetween, chalk.yellow('|'))
        } else {
          board.set(coordinateInBetween, chalk.yellow('-'))
        }
      } else {
        board.set(coordinateInBetween, chalk.red(Characters.Dot))
      }

      if (!visited.has(coordinateToString(paddedNb)) && !toVisit.some(item => item.y === paddedNb.y && item.x === paddedNb.x)) {
        toVisit.enqueue(paddedNb)
      }

    })
  }

  console.log(board.toString())

  return [...routes.values()].find(route => route.at(-1)?.value.count === highestCount)?.at(-1)?.value.count
}


