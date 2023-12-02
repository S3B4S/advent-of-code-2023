const maximum = {
  red: 12,
  green: 13,
  blue: 14,
}

const pairsOf2FromList = (list: string[]) => {
  const result = []
  for (let i = 0; i < list.length; i += 2) {
    result.push([list[i], list[i + 1]])
  }
  return result
}

export const solvePart1 = (input: string) => {
  const lines = input.split('\n')
  const ids = []
  const x = lines.map(line => {
    const [_, id, ...cubes] = line.split(' ')
    const realId = Number(id.slice(0, -1))
    const sets = cubes.join(' ').split('; ').map(x => x.split(', '))
    
    const isPossible = sets.every(set => {
      return set.every(cubes => {
        const [amount, color] = cubes.split(' ')
        if (color.includes('red')) {
          return Number(amount) <= maximum.red
        } else if (color.includes('green')) {
          return Number(amount) <= maximum.green
        } else if (color.includes('blue')) {
          return Number(amount) <= maximum.blue
        }
        return false
      })
    })

    if (isPossible) {
      ids.push(realId)
    }
    return
  })

  return ids.reduce((acc, curr) => acc + curr, 0)
}

export const solvePart2 = (input: string) => {
  const lines = input.split('\n')
  const ids = []
  const x = lines.map(line => {
    const [_, id, ...cubes] = line.split(' ')
    const realId = Number(id.slice(0, -1))
    const sets = cubes.join(' ').split('; ').map(x => x.split(', '))
    // console.log(realId)
    let maxRed = 0
    let maxGreen = 0
    let maxBlue = 0

    const isPossible = sets.forEach(set => {
      return set.forEach(cubes => {
        const [amount, color] = cubes.split(' ')
        if (color.includes('red')) {
          maxRed = Math.max(maxRed, Number(amount))
        } else if (color.includes('green')) {
          maxGreen = Math.max(maxGreen, Number(amount))
        } else if (color.includes('blue')) {
          maxBlue = Math.max(maxBlue, Number(amount))
        }
        return false
      })
    })

    return maxRed * maxGreen * maxBlue
  })
  
  // const y = x.filter(({ red, green, blue }) => {
  //   return red <= maximum.red && green <= maximum.green && blue <= maximum.blue
  // }).reduce((acc, curr) => acc + curr.id, 0)

  return x.reduce((acc, curr) => acc + curr, 0)
}

// 289 NOT RIGHT