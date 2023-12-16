import { chunksOfN, countWhile, sliding, zip } from "@/utils/list"
import { Board, parseInputBlocks } from "@/utils/parsing"
import { hash } from "bun"
import chalk from "chalk"

const amountDuplicates = <T>(el: T, list: T[]) => {
  let count = 0
  for (let i = 0; i < list.length; i++) {
    if (list[i] === el) {
      count++
    }
  }
  return count
}

type Hash = number | bigint

/**
   * Given a pair which represents the start of the mirror sequence,
   * check the total length
   * @param pair 
   * @param orientation 
   * @param board 
   */
const mirrorLength = (pair: [[Hash, number], [Hash, number]], hashedCollection: (Hash)[]) => {
  const index = pair[1][1]
  // Now that we have our index, split the array in 2, reverse the first part,
  // zip and then count the amount of zipped entries that are equal
  
  const firstHalf = hashedCollection.slice(0, index).reverse()
  const secondHalf = hashedCollection.slice(index)
  const zipped = zip(firstHalf, secondHalf)
  const halfLengthSymmetry = countWhile(([a, b]: [Hash, Hash]) => a === b)(zipped)
  return halfLengthSymmetry
}

export const solvePart1 = (input: string) => {
  const boards = input.split('\n\n').map(board => new Board<"#" | ".">(board)).slice(0, 10)

  const count = {
    columns: 0,
    rows: 0,
  };

  const prettyBoards = boards.map(board => new Board(board.toString()))
  
  boards.forEach((board, boardIndex) => {
    const hashedCols = board.columns().map(col => hash(col.join('')))
    const hashedRows = board.rows().map(col => hash(col.join('')))

    for (const [hashedCollection, orientation] of [[hashedCols, 'columns'], [hashedRows, 'rows']] as const) {
      // console.log()
      // console.log(orientation)

      // console.log(hashedCollection)

      // 1. Find the indices of the pairs which are adjacent duplicates
      // Each forms a candidate to be the middle of the full mirrored sequence
      const adjacentDuplicates = (sliding(2)(hashedCollection.map((col, i) => [col, i] as [Hash, number])) as [[Hash, number], [Hash, number]][])
        .filter(pair => pair[0][0] === pair[1][0])

      if (adjacentDuplicates.length === 0) continue

      // 2. Find the pair of duplicates that mirrors the most across the sequence
      const mirroredPairs = adjacentDuplicates.slice(1).reduce((acc, pair) => {
        const ml = mirrorLength(pair, hashedCollection)
        return ml > acc.ml ? { pair, ml } : acc
      }, { pair: adjacentDuplicates[0], ml: mirrorLength(adjacentDuplicates[0], hashedCollection) } as { pair: [Hash, number][], ml: number })

      // 3. This mirroredPairs needs to be a "perfect" mirror.
      // I think it means that one of the mirrored sections should go all the way to the border?
      // We can detect this through the math, where we know if one of the sides + or minus the ml reaches the boundary
      const startIndex = mirroredPairs.pair[0][1] + 1 - mirroredPairs.ml
      const endIndex = mirroredPairs.pair[1][1] + mirroredPairs.ml
      const isPerfect = startIndex  === 0 || endIndex === hashedCollection.length

      if (isPerfect) {
        // 4. Now that we have found the perfect mirror, we can count
        // So now we can count the rows above and the columns to the left

        // console.log(mirroredPairs)
        if (orientation === 'columns') {
          // Print all mirrored columns yellow
          for (let i = startIndex; i <= endIndex; i++) {
            if (i === mirroredPairs.pair[0][1] || i === mirroredPairs.pair[1][1]) continue
            prettyBoards[boardIndex].mapColumn(i, chalk.yellow)
          }

          // Paint where the mirroring starts with different colors
          prettyBoards[boardIndex].mapColumn(mirroredPairs.pair[0][1], chalk.blue)
          prettyBoards[boardIndex].mapColumn(mirroredPairs.pair[1][1], chalk.blue)
          console.log()
          console.log("Amount columns detected: " + (mirroredPairs.pair[0][1] + 1))
          console.log(prettyBoards[boardIndex].toString())
          count.columns += (mirroredPairs.pair[0][1] + 1)
        } else {
          // Paint all mirrored rows yellow
          for (let i = startIndex; i <= endIndex; i++) {
            if (i === mirroredPairs.pair[0][1] || i === mirroredPairs.pair[1][1]) continue
            prettyBoards[boardIndex].mapRow(i, chalk.yellow)
          }

          // Paint where the mirroring starts with different colors
          prettyBoards[boardIndex].mapRow(mirroredPairs.pair[0][1], chalk.blue)
          prettyBoards[boardIndex].mapRow(mirroredPairs.pair[1][1], chalk.blue)

          console.log()
          console.log("Amount rows detected: " + (mirroredPairs.pair[0][1] + 1))
          console.log(prettyBoards[boardIndex].toString())
          count.rows += (mirroredPairs.pair[0][1] + 1)
        }
        
        break
      }
    }
  })

  // prettyBoards.forEach(board => {
  //   console.log()
  //   console.log(board.toString())
  // })
  // console.log(count)

  // 30783 too low
  return count.columns + count.rows * 100
}

export const solvePart2 = (input: string) => {
  return 0
}
