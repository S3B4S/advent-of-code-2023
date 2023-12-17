import { Graph, Queue } from "@/utils/adt"
import { Board, CoordinateRecord, Direction, relativeDirection, serialiseCoord, unserialiseCoord } from "@/utils/parsing"
import { match } from "ts-pattern"

export const solvePart1 = (input: string) => {
  // We can model this as a graph
  // And use Dijkstra's algorithm to find the shortest path
  // If the path so far is the same direction three times, 
  // We will artificially increase the cost of the edge to the next step
  // in the saem direction by Infinity (or we can just remove it). And we will
  // recalculate Dijkstra's algorithm from that point.

  type Tile = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
  const board = new Board<Tile>(input)

  // It's the serialised coordinate
  type NodeId = string

  // Dijkstra
  const queue = new Queue<CoordinateRecord>()
  const visited = new Set<NodeId>()
  const distances = new Map<NodeId, number>()
  const pathTo = new Map<NodeId, {node: NodeId, direction: Direction}[]>()

  const current = { y: 0, x: 0 }
  queue.enqueue(current)
  distances.set(serialiseCoord(current), 0)
  pathTo.set(serialiseCoord(current), [])

  while (!queue.isEmpty()) {
    const current = queue.dequeue()!
    const currentId = serialiseCoord(current)
    visited.add(currentId)

    const logCondition = [0, 1].includes(current.y) && [0, 1].includes(current.x) && false
    const logIfTrue = (...args: any[]) => {
      if (logCondition) {
        console.log(...args)
      }
    }
    logIfTrue('---')
    logIfTrue("Currently on:", currentId)

    const currentDistance = distances.get(currentId)!
    const currentPath = pathTo.get(currentId)!

    const neighbours = board.adjacentCoordinates(current, [Direction.North, Direction.East, Direction.South, Direction.West])
    for (const neighbour of neighbours) {
      const neighbourId = serialiseCoord(neighbour)
      logIfTrue("Neighbour:", neighbourId)
      const distanceA = currentDistance + Number(board.get(neighbour))
      const directionNeighbour = relativeDirection(current, neighbour)!

      if (currentPath.length >= 3 && currentPath.slice(-3).every(({direction}) => direction === currentPath.at(-1)!.direction)) {
        // IF we've already moved 3 times in the same direction,
        // We will not be allowed to move in that direction again
        if (directionNeighbour === currentPath.at(-1)!.direction) {
          continue
        }
      }

      // We need to check if we can get there faster by going through the current node
      if (distances.has(neighbourId)) {
        const distanceB = distances.get(neighbourId)!
        if (distanceA < distanceB) {
          logIfTrue('GO FASTERRRRRR!!!!')
          distances.set(neighbourId, distanceA)
          pathTo.set(neighbourId, [...currentPath, {node: currentId, direction: directionNeighbour}])
        }
        continue
      }

      // If the neighbour has not been visited before
      distances.set(neighbourId, distanceA)
      pathTo.set(neighbourId, [...currentPath, {node: currentId, direction: directionNeighbour}])

      logIfTrue(pathTo)
      logIfTrue(distances)
      if (!queue.some(coord => serialiseCoord(coord) === neighbourId)) queue.enqueue(neighbour)
    }
  }

  const destination = {
    y: board.amountRows() - 1,
    x: board.amountColumns() - 1,
  }

  const pathToDestination = pathTo.get(serialiseCoord(destination))
  console.log(pathToDestination)
  for (const step of pathToDestination!) {
    board.mapCell(unserialiseCoord(step.node), () => {
      return match(step.direction)
        .with(Direction.North, () => "^")
        .with(Direction.East, () => ">")
        .with(Direction.South, () => "V")
        .with(Direction.West, () => "<")
        .otherwise(() => "X") as unknown as Tile
    })
  }

  console.log(board.toString())

  return distances.get(serialiseCoord(destination))
}

export const solvePart2 = (input: string) => {
  return 0
}
