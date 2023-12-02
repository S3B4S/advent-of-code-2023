const maximum = {
  red: 12,
  green: 13,
  blue: 14,
}

export const solvePart1 = (input: string) => {
  const lines = input.split('\n')
  const ids = lines.flatMap(line => {
    const [_, rawId, ...cubes] = line.split(' ')
    const id = Number(rawId.slice(0, -1))
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
      return id
    }
    return []
  })

  return ids.reduce((acc, curr) => acc + curr, 0)
}

export const solvePart2 = (input: string) => {
  const lines = input.split('\n')
  const powers = lines.map(line => {
    const [_, _2, ...cubes] = line.split(' ')
    const sets = cubes.join(' ').split('; ').map(x => x.split(', '))
    let maxRed = 0
    let maxGreen = 0
    let maxBlue = 0

    sets.forEach(set => {
      set.forEach(cubes => {
        const [amount, color] = cubes.split(' ')
        if (color.includes('red')) {
          maxRed = Math.max(maxRed, Number(amount))
        } else if (color.includes('green')) {
          maxGreen = Math.max(maxGreen, Number(amount))
        } else if (color.includes('blue')) {
          maxBlue = Math.max(maxBlue, Number(amount))
        }
      })
    })

    return maxRed * maxGreen * maxBlue
  })

  return powers.reduce((acc, curr) => acc + curr, 0)
}
