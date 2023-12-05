import { expect, test } from 'bun:test'
import { Stack } from './adt'

test('Stack test', () => {
  const stack = new Stack()
  expect(stack.isEmpty()).toEqual(true)
  stack.push(1)
  expect(stack.isEmpty()).toEqual(false)
  expect(stack.size()).toEqual(1)
  expect(stack.peek()).toEqual(1)
  expect(stack.pop()).toEqual(1)
  expect(stack.isEmpty()).toEqual(true)
})