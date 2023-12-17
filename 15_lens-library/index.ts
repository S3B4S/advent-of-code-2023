export const solvePart1 = (input: string) => {
  const listToHash = input.trim().split(',')
  const calc = listToHash.map(str => {
    let currentValue = 0

    for (let i = 0; i < str.length; i++) {
      const ascii = str.charCodeAt(i)
      currentValue += ascii
      currentValue = currentValue * 17
      currentValue = currentValue % 256
    }

    return currentValue
  })

  return calc.reduce((acc, curr) => acc + curr)
}

export const solvePart2 = (input: string) => {
  const list = input.trim().split(',')
  const boxes = new Map<number, { lens: string, focalLength: number }[]>()

  list.forEach(str => {
    const [_, lensLabel, op, operand] = str.match(/(\w+)([-=])(\w*)/)!
    const boxId = solvePart1(lensLabel)
    if (!boxes.has(boxId)) boxes.set(boxId, [])
    const box = boxes.get(boxId)! // See last line
    const existingLensIndex = box.findIndex(x => x.lens === lensLabel)
    if (op === '=') {
      if (existingLensIndex === -1) {
        // This lens label does not exist in the box yet
        box.push({ lens: lensLabel, focalLength: Number(operand) })
        return
      }

      // The lens does exist, so replace in place
      box[existingLensIndex] = { 
        lens: lensLabel,
        focalLength: Number(operand)
      }
    }

    if (op === '-') {
      if (existingLensIndex === -1) return // Nothing to remove

      // Remove the lens
      box.splice(existingLensIndex, 1)
    }
  })

  return [...boxes.entries()].reduce((acc, [boxId, lenses]) => {
    const sumOfLenses = lenses.reduce((acc, lens, index) => acc + (1 + boxId) * (index + 1) * lens.focalLength, 0)
    return acc + sumOfLenses
  }, 0)
}

const prettyPrintBoxes = (boxes: Map<number, { lens: string, focalLength: number }[]>) => {
  for (const box of boxes) {
    console.log("Box " + box[0] + ": " + box[1].map(x => "[" + x.lens + " " + x.focalLength + "]").join(' '))
  }
}
