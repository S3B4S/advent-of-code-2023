import { Queue } from "@/utils/adt"
import { LinkedListNode } from "@/utils/list"
import { Board, CoordinateRecord, Direction, coordinateToString, relativeDirection } from "@/utils/parsing"
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

export const solvePart2 = (input: string) => {
  return 0
}
