import { Graph, Queue } from "@/utils/adt"
import { Board, CoordinateRecord, Direction, serialiseCoord, stepInDirection } from "@/utils/parsing"
import { match } from "ts-pattern"

export const solvePart1 = (input: string) => {
  // We can model this as a graph
  // And use Dijkstra's algorithm to find the shortest path
  // If the path so far is the same direction three times, 
  // We will artificially increase the cost of the edge to the next step
  // in the saem direction by Infinity (or we can just remove it). And we will
  // recalculate Dijkstra's algorithm from that point.

  // For part two we just need different parameters for the min and max distances

  const MIN_DISTANCE = 1

  const MAX_DISTANCE = 3

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
    // Check steps MIN_DISTANCE to amountOfStepsRemaining  amount of steps
    for (let i = MIN_DISTANCE; i <= MAX_DISTANCE; i++) {
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
        [Direction.North]: match(dir).with(Direction.North, () => MAX_DISTANCE - i).with(Direction.South, () => 0).otherwise(() => MAX_DISTANCE),
        [Direction.East]: match(dir).with(Direction.East, () => MAX_DISTANCE - i).with(Direction.West, () => 0).otherwise(() => MAX_DISTANCE),
        [Direction.South]: match(dir).with(Direction.South, () => MAX_DISTANCE - i).with(Direction.North, () => 0).otherwise(() => MAX_DISTANCE),
        [Direction.West]: match(dir).with(Direction.West, () => MAX_DISTANCE - i).with(Direction.East, () => 0).otherwise(() => MAX_DISTANCE),
      }

      if (board.isOutsideBounds(step)) continue

      graph.addEdge(
        serialiseGraphVertice({ y: 0, x: 0 }, {
          [Direction.North]: MAX_DISTANCE,
          [Direction.East]: MAX_DISTANCE,
          [Direction.South]: MAX_DISTANCE,
          [Direction.West]: MAX_DISTANCE,
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
      for (let parentSteps = 1; parentSteps <= MAX_DISTANCE; parentSteps++) {

        const parentState: Record<Direction, number> = {
          [Direction.North]: match(incomingDir).with(Direction.North, () => MAX_DISTANCE - parentSteps).with(Direction.South, () => 0).otherwise(() => MAX_DISTANCE),
          [Direction.East]: match(incomingDir).with(Direction.East, () => MAX_DISTANCE - parentSteps).with(Direction.West, () => 0).otherwise(() => MAX_DISTANCE),
          [Direction.South]: match(incomingDir).with(Direction.South, () => MAX_DISTANCE - parentSteps).with(Direction.North, () => 0).otherwise(() => MAX_DISTANCE),
          [Direction.West]: match(incomingDir).with(Direction.West, () => MAX_DISTANCE - parentSteps).with(Direction.East, () => 0).otherwise(() => MAX_DISTANCE),
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
              [Direction.North]: match(dir).with(Direction.North, () => amountOfStepsRemaining - i).with(Direction.South, () => 0).otherwise(() => MAX_DISTANCE),
              [Direction.East]: match(dir).with(Direction.East, () => amountOfStepsRemaining - i).with(Direction.West, () => 0).otherwise(() => MAX_DISTANCE),
              [Direction.South]: match(dir).with(Direction.South, () => amountOfStepsRemaining - i).with(Direction.North, () => 0).otherwise(() => MAX_DISTANCE),
              [Direction.West]: match(dir).with(Direction.West, () => amountOfStepsRemaining - i).with(Direction.East, () => 0).otherwise(() => MAX_DISTANCE)
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
  
  // It's the serialised coordinate
  type NodeId = string

  // Now we need to run Dijkstra on the graph
  const queue = new Queue<NodeId>()
  const distances = new Map<NodeId, number>()

  const current = serialiseGraphVertice({ y: 0, x: 0 }, {
    [Direction.North]: 3,
    [Direction.East]: 3,
    [Direction.South]: 3,
    [Direction.West]: 3,
  })

  for (const verticeId of graph.getVertices()) {
    distances.set(verticeId, Infinity)
    queue.enqueue(verticeId)
  }

  distances.set(current, 0)

  let forceStop = false
  while (!queue.isEmpty() && !forceStop) {
    // Get vertice with lowest cost
    const vMinDistance = queue.allItems().reduce((acc, current) => {
      const accMin = distances.get(acc)!
      const currentMin = distances.get(current)!
      return accMin < currentMin ? acc : current
    })

    queue.remove(vMinDistance)

    for (const neighbour of graph.getEdges(vMinDistance)!) {
      if (!queue.has(neighbour.destination)) continue
      const alt = distances.get(vMinDistance)! + neighbour.cost
      if (alt < distances.get(neighbour.destination)!) {
        distances.set(neighbour.destination, alt)
      }
    }
  }
  
  const distancesToDestination = [...distances.entries()]
    .filter(distance => {
      return distance[0].includes((board.amountRows() - 1) + "," + (board.amountColumns() - 1))
    })
    .map(distance => distance[1])
  
  return Math.min(...distancesToDestination)
}

export const solvePart2 = (input: string) => {
  // We can model this as a graph
  // And use Dijkstra's algorithm to find the shortest path
  // If the path so far is the same direction three times, 
  // We will artificially increase the cost of the edge to the next step
  // in the saem direction by Infinity (or we can just remove it). And we will
  // recalculate Dijkstra's algorithm from that point.

  // For part two we just need different parameters for the min and max distances

  const MIN_DISTANCE = 4

  const MAX_DISTANCE = 10

  type Tile = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
  const board = new Board<Tile>(input)

  const graph = new Graph(true)

  const serialiseGraphVertice = (coord: CoordinateRecord, allowedSteps: {
    [Direction.North]: [number, number],
    [Direction.East]: [number, number],
    [Direction.South]: [number, number],
    [Direction.West]: [number, number],
  }) => {
    return `${serialiseCoord(coord)}|N:min:${allowedSteps[Direction.North][0]}:max:${allowedSteps[Direction.North][1]},E:min:${allowedSteps[Direction.East][0]}:max:${allowedSteps[Direction.East][1]},S:min:${allowedSteps[Direction.South][0]}:max:${allowedSteps[Direction.South][1]},W:min:${allowedSteps[Direction.West][0]}:max:${allowedSteps[Direction.West][1]}`
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
    // Check steps MIN_DISTANCE to amountOfStepsRemaining  amount of steps
    for (let i = MIN_DISTANCE; i <= MAX_DISTANCE; i++) {
      let step = { y: 0, x: 0 }
      let count = 0
      for (let j = 0; j < i; j++) {
        step = stepInDirection(step, dir)
        count += Number(board.get(step))
      }

      // From the destination, we're only allowed to move in these directions:
      // I'm not going to put 0 for the reversing direciton, since
      // it will only incur increased cost anyway
      const allowedDestinations = {
        [Direction.North]: match(dir)
          .with(Direction.North, () => [0, 0] as [number, number]) // Also going to forbid steps in the same direction
          .with(Direction.South, () => [0, 0] as [number, number])
          .otherwise(() => [MIN_DISTANCE, MAX_DISTANCE] as [number, number]),
        [Direction.East]: match(dir)
          .with(Direction.East, () => [0, 0] as [number, number])
          .with(Direction.West, () => [0, 0] as [number, number])
          .otherwise(() => [MIN_DISTANCE, MAX_DISTANCE] as [number, number]),
        [Direction.South]: match(dir)
          .with(Direction.South, () => [0, 0] as [number, number])
          .with(Direction.North, () => [0, 0] as [number, number])
          .otherwise(() => [MIN_DISTANCE, MAX_DISTANCE] as [number, number]),
        [Direction.West]: match(dir)
          .with(Direction.West, () => [0, 0] as [number, number])
          .with(Direction.East, () => [0, 0] as [number, number])
          .otherwise(() => [MIN_DISTANCE, MAX_DISTANCE] as [number, number]),
      }

      if (board.isOutsideBounds(step)) continue

      graph.addEdge(
        serialiseGraphVertice({ y: 0, x: 0 }, {
          [Direction.North]: [MIN_DISTANCE, MAX_DISTANCE],
          [Direction.East]: [MIN_DISTANCE, MAX_DISTANCE],
          [Direction.South]: [MIN_DISTANCE, MAX_DISTANCE],
          [Direction.West]: [MIN_DISTANCE, MAX_DISTANCE],
        }),
        serialiseGraphVertice(step, allowedDestinations),
        count,
      )
    }
  }

  // We need to add the edges to the graph
  board.forEach((_, coord) => {
    for (const incomingDir of [Direction.North, Direction.East, Direction.South, Direction.West]) {
      const parentState: Record<Direction, [number, number]> = {
        [Direction.North]: match(incomingDir)
          .with(Direction.North, () => [0, 0])
          .with(Direction.South, () => [0, 0])
          .otherwise(() => [MIN_DISTANCE, MAX_DISTANCE]),
        [Direction.East]: match(incomingDir)
          .with(Direction.East, () => [0, 0])
          .with(Direction.West, () => [0, 0])
          .otherwise(() => [MIN_DISTANCE, MAX_DISTANCE]),
        [Direction.South]: match(incomingDir)
          .with(Direction.South, () => [0, 0])
          .with(Direction.North, () => [0, 0])
          .otherwise(() => [MIN_DISTANCE, MAX_DISTANCE]),
        [Direction.West]: match(incomingDir)
          .with(Direction.West, () => [0, 0])
          .with(Direction.East, () => [0, 0])
          .otherwise(() => [MIN_DISTANCE, MAX_DISTANCE]),            
      } as Record<Direction, [number, number]>

      // For each direction
      for (const dir of [Direction.North, Direction.East, Direction.South, Direction.West]) {
        // If parent state alreay shows that we're going in the same direction, we can skip it
        if (parentState[dir][0] === 0 && parentState[dir][1] === 0) continue

        const amountOfStepsRemaining = parentState[dir]
        // Check steps 1 to amountOfStepsRemaining  amount of steps
        for (let i = MIN_DISTANCE; i <= amountOfStepsRemaining[1]; i++) {
          let step = coord
          let count = 0
          for (let j = 0; j < i; j++) {
            step = stepInDirection(step, dir)
            count += Number(board.get(step))
          }

          // From the destination, we're only allowed to move in these directions:
          const allowedDestination = {
            [Direction.North]: match(dir)
              .with(Direction.North, () => [0, 0] as [number, number])
              .with(Direction.South, () => [0, 0] as [number, number])
              .otherwise(() => [MIN_DISTANCE, MAX_DISTANCE] as [number, number]),
            [Direction.East]: match(dir)
              .with(Direction.East, () => [0, 0] as [number, number])
              .with(Direction.West, () => [0, 0] as [number, number])
              .otherwise(() => [MIN_DISTANCE, MAX_DISTANCE] as [number, number]),
            [Direction.South]: match(dir)
              .with(Direction.South, () => [0, 0] as [number, number])
              .with(Direction.North, () => [0, 0] as [number, number])
              .otherwise(() => [MIN_DISTANCE, MAX_DISTANCE] as [number, number]),
            [Direction.West]: match(dir)
              .with(Direction.West, () => [0, 0] as [number, number])
              .with(Direction.East, () => [0, 0] as [number, number])
              .otherwise(() => [MIN_DISTANCE, MAX_DISTANCE] as [number, number]),
          }

          if (board.isOutsideBounds(step)) continue

          graph.addEdge(
            serialiseGraphVertice(coord, parentState),
            serialiseGraphVertice(step, allowedDestination),
            count,
          )
        }
      }
    }
  })

  // It's the serialised coordinate
  type NodeId = string

  // Now we need to run Dijkstra on the graph
  const queue = new Queue<NodeId>()
  const distances = new Map<NodeId, number>()

  const current = serialiseGraphVertice({ y: 0, x: 0 }, {
    [Direction.North]: [MIN_DISTANCE, MAX_DISTANCE],
    [Direction.East]: [MIN_DISTANCE, MAX_DISTANCE],
    [Direction.South]: [MIN_DISTANCE, MAX_DISTANCE],
    [Direction.West]: [MIN_DISTANCE, MAX_DISTANCE],
  })

  for (const verticeId of graph.getVertices()) {
    distances.set(verticeId, Infinity)
    queue.enqueue(verticeId)
  }

  distances.set(current, 0)

  let forceStop = false
  while (!queue.isEmpty() && !forceStop) {
    // Get vertice with lowest cost
    const vMinDistance = queue.allItems().reduce((acc, current) => {
      const accMin = distances.get(acc)!
      const currentMin = distances.get(current)!
      return accMin < currentMin ? acc : current
    })

    queue.remove(vMinDistance)

    for (const neighbour of graph.getEdges(vMinDistance)!) {
      if (!queue.has(neighbour.destination)) continue
      const alt = distances.get(vMinDistance)! + neighbour.cost
      if (alt < distances.get(neighbour.destination)!) {
        distances.set(neighbour.destination, alt)
      }
    }
  }
  
  const distancesToDestination = [...distances.entries()]
    .filter(distance => {
      return distance[0].includes((board.amountRows() - 1) + "," + (board.amountColumns() - 1))
    })
    .map(distance => distance[1])
  
  return Math.min(...distancesToDestination)
}
