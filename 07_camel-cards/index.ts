import { parseInputLines } from "@/utils/parsing"
import { P, match } from "ts-pattern"

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

const includes = <T>(el: T) => (list: T[]) => list.includes(el)

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
  const pairs = cards.reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: (acc[curr] || 0) + 1
    }
  }, {} as Record<string, number>)
  // This is an array which just holds the count of each type of card present
  // Example: if the hand is "4455A", counts would be [2, 2, 1]
  const counts = Object.values(pairs)
  const nDistinctCards = counts.length

  return match({ nDistinctCards, counts })
    .with({ nDistinctCards: 1 }, () => Hand.FiveOfAKind)
    
    .with({ nDistinctCards: 2, counts: P.when(includes(4)) }, () => Hand.FourOfAKind)
    .with({ nDistinctCards: 2 }, () => Hand.FullHouse)

    .with({ nDistinctCards: 3, counts:  P.when(includes(3)) }, () => Hand.ThreeOfAKind)
    .with({ nDistinctCards: 3 }, () => Hand.TwoPair)
    
    .with({ nDistinctCards: 4 }, () => Hand.OnePair)
    .otherwise(() => Hand.HighCard)
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
  const pairs = cards.reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: (acc[curr] || 0) + 1
    }
  }, {} as Record<string, number>)
  // Remove the joker from the pairs
  const { J: nJokers, ...rest } = pairs
  // This is an array which just holds the count of each type of card present
  // Example: if the hand is "4455A", counts would be [2, 2, 1]
  const counts = Object.values(rest)
  // The amount of distinct cards does *not* include the joker
  const nDistinctCards = counts.length
  
  return match({ nJokers, nDistinctCards, counts })
    .with({ nJokers: 5 }, () => Hand.FiveOfAKind)
    .with({ nJokers: 4 }, () => Hand.FiveOfAKind)
    
    .with({ nJokers: 3, nDistinctCards: 1 }, () => Hand.FiveOfAKind)
    .with({ nJokers: 3 }, () => Hand.FourOfAKind)

    .with({ nJokers: 2, nDistinctCards: 1 }, () => Hand.FiveOfAKind)
    .with({ nJokers: 2, nDistinctCards: 2 }, () => Hand.FourOfAKind)
    .with({ nJokers: 2, }, () => Hand.ThreeOfAKind)

    .with({ nJokers: 1, nDistinctCards: 1 }, () => Hand.FiveOfAKind)
    .with({ nJokers: 1, nDistinctCards: 2, counts: P.when(includes(3)) }, () => Hand.FourOfAKind)
    .with({ nJokers: 1, nDistinctCards: 2, counts: P.when(includes(2)) }, () => Hand.FullHouse)
    .with({ nJokers: 1, nDistinctCards: 3 }, () => Hand.ThreeOfAKind)
    .with({ nJokers: 1, nDistinctCards: 4 }, () => Hand.OnePair)

    .otherwise(() => typeOfHand(hand))
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
