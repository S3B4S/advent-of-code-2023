import { randomUUID } from "crypto"

export class LinkedListNode {
  value: any
  next: LinkedListNode | null
  previous: LinkedListNode | null
  id: string

  constructor(value: any) {
    this.value = value
    this.next = null
    this.previous = null
    this.id = randomUUID()
  }

  getHead() {
    let currentNode = this as LinkedListNode
    while (currentNode.previous) {
      currentNode = currentNode.previous
    }
    return currentNode
  }

  getTail() {
    let currentNode = this as LinkedListNode
    while (currentNode.next) {
      currentNode = currentNode.next
    }
    return currentNode
  }

  /**
   * From the current node, iterate until the tail
   * Execute callback function for every node
   */
  iterateUntilLast(fn: (node: LinkedListNode) => any) {
    let currentNode = this as LinkedListNode
    fn(currentNode)
    while (currentNode.next) {
      currentNode = currentNode.next
      fn(currentNode)
    }
  }

  /**
   * Can be used to uniquely identify a linked list
   * @returns the id of the head node
   */
  getHeadId() {
    return this.getHead().id
  }

  toString() {
    return `Value: ${JSON.stringify(this.value)} | Id: ${this.id.toString()} | Previous: ${this.previous?.value.toString()} | Next: ${this.next?.value.toString()}`
  }

  printPath() {
    let currentNode = this as LinkedListNode
    while (currentNode.next) {
      console.log(currentNode.toString())
      currentNode = currentNode.next
    }
    console.log(currentNode.toString())
  }
 }

export class DoublyLinkedList {
  head: LinkedListNode | null
  last: LinkedListNode | null
  length: number
  id: string

  constructor() {
    this.head = null
    this.last = null
    this.length = 0
    this.id = randomUUID()
  }

  push(value: any) {
    const node = new LinkedListNode(value)
    if (!this.head) {
      this.head = node
      this.last = node
    } else if (!this.last) {
      this.last = node
      this.head.next = node
      node.previous = this.head
    } else {
      this.last.next = node
      node.previous = this.last
      this.last = node
    }
    this.length++
    return this
  }
}

export const chunksOfN = (n: number) => (list: any[]) => {
  const chunks = []
  for (let i = 0; i < list.length; i += n) {
    chunks.push(list.slice(i, i + n))
  }
  return chunks
}
