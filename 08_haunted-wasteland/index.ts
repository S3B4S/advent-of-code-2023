import { BinaryTree, Queue, RepeatingSequence, Stack } from "@/utils/adt"
import { lcm } from "@/utils/math"
import { parseInputBlocks } from "@/utils/parsing"

export const solvePart1 = (input: string) => {
  const [seq, edges] = parseInputBlocks(input)
  const repSeq = new RepeatingSequence(seq[0].trim().split(''))
  const allNodes = {} as Record<string, BinaryTree>
  edges.forEach(edge => {
    const [parent, left, right] = edge.split(/\W+/)

    if (!allNodes[parent]) {
      allNodes[parent] = new BinaryTree(parent)
    }

    if (!allNodes[left]) {
      allNodes[left] = new BinaryTree(left)
    }

    if (!allNodes[right]) {
      allNodes[right] = new BinaryTree(right)
    }

    const node = allNodes[parent]
    node.setEdge(allNodes[left], 'left')
    node.setEdge(allNodes[right], 'right')
  })

  let currentNode = allNodes['AAA']
  let count = 0
  while (currentNode.value !== 'ZZZ') {
    count += 1
    currentNode = currentNode.followEdge(repSeq.next() === 'L' ? 'left' : 'right')!
  }

  return count
}

export const solvePart2 = (input: string) => {
  const [seq, edges] = parseInputBlocks(input)
  const allNodes = {} as Record<string, BinaryTree>
  const nodesA: Set<string> = new Set()
  const nodesZ: Set<string> = new Set()
  edges.forEach(edge => {
    const [parent, left, right] = edge.split(/\W+/)

    if (parent.endsWith('A')) {
      nodesA.add(parent)
    }

    if (parent.endsWith('Z')) {
      nodesZ.add(parent)
    }
    
    if (!allNodes[parent]) {
      allNodes[parent] = new BinaryTree(parent)
    }

    if (!allNodes[left]) {
      allNodes[left] = new BinaryTree(left)
    }

    if (!allNodes[right]) {
      allNodes[right] = new BinaryTree(right)
    }

    const node = allNodes[parent]
    node.setLeft(allNodes[left])
    node.setRight(allNodes[right])
  })

  const distances = [...nodesA].map(a => followSeqUntilZ(allNodes, seq[0].trim(), a))

  return distances.reduce(lcm)
}

const followSeqUntilZ = (allNodes: Record<string, BinaryTree>, seq: string, node: string) => {
  let currentNode = allNodes[node]
  const repSeq = new RepeatingSequence(seq.split(''))
  
  let count = 0
  while (!currentNode.value.endsWith('Z')) {
    count++
    currentNode = currentNode.followEdge(repSeq.next() === 'L' ? 'left' : 'right')!
  }
  return count
}
