import { randomUUID } from "crypto"

// @TODO Can I infer T?
export class LinkedListNode<T> {
  value: T
  next: LinkedListNode<T> | null
  previous: LinkedListNode<T> | null
  id: string

  constructor(value: any) {
    this.value = value
    this.next = null
    this.previous = null
    this.id = randomUUID()
  }

  getHead() {
    let currentNode = this as LinkedListNode<T>
    while (currentNode.previous) {
      currentNode = currentNode.previous
    }
    return currentNode
  }

  getTail() {
    let currentNode = this as LinkedListNode<T>
    while (currentNode.next) {
      currentNode = currentNode.next
    }
    return currentNode
  }

  /**
   * From the current node, iterate until the tail
   * Execute callback function for every node
   */
  iterateUntilLast(fn: (node: LinkedListNode<T>) => any) {
    let currentNode = this as LinkedListNode<T>
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
    return `Value: ${JSON.stringify(this.value)} | Id: ${this.id.toString()} | Previous: ${this.previous?.value?.toString()} | Next: ${this.next?.value?.toString()}`
  }

  printPath() {
    let currentNode = this as LinkedListNode<T>
    while (currentNode.next) {
      console.log(currentNode.toString())
      currentNode = currentNode.next
    }
    console.log(currentNode.toString())
  }
 }

export class DoublyLinkedList<T> {
  head: LinkedListNode<T> | null
  last: LinkedListNode<T> | null
  length: number
  id: string

  constructor() {
    this.head = null
    this.last = null
    this.length = 0
    this.id = randomUUID()
  }

  push(value: T) {
    const node = new LinkedListNode<T>(value)
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

export const countWhile = <T>(predicate: (x: T) => boolean) => (list: T[]) => {
  let count = 0
  for (let i = 0; i < list.length; i++) {
    if (predicate(list[i])) {
      count++
    } else {
      break
    }
  }
  return count
}
