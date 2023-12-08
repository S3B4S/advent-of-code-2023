import { expect, test } from 'bun:test'
import { Stack, Queue, RepeatingSequence, BinaryTree } from './adt'

test('Stack - Push 1', () => {
  const stack = new Stack()
  expect(stack.size()).toEqual(0)
  expect(stack.isEmpty()).toEqual(true)
  expect(stack.peek()).toEqual(undefined)
  expect(stack.pop()).toEqual(undefined)
  expect(stack.isEmpty()).toEqual(true)
  stack.push(1)
  expect(stack.isEmpty()).toEqual(false)
  expect(stack.size()).toEqual(1)
  expect(stack.peek()).toEqual(1)
  expect(stack.pop()).toEqual(1)
  expect(stack.isEmpty()).toEqual(true)
})

test("Stack - Push multiple", () => {
  const stack = new Stack()
  stack.push(1)
  stack.push(2)
  stack.push(3)
  expect(stack.size()).toEqual(3)
  expect(stack.peek()).toEqual(3)
  expect(stack.pop()).toEqual(3)
  expect(stack.pop()).toEqual(2)
  expect(stack.pop()).toEqual(1)
  expect(stack.pop()).toEqual(undefined)
  expect(stack.isEmpty()).toEqual(true)
})

test("Queue - Enqueue 1", () => {
  const queue = new Queue()
  expect(queue.size()).toEqual(0)
  expect(queue.isEmpty()).toEqual(true)
  expect(queue.peek()).toEqual(undefined)
  expect(queue.dequeue()).toEqual(undefined)
  expect(queue.isEmpty()).toEqual(true)
  queue.enqueue(1)
  expect(queue.isEmpty()).toEqual(false)
  expect(queue.size()).toEqual(1)
  expect(queue.peek()).toEqual(1)
  expect(queue.dequeue()).toEqual(1)
  expect(queue.isEmpty()).toEqual(true)
})

test("Queue - Enqueue multiple", () => {
  const queue = new Queue()
  queue.enqueue(1)
  queue.enqueue(2)
  queue.enqueue(3)
  expect(queue.size()).toEqual(3)
  expect(queue.peek()).toEqual(1)
  expect(queue.dequeue()).toEqual(1)
  expect(queue.size()).toEqual(2)
  expect(queue.dequeue()).toEqual(2)
  expect(queue.size()).toEqual(1)
  expect(queue.dequeue()).toEqual(3)
  expect(queue.size()).toEqual(0)
})

test("Repeating sequence", () => {
  const repSeq = new RepeatingSequence(['A', 'B', 'C'])
  expect(repSeq.next()).toEqual('A')
  expect(repSeq.next()).toEqual('B')
  expect(repSeq.next()).toEqual('C')
  expect(repSeq.next()).toEqual('A')
  expect(repSeq.next()).toEqual('B')
  expect(repSeq.next()).toEqual('C')
  expect(repSeq.next()).toEqual('A')
})

test("Binary tree - Attach children after root construct 1", () => {
  const root = new BinaryTree('root')

  const left = new BinaryTree('left')
  const right = new BinaryTree('right')

  expect(root.getLeft()).toBeUndefined()
  expect(root.getRight()).toBeUndefined()

  root.setEdge(left, 'left')
  root.setEdge(right, 'right')

  expect(root.left).toEqual(left)
  expect(root.right).toEqual(right)
})

test("Binary tree - Attach children after root construct 2", () => {
  const root = new BinaryTree('root')

  const left = new BinaryTree('left')
  const right = new BinaryTree('right')

  expect(root.getLeft()).toBeUndefined()
  expect(root.getRight()).toBeUndefined()

  root.setLeft(left)
  root.setRight(right)

  expect(root.left).toEqual(left)
  expect(root.right).toEqual(right)
})

test("Binary tree - Initialise in constructor", () => {
  const left = new BinaryTree('left')
  const right = new BinaryTree('right')

  const root = new BinaryTree('root', left, right)

  expect(root.left).toEqual(left)
  expect(root.right).toEqual(right)
})

test("Binary tree - Root without children", () => {
  const root = new BinaryTree('root')

  expect(root.left).toBeUndefined()
  expect(root.right).toBeUndefined()
})
