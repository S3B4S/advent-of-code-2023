import { GraphNode, RepeatingSequence } from "@/utils/adt"
import { parseInputBlocks } from "@/utils/parsing"

export const solvePart1 = (input: string) => {
  const [seq, edges] = parseInputBlocks(input)
  const repSeq = new RepeatingSequence(seq[0].trim().split(''))
  const allNodes = {} as Record<string, GraphNode>
  edges.forEach(edge => {
    const [parent, rawEdges] = edge.split(' = ')
    const [_, left, right] = rawEdges.match(/\((\w{3})\, (\w{3})\)/)!

    if (!allNodes[parent]) {
      allNodes[parent] = new GraphNode(parent)
    }

    if (!allNodes[left]) {
      allNodes[left] = new GraphNode(left)
    }

    if (!allNodes[right]) {
      allNodes[right] = new GraphNode(right)
    }

    const node = allNodes[parent]
    node.addEdge(allNodes[left], 'left')
    node.addEdge(allNodes[right], 'right')
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
  return 0
}
