import { Board, coordinateToString } from "@/utils/parsing"
import { randomUUID } from "crypto"


export const solvePart1 = (input: string) => {
  const board = new Board(input)
  let isBuildingSeqeuenceNumbers = -1

  // Construct hashmap of nodes which link to each other
  let hashMap = {} as Record<string, Node>
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
      const node = new Node(tile)

      // Exclude the head of the sequence
      if (isBuildingSeqeuenceNumbers > 0) {
        // console.log(hashMap)
        // console.log(coordinate)
        node.previous = hashMap[coordinateToString({y: coordinate.y, x: coordinate.x - 1})]
        hashMap[coordinateToString({y: coordinate.y, x: coordinate.x - 1})].next = node
      }
      
      hashMap[coordinateToString(coordinate)] = node
    } else if (isBuildingSeqeuenceNumbers >= 0 && coordinate.x === 0) {
      const node = new Node(tile)
      hashMap[coordinateToString(coordinate)] = node
    }
  })

  // Now with the hashmap, iterate over the symbols and if we find a symbol, look for any
  // adjacent linked lists and store the node of the head with the id of the head.

  const sequences = {} as Record<string, string>

  board.forEach((tile, coordinate) => {
    const isSymbol = tile.match(/[^\d.]/g)
    if (isSymbol) {
      const adjacentCoordinates = board.adjacentCoordinates(coordinate)
      const adjacentNodes = adjacentCoordinates
        .map(c => hashMap[coordinateToString(c)])
        .filter(n => !!n)
      
      adjacentNodes.forEach(node => {
        let currentNode = node
        // console.log('----')
        // console.log(currentNode.toString())
        while (currentNode.previous) {
          currentNode = currentNode.previous
        }
        // console.log(currentNode.toString())

        if (!sequences[currentNode.id]) {
          let numberSeq = ''
          let currentNode2 = currentNode
          numberSeq += currentNode2.value
          while (currentNode2.next) {
            currentNode2 = currentNode2.next
            numberSeq += currentNode2.value
          }

          sequences[currentNode.id] = numberSeq
        }
      })
    }
  })

  return Object.values(sequences).reduce((acc, curr) => acc + parseInt(curr), 0)
}

export const solvePart2 = (input: string) => {
  return 0
}

class Node {
  value: any
  next: Node | null
  previous: Node | null
  id: string

  constructor(value: any) {
    this.value = value
    this.next = null
    this.previous = null
    this.id = randomUUID()
  }

  toString() {
    return `${this.value.toString()} | ${this.id.toString()} | ${this.previous?.value.toString()} | ${this.next?.value.toString()}`
  }
}

class DoublyLinkedList {
  head: Node | null
  tail: Node | null
  length: number
  id: string

  constructor() {
    this.head = null
    this.tail = null
    this.length = 0
    this.id = randomUUID()
  }

  push(value: any) {
    const node = new Node(value)
    if (!this.head) {
      this.head = node
      this.tail = node
    } else if (!this.tail) {
      this.tail = node
      this.head.next = node
      node.previous = this.head
    } else {
      this.tail.next = node
      node.previous = this.tail
      this.tail = node
    }
    this.length++
    return this
  }
}