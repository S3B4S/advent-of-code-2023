import { logId } from "@/utils/misc"
import { parseInputLines } from "@/utils/parsing"

export const solvePart1 = (input: string) => {
  const chunks = parseInputLines(input).map(line => {
    const [start, end] = line.split('|')
    const [id, startNumbers] = start.split(':')
    return {startNumbers: startNumbers.trim().split(' '), end: end.trim().split(' '), id: id.split(' ')[1]}
  })

  const res = chunks.map(({ startNumbers, end, id }) => {
    const intersection = [...startNumbers].filter(x => end.includes(x)).filter(x => x !== '')
    return intersection.reduce((acc, curr) => (acc === 0) ? 1 : acc * 2, 0)
  })


  return res.reduce((acc, curr) => acc + curr, 0)
}

export const solvePart2 = (input: string) => {
  const chunks = parseInputLines(input).map(line => {
    const [start, end] = line.split('|')
    const [id, startNumbers] = start.split(':')
    return {startNumbers: startNumbers.trim().split(' '), end: end.trim().split(' '), id: id.split(' ').pop()}
  })

  let amount = [] as number[]
  chunks.forEach((_, index) => amount[index] = 1)
  const res = chunks.map(({ startNumbers, end, id }) => {
    const intersection = [...startNumbers].filter(x => end.includes(x)).filter(x => x !== '')
    for (let i = Number(id); i < Number(id) + intersection.length; i++) {
      const amountCurrentCard = amount[Number(id) - 1] || 1
      amount[Number(i)] = (amount[Number(i)] || 1) + amountCurrentCard
    }
    return intersection.length
  })


  return amount.filter(x => !isNaN(x)).reduce((acc, curr) => acc + curr, 0)
}
