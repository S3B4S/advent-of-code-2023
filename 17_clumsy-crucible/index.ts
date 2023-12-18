import { Graph, Queue } from "@/utils/adt"
import { Board, CoordinateRecord, Direction, relativeDirection, serialiseCoord, stepInDirection, unserialiseCoord } from "@/utils/parsing"
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

  const graph = new Graph(true)

  const serialiseGraphVertice = (coord: CoordinateRecord, allowedSteps: {
    [Direction.North]: number,
    [Direction.East]: number,
    [Direction.South]: number,
    [Direction.West]: number,
  }) => {
    return `${serialiseCoord(coord)}|N:${allowedSteps[Direction.North]},E:${allowedSteps[Direction.East]},S:${allowedSteps[Direction.South]},W:${allowedSteps[Direction.West]}`
  }

  const deserialiseGraphVertice = (serialised: string) => {
    const [coord, allowedSteps] = serialised.split("|")
    const [y, x] = coord.split(",").map(Number)
    const [_, north, east, south, west] = allowedSteps.split(/,?[NESW]:/).map(Number)
    return {
      coord: { y, x },
      allowedSteps: {
        [Direction.North]: north,
        [Direction.East]: east,
        [Direction.South]: south,
        [Direction.West]: west,
      }
    }
  }

  // For the start tile we need to add a special state, with all directions at 3, which is our starting point
  for (const dir of [Direction.North, Direction.East, Direction.South, Direction.West]) {
    // Check steps 1 to amountOfStepsRemaining  amount of steps
    for (let i = 1; i <= 3; i++) {
      let step = { y: 0, x: 0 }
      let count = 0
      for (let j = 0; j < i; j++) {
        step = stepInDirection(step, dir)
        count += Number(board.get(step))
      }

      // From the destination, we're only allowed to move in these directions:
      // I'm not going to put 0 for the reversing direciton, since
      // it will only incur increased cost anyway
      const allowedDirections = {
        [Direction.North]: match(dir).with(Direction.North, () => 3 - i).with(Direction.South, () => 0).otherwise(() => 3),
        [Direction.East]: match(dir).with(Direction.East, () => 3 - i).with(Direction.West, () => 0).otherwise(() => 3),
        [Direction.South]: match(dir).with(Direction.South, () => 3 - i).with(Direction.North, () => 0).otherwise(() => 3),
        [Direction.West]: match(dir).with(Direction.West, () => 3 - i).with(Direction.East, () => 0).otherwise(() => 3),
      }

      if (board.isOutsideBounds(step)) continue

      graph.addEdge(
        serialiseGraphVertice({ y: 0, x: 0 }, {
          [Direction.North]: 3,
          [Direction.East]: 3,
          [Direction.South]: 3,
          [Direction.West]: 3,
        }),
        serialiseGraphVertice(step, allowedDirections),
        count,
      )
    }
  }

  // We need to add the edges to the graph
  board.forEach((_, coord) => {
    // Each node will get 4 (directions) * 3 (steps) "states" at most
    // Which will be represented as vertices

    for (const incomingDir of [Direction.North, Direction.East, Direction.South, Direction.West]) {
      // incomnig amount of steps
      for (let parentSteps = 1; parentSteps <= 3; parentSteps++) {

        const parentState: Record<Direction, number> = {
          [Direction.North]: match(incomingDir).with(Direction.North, () => 3 - parentSteps).with(Direction.South, () => 0).otherwise(() => 3),
          [Direction.East]: match(incomingDir).with(Direction.East, () => 3 - parentSteps).with(Direction.West, () => 0).otherwise(() => 3),
          [Direction.South]: match(incomingDir).with(Direction.South, () => 3 - parentSteps).with(Direction.North, () => 0).otherwise(() => 3),
          [Direction.West]: match(incomingDir).with(Direction.West, () => 3 - parentSteps).with(Direction.East, () => 0).otherwise(() => 3),
        } as Record<Direction, number>

        // For each direction
        for (const dir of [Direction.North, Direction.East, Direction.South, Direction.West]) {
          const amountOfStepsRemaining = parentState[dir]
          // Check steps 1 to amountOfStepsRemaining  amount of steps
          for (let i = 1; i <= amountOfStepsRemaining; i++) {
            let step = coord
            let count = 0
            for (let j = 0; j < i; j++) {
              step = stepInDirection(step, dir)
              count += Number(board.get(step))
            }

            // From the destination, we're only allowed to move in these directions:
            // I'm not going to put 0 for the reversing direciton, since
            // it will only incur increased cost anyway
            const allowedDirections = {
              [Direction.North]: match(dir).with(Direction.North, () => amountOfStepsRemaining - i).with(Direction.South, () => 0).otherwise(() => 3),
              [Direction.East]: match(dir).with(Direction.East, () => amountOfStepsRemaining - i).with(Direction.West, () => 0).otherwise(() => 3),
              [Direction.South]: match(dir).with(Direction.South, () => amountOfStepsRemaining - i).with(Direction.North, () => 0).otherwise(() => 3),
              [Direction.West]: match(dir).with(Direction.West, () => amountOfStepsRemaining - i).with(Direction.East, () => 0).otherwise(() => 3)
            }

            if (board.isOutsideBounds(step)) continue

            graph.addEdge(
              serialiseGraphVertice(coord, parentState),
              serialiseGraphVertice(step, allowedDirections),
              count,
            )
          }
        }
      }
    }
  })
  
  // console.log(graph.getStore())
  // It's the serialised coordinate
  type NodeId = string

  // Now we need to run Dijkstra on the graph
  const queue = new Queue<NodeId>()
  const history = new Set<NodeId>()
  const distances = new Map<NodeId, number>()
  // const pathTo = new Map<NodeId, {node: NodeId, direction: Direction}[]>()

  const current = serialiseGraphVertice({ y: 0, x: 0 }, {
    [Direction.North]: 3,
    [Direction.East]: 3,
    [Direction.South]: 3,
    [Direction.West]: 3,
  })
  queue.enqueue(current)
  distances.set(current, 0)
  // pathTo.set(serialiseCoord(current), [])

  while (!queue.isEmpty()) {
    const currentId = queue.dequeue()!
    const current = deserialiseGraphVertice(currentId)
    history.add(currentId)

    // console.log(current)

    const logCondition = [1].includes(current.coord.y) && [5].includes(current.coord.x) && false
    const logIfTrue = (...args: any[]) => {
      if (logCondition) {
        console.log(...args)
      }
    }
    
    logIfTrue('---')
    logIfTrue("Currently on:", currentId)

    const currentDistance = distances.get(currentId)!
    // console.log(currentDistance)
    // const currentPath = pathTo.get(currentId)!

    for (const outgoingEdge of graph.getEdges(currentId)!) {
      // console.log(outgoingEdge)
      const distanceA = currentDistance + outgoingEdge.cost
      const neighbourId = outgoingEdge.destination

      if (distances.has(neighbourId)) {
        const distanceB = distances.get(neighbourId)!
        if (distanceA < distanceB) {
          logIfTrue('GO FASTERRRRRR!!!!')
          distances.set(neighbourId, distanceA)
          // pathTo.set(neighbourId, [...currentPath, {node: currentId, direction: directionNeighbour}])
        }
        continue
      }

      distances.set(neighbourId, distanceA)
      if (!history.has(neighbourId)) queue.enqueue(neighbourId)
    }

    // const neighbours = board.adjacentCoordinates(current.coord, [Direction.North, Direction.East, Direction.South, Direction.West])
    // for (const neighbour of neighbours) {
      // const neighbourId = serialiseCoord(neighbour)
      // logIfTrue("Neighbour:", neighbourId)
      // const distanceA = currentDistance + Number(board.get(neighbour))
      // const directionNeighbour = relativeDirection(current.coord, neighbour)!

      // if (currentPath.length >= 3 && currentPath.slice(-3).every(({direction}) => direction === currentPath.at(-1)!.direction)) {
      //   // IF we've already moved 3 times in the same direction,
      //   // We will not be allowed to move in that direction again
      //   if (directionNeighbour === currentPath.at(-1)!.direction) {
      //     continue
      //   }
      // }

      // We need to check if we can get there faster by going through the current node
      // if (distances.has(neighbourId)) {
      //   const distanceB = distances.get(neighbourId)!
      //   if (distanceA < distanceB) {
      //     logIfTrue('GO FASTERRRRRR!!!!')
      //     distances.set(neighbourId, distanceA)
      //     pathTo.set(neighbourId, [...currentPath, {node: currentId, direction: directionNeighbour}])
      //   }
      //   continue
      // }

      // If the neighbour has not been visited before
      // distances.set(neighbourId, distanceA)
      // pathTo.set(neighbourId, [...currentPath, {node: currentId, direction: directionNeighbour}])

      // logIfTrue(pathTo)
      // logIfTrue(distances)
      // if (!queue.some(coord => coord === neighbourId)) queue.enqueue(neighbourId)
    // }
  }
  
  const distancesToDestination = [...distances.entries()]
    .filter(distance => {
      return distance[0].includes((board.amountRows() - 1) + "," + (board.amountColumns() - 1))
    })
    .map(distance => distance[1])
  
  return Math.min(...distancesToDestination)

  const destination = {
    y: board.amountRows() - 1,
    x: board.amountColumns() - 1,
  }

  const pathToDestination = pathTo.get(serialiseCoord(destination))
  // console.log(pathToDestination)
  for (const step of pathToDestination!) {
    board.mapCell(unserialiseCoord(step.node), () => {
      return match(step.direction)
        .with(Direction.North, () => "^")
        .with(Direction.East, () => ">")
        .with(Direction.South, () => "v")
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
