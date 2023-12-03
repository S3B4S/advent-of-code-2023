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
  iterateUntilTail(fn: (node: LinkedListNode) => any) {
    let currentNode = this as LinkedListNode
    fn(currentNode)
    while (currentNode.next) {
      currentNode = currentNode.next
      fn(currentNode)
    }
  }

  toString() {
    return `Value: ${this.value.toString()} | Id: ${this.id.toString()} | Previous: ${this.previous?.value.toString()} | Next: ${this.next?.value.toString()}`
  }
}

export class DoublyLinkedList {
  head: LinkedListNode | null
  tail: LinkedListNode | null
  length: number
  id: string

  constructor() {
    this.head = null
    this.tail = null
    this.length = 0
    this.id = randomUUID()
  }

  push(value: any) {
    const node = new LinkedListNode(value)
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
