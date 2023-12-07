import { parseInputLines } from "@/utils/parsing"

export enum Hand {
  "FiveOfAKind" = 6,
  "FourOfAKind" = 5,
  "FullHouse" = 4,
  "ThreeOfAKind" = 3,
  "TwoPair" = 2,
  "OnePair" = 1,
  "HighCard" = 0,
}

const valueOfCard = {
  A: 12,
  K: 11,
  Q: 10,
  J: 9,
  T: 8,
  9: 7,
  8: 6,
  7: 5,
  6: 4,
  5: 3,
  4: 2,
  3: 1,
  2: 0,
}

export const typeOfHand = (hand: string): Hand => {
  const cards = hand.trim().split('')
  const count = cards.reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: (acc[curr] || 0) + 1
    }
  }, {} as Record<string, number>)
  const pairs = Object.entries(count)
  const amountDistinctCards = pairs.length

  if (amountDistinctCards === 1) {
    return Hand.FiveOfAKind
  }

  if (amountDistinctCards === 2) {
    if (pairs.some(pair => pair[1] === 4))
      return Hand.FourOfAKind
    return Hand.FullHouse
  }

  if (amountDistinctCards === 3) {
    if (pairs.some(pair => pair[1] === 3))
      return Hand.ThreeOfAKind
    return Hand.TwoPair
  }

  if (amountDistinctCards === 4) {
    return Hand.OnePair
  }

  return Hand.HighCard
}

export const solvePart1 = (input: string) => {
  const hands = parseInputLines(input)
    .map(line => {
      const [seq, bet] = line.split(' ')
      return {
        seq,
        type: typeOfHand(seq),
        bet
      }
    })
  const sortedHands = hands.sort((handA, handB) => {
    const diff = handB.type - handA.type
    if (diff === 0) {
      for (let i = 0; i < 5; i++) {
        if (handB.seq[i] !== handA.seq[i])
          return valueOfCard[handB.seq[i]] - valueOfCard[handA.seq[i]]
      }
    }
    return diff
  })

  // console.log(sortedHands)
  
  let count = 0
  let rank = 1
  for (let i = sortedHands.length - 1; i >= 0; i--) {
    count += sortedHands[i].bet * rank
    rank++
  }

  return count
}

export const solvePart2 = (input: string) => {
  return 0
}
