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

type Card = "A" | "K" | "Q" | "J" | "T" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2"

////////////
// Part 1 //
////////////

const valueOfCard: Record<Card, number> = {
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
  return parseInputLines(input)
    .map(line => {
      const [seq, bet] = line.split(' ')
      return {
        seq,
        type: typeOfHand(seq),
        bet
      }
    })
    .sort((handA, handB) => {
      const diff = handA.type - handB.type
      if (diff === 0) {
        for (let i = 0; i < 5; i++) {
          if (handB.seq[i] !== handA.seq[i])
            return valueOfCard[handA.seq[i] as Card] - valueOfCard[handB.seq[i] as Card]
        }
      }
      return diff
    })
    .reduce((acc, curr, i) => {
      return acc + Number(curr.bet) * (i + 1)
    }, 0)
}

////////////
// Part 2 //
////////////

const valueOfCardWithJoker: Record<Card, number> = {
  A: 12,
  K: 11,
  Q: 10,
  T: 9,
  9: 8,
  8: 7,
  7: 6,
  6: 5,
  5: 4,
  4: 3,
  3: 2,
  2: 1,
  J: 0,
}

export const typeOfHandWithJoker = (hand: string): Hand => {
  const cards = hand.trim().split('')
  const count = cards.reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: (acc[curr] || 0) + 1
    }
  }, {} as Record<string, number>)
  // Remove the joker from the pairs
  const { J: amountJokers, ...rest } = count
  const pairs = Object.entries(rest)
  const amountDistinctCards = pairs.length

  if (amountJokers) {
    // If a joker is present, we'll have to determine the best set possible
    if (amountJokers === 5 || amountJokers === 4) {
      return Hand.FiveOfAKind
    }

    if (amountJokers === 3) {
      if (pairs.some(pair => pair[1] === 2))
        return Hand.FiveOfAKind
      return Hand.FourOfAKind
    }

    if (amountJokers === 2) {
      // The three other cards are equal
      if (pairs.some(pair => pair[1] === 3))
        return Hand.FiveOfAKind
      
      // 2 other cards are equal
      if (pairs.some(pair => pair[1] === 2))
        return Hand.FourOfAKind
      
      // All the other 3 cards are distinct
      return Hand.ThreeOfAKind
    }

    if (amountJokers === 1) {
      if (amountDistinctCards === 1) // There's 4 of this one card
        return Hand.FiveOfAKind

      if (amountDistinctCards === 2) { // There could be 3, or 2 of this
        if (pairs.some(pair => pair[1] === 3))
          return Hand.FourOfAKind

        // If we have 2 pairs of 2, we can create a full house
        if (pairs.some(pair => pair[1] === 2))
          return Hand.FullHouse
      }

      if (amountDistinctCards === 3)
        return Hand.ThreeOfAKind

      // If amountDistinctCards === 4
      return Hand.OnePair
    }
  }
  
  // There are no jokers in this case
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

export const solvePart2 = (input: string) => {
  return parseInputLines(input)
    .map(line => {
      const [seq, bet] = line.split(' ')
      return {
        seq,
        type: typeOfHandWithJoker(seq),
        bet
      }
    })
    .sort((handA, handB) => {
      const diff = handA.type - handB.type
      if (diff === 0) {
        for (let i = 0; i < 5; i++) {
          if (handB.seq[i] !== handA.seq[i])
            return valueOfCardWithJoker[handA.seq[i] as Card] - valueOfCardWithJoker[handB.seq[i] as Card]
        }
      }
      return diff
    })
    .reduce((acc, curr, i) => {
      return acc + Number(curr.bet) * (i + 1)
    }, 0)
}
