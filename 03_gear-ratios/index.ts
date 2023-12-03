import { LinkedListNode } from "@/utils/list"
import { Board, coordinateToString } from "@/utils/parsing"

export const solvePart1 = (input: string) => {
  const board = new Board(input)
  let isBuildingSeqeuenceNumbers = -1

  // Construct map of nodes which link to each other
  let map = {} as Record<string, LinkedListNode>
  board.forEach((tile, coordinate) => {
    const isNumber = tile.match(/\d+/g)

    if (isNumber && isBuildingSeqeuenceNumbers === -1) {
      isBuildingSeqeuenceNumbers = 0
    } else if (isBuildingSeqeuenceNumbers >= 0) {
      if (!isNumber) {
        isBuildingSeqeuenceNumbers = -1
      } else {
        isBuildingSeqeuenceNumbers++
      }
    }

    // If the x coordinate is 0, we went to a new line and we should
    // start a new sequence 
    if (isBuildingSeqeuenceNumbers >= 0 && coordinate.x > 0) {
      const node = new LinkedListNode(tile)

      // Exclude the head of the sequence
      if (isBuildingSeqeuenceNumbers > 0) {
        node.previous = map[coordinateToString({y: coordinate.y, x: coordinate.x - 1})]
        map[coordinateToString({y: coordinate.y, x: coordinate.x - 1})].next = node
      }
      
      map[coordinateToString(coordinate)] = node
    } else if (isBuildingSeqeuenceNumbers >= 0 && coordinate.x === 0) {
      const node = new LinkedListNode(tile)
      map[coordinateToString(coordinate)] = node
    }
  })

  // Now with the map, iterate over the symbols and if we find a symbol, look for any
  // adjacent linked lists and store the node of the head with the id of the head.

  const sequences = {} as Record<string, string>

  board.forEach((tile, coordinate) => {
    const isSymbol = tile.match(/[^\d.]/g)
    if (isSymbol) {
      const adjacentNodes = board.adjacentCoordinates(coordinate)
        .map(c => map[coordinateToString(c)])
        .filter(n => !!n)
      
      adjacentNodes.forEach(node => {
        let head = node.getHead()

        if (!sequences[head.id]) {
          let numberSeq = ''
          
          head.iterateUntilTail(node => {
            numberSeq += node.value
          })

          sequences[head.id] = numberSeq
        }
      })
    }
  })

  return Object.values(sequences).reduce((acc, curr) => acc + parseInt(curr), 0)
}

export const solvePart2 = (input: string) => {
  const board = new Board(input)
  let isBuildingSeqeuenceNumbers = -1

  // Construct hashmap of nodes which link to each other
  let map = {} as Record<string, LinkedListNode>
  board.forEach((tile, coordinate) => {
    const isNumber = tile.match(/\d+/g)

    if (isNumber && isBuildingSeqeuenceNumbers === -1) {
      isBuildingSeqeuenceNumbers = 0
    } else if (isBuildingSeqeuenceNumbers >= 0) {
      if (!isNumber) {
        isBuildingSeqeuenceNumbers = -1
      } else {
        isBuildingSeqeuenceNumbers++
      }
    }

    // If the x coordinate is 0, we went to a new line and we should
    // start a new sequence 
    if (isBuildingSeqeuenceNumbers >= 0 && coordinate.x > 0) {
      const node = new LinkedListNode(tile)

      // Exclude the head of the sequence
      if (isBuildingSeqeuenceNumbers > 0) {
        node.previous = map[coordinateToString({y: coordinate.y, x: coordinate.x - 1})]
        map[coordinateToString({y: coordinate.y, x: coordinate.x - 1})].next = node
      }
      
      map[coordinateToString(coordinate)] = node
    } else if (isBuildingSeqeuenceNumbers >= 0 && coordinate.x === 0) {
      const node = new LinkedListNode(tile)
      map[coordinateToString(coordinate)] = node
    }
  })

  let totalGearRatio = 0

  board.forEach((tile, coordinate) => {
    const isSymbol = tile.match(/[^\d.]/g)
    if (isSymbol) {
      const sequences = {} as Record<string, string>
      const adjacentNodes = board.adjacentCoordinates(coordinate)
        .map(c => map[coordinateToString(c)])
        .filter(n => !!n)
      
      let sequenceIds = [] as string[]

      adjacentNodes.forEach(node => {
        let head = node.getHead()

        if (!sequences[head.id]) {
          sequenceIds.push(head.id)
          let numberSeq = ''

          head.iterateUntilTail(node => {
            numberSeq += node.value
          })

          sequences[head.id] = numberSeq
        }
      })

      if (sequenceIds.length > 1) {
        const gearRatio = sequenceIds.map(id => sequences[id]).reduce((acc, curr) => acc * parseInt(curr), 1)
        totalGearRatio += gearRatio
      }
    }
  })

  return totalGearRatio
}
