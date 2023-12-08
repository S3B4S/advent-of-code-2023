import { BinaryGraphNode, Queue, RepeatingSequence, Stack } from "@/utils/adt"
import { parseInputBlocks } from "@/utils/parsing"

export const solvePart1 = (input: string) => {
  const [seq, edges] = parseInputBlocks(input)
  const repSeq = new RepeatingSequence(seq[0].trim().split(''))
  const allNodes = {} as Record<string, BinaryGraphNode>
  edges.forEach(edge => {
    const [parent, rawEdges] = edge.split(' = ')
    const [_, left, right] = rawEdges.match(/\((\w{3})\, (\w{3})\)/)!

    if (!allNodes[parent]) {
      allNodes[parent] = new BinaryGraphNode(parent)
    }

    if (!allNodes[left]) {
      allNodes[left] = new BinaryGraphNode(left)
    }

    if (!allNodes[right]) {
      allNodes[right] = new BinaryGraphNode(right)
    }

    const node = allNodes[parent]
    node.setEdge(allNodes[left], 'left')
    node.setEdge(allNodes[right], 'right')
  })

  let currentNode = allNodes['AAA']
  let count = 0
  while (currentNode.value !== 'ZZZ') {
    count += 1
    if (repSeq.next() === 'L') {
      currentNode = currentNode.followEdge('left')!
    } else {
      currentNode = currentNode.followEdge('right')!
    }
  }

  return count
}

export const solvePart2 = (input: string) => {
  const [seq, edges] = parseInputBlocks(input)
  const allNodes = {} as Record<string, BinaryGraphNode>
  const nodesA: Set<string> = new Set()
  const nodesZ: Set<string> = new Set()
  edges.forEach(edge => {
    const [parent, rawEdges] = edge.split(' = ')
    const [_, left, right] = rawEdges.match(/\((\w{3})\, (\w{3})\)/)!

    if (parent.endsWith('A')) {
      nodesA.add(parent)
    }

    if (parent.endsWith('Z')) {
      nodesZ.add(parent)
    }
    
    if (!allNodes[parent]) {
      allNodes[parent] = new BinaryGraphNode(parent)
    }

    if (!allNodes[left]) {
      allNodes[left] = new BinaryGraphNode(left)
    }

    if (!allNodes[right]) {
      allNodes[right] = new BinaryGraphNode(right)
    }

    const node = allNodes[parent]
    node.setEdge(allNodes[left], 'left')
    node.setEdge(allNodes[right], 'right')
  })

  const numbers = [...nodesA].map(a => followSeqUntilZ(allNodes, seq[0].trim(), a))

  return numbers.reduce(lcm)
}

const followSeqUntilZ = (allNodes: Record<string, BinaryGraphNode>, seq: string, node: string) => {
  let currentNode = allNodes[node]
  const repSeq = new RepeatingSequence(seq.split(''))
  
  let count = 0
  while (!currentNode.value.endsWith('Z')) {
    const step = repSeq.next()
    count++

    if (step === 'L') {
      currentNode = currentNode.followEdge('left')!
    } else {
      currentNode = currentNode.followEdge('right')!
    }
  }
  return count
}

const gcd = (a: number, b: number): number => (b == 0 ? a : gcd(b, a % b))
const lcm = (a: number, b: number): number => (a / gcd(a, b)) * b
