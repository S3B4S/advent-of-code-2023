import { parseInputLines } from "@/utils/parsing"
import { exec } from "child_process"
import { type } from "os"
import { match } from "ts-pattern"

type MachineType = 'x' | 'm' | 'a' | 's'
type Compataror = '<' | '>'
type TypeRule = 'condition' | 'otherwise'

type Interval = {
  gte: number,
  lte: number,
}

type Summary = {
  x: Interval,
  m: Interval,
  a: Interval,
  s: Interval,
}

type Rule = {
  type: 'condition',
  machineType: MachineType,
  comparator: Compataror,
  value: number,
  result: string,
} | {
  type: 'otherwise',
  result: string,
}

const regex = {
  nameAndRules: /(\w+){([\d\w:,<>]+)}/,
  rule: /(\w)([<>])(\d+):(\w+)/,
  machine: /{x=(\d+),m=(\d+),a=(\d+),s=(\d+)}/,
}

export const solvePart1 = (input: string) => {
  const [rulesRaw, machinesRaw] = input.split('\n\n').map(s => s.trim())
  const rules = {} as Record<string, Rule[]>

  parseInputLines(rulesRaw).forEach(ruleRawStr => {
    const [_, name, rulesStr] = ruleRawStr.match(regex.nameAndRules)!
    const rulesSpl = rulesStr.split(',') // 1 up to length - 2 are conditions, length - 1 is always accepted
    const conditionsRaw = rulesSpl.slice(0, rulesSpl.length - 1)
    const otherwise = rulesSpl[rulesSpl.length - 1]
    const conditions: Rule[] = conditionsRaw.map(cond => {
      const [_, machineType, comparator, value, result] = cond.match(regex.rule)!
      return {
        type: 'condition',
        machineType: machineType as MachineType,
        comparator: comparator as Compataror, 
        value: parseInt(value),
        result,
      }
    })

    conditions.push({
      type: 'otherwise',
      result: otherwise,
    } as {
      type: 'otherwise',
      result: string,
    })

    rules[name] = conditions
  })

  const machines = parseInputLines(machinesRaw).map(machineRawStr => {
    const [_, x, m, a, s] = machineRawStr.match(regex.machine)!.map(x => parseInt(x))
    return { x, m, a, s } as Record<MachineType, number>
  }) as Record<MachineType, number>[]
  

  const acceptedMachines = [] as Record<MachineType, number>[]
  machines.forEach(machine => {
    let result = 'unresolved' as 'unresolved' | 'accepted' | 'rejected'
    let currentRules = rules['in']
    while(result === 'unresolved') {
      const ruleThatPassed = currentRules.find(rule => {
        if (rule.type === 'otherwise') return true

        const hasPassed = match(rule.comparator)
          .with('<', () => machine[rule.machineType] < rule.value)
          .with('>', () => machine[rule.machineType] > rule.value)
          .exhaustive()
        return hasPassed
      })! // There is always a rule that passes
      
      // Resolve to the next rule or break if we have arrived to a "A" or "R"
      match(ruleThatPassed.result)
        .with('A', () => {
          result = 'accepted'
        })
        .with('R', () => {
          result = 'rejected'
        })
        .otherwise(nextRuleName => {
          currentRules = rules[nextRuleName]
        })
    }

    if (result === 'accepted') acceptedMachines.push(machine)
  })

  return acceptedMachines.reduce((acc, machine) => acc + machine.x + machine.m + machine.a + machine.s, 0)
}

// In part 2 I no longer care about the machines
// Rather, I will build a "decision" tree
// and then retrace all paths which leads to "A"
// That will give us all the intervals we need for each machine part
export const solvePart2 = (input: string, min: number = 1, max: number = 4000) => {
  const [rulesRaw] = input.split('\n\n').map(s => s.trim())

  type Rule = {
    type: 'condition',
    machineType: MachineType,
    comparator: Compataror,
    value: number,
    result: string,
  } | {
    type: 'otherwise',
    result: string,
  }

  const allRules = {} as Record<string, Rule[]>

  parseInputLines(rulesRaw).forEach(ruleRawStr => {
    const [_, name, rulesStr] = ruleRawStr.match(regex.nameAndRules)!
    const rulesSpl = rulesStr.split(',') // 1 up to length - 2 are conditions, length - 1 is always accepted
    const conditionsRaw = rulesSpl.slice(0, rulesSpl.length - 1)
    const otherwise = rulesSpl[rulesSpl.length - 1]
    const conditions: Rule[] = conditionsRaw.map(cond => {
      const [_, machineType, comparator, value, result] = cond.match(regex.rule)!
      return {
        type: 'condition',
        machineType: machineType as MachineType,
        comparator: comparator as Compataror, 
        value: parseInt(value),
        result,
      }
    })

    conditions.push({
      type: 'otherwise',
      result: otherwise,
    } as {
      type: 'otherwise',
      result: string,
    })

    allRules[name] = conditions
  })

  // I had this type at first, but it was giving me a "Type instantiation is excessively deep and possibly infinite" error
  // later on, so I just reverted it to any and saved myself a headache
  // type RecArray = string[] | RecArray[]
  const recurse = (rules: Rule[], history: string[]): any => {
    const ret = rules.map((rule, i, allInnerRules) => {
      // We should negate all previous rules, since that's how
      // we came to arrive at the current rule
      // We can assert as only of type condition, since the last rule is always the "otherwise"
      const prevRules = allInnerRules.slice(0, i) as Extract<Rule, { type: 'condition' }>[]
      const invertedPrevRules = prevRules.map(prevRule => {
        return prevRule.machineType + match(prevRule.comparator)
          .with('<', () => '>=' + prevRule.value)
          .with('>', () => '<=' + prevRule.value)
          .exhaustive()
      })

      if (rule.type === 'otherwise' ) {
        if (rule.result === 'A' || rule.result === 'R') {
          return [...history, ...invertedPrevRules, rule.result]
        } else {
          return recurse(allRules[rule.result], [...history, ...invertedPrevRules])
        }
      }

      if (rule.result === 'A' || rule.result === 'R') {
        return [...history, ...invertedPrevRules, rule.machineType + rule.comparator + rule.value, rule.result]
      }
  
      // The last remaining condition
      // if (rule.type === 'condition') {
      return recurse(allRules[rule.result], [...history, ...invertedPrevRules, rule.machineType + rule.comparator + rule.value])
    })

    return ret
  }

  const start = allRules['in']

  // Recursively call each condition, and keep track of the path leading to it
  const decisionTree = recurse(start, [])
  
  // We're going to flatten the tree, and then accumulate the pieces that end in an 'A"
  // This gives us a list of all accepted paths
  const acceptedPaths = (decisionTree.flat(Infinity) as string[]).reduce((acc, path) => {
    if (path === 'A') {
      acc.push([])
    } else if (path === 'R') {
      acc.pop()
      acc.push([])
    } else {
      acc[acc.length - 1].push(path)
    }
    return acc
  }, [[]] as string[][]).slice(0, -1) // Remove the last empty array

  const summaries = acceptedPaths.map(path => {
    const summary = {
      x: {
        gte: min,
        lte: max,
      },
      m: {
        gte: min,
        lte: max,
      },
      a: {
        gte: min,
        lte: max,
      },
      s: {
        gte: min,
        lte: max,
      },
    }

    path.forEach(rule => {
      const [_, machineType, comparator, value] = rule.match(/(\w)([<>]|>=|<=)(\d+)/)! as [string, MachineType, Compataror | '<=' | '>=', string]

      match(comparator)
        .with('<', () => {
          summary[machineType].lte = Math.min(summary[machineType].lte, parseInt(value) - 1)
        })
        .with('>', () => {
          summary[machineType].gte = Math.max(summary[machineType].gte, parseInt(value) + 1)
        })
        .with('>=', () => {
          summary[machineType].gte = Math.max(summary[machineType].gte, parseInt(value))
        })
        .with('<=', () => {
          summary[machineType].lte = Math.min(summary[machineType].lte, parseInt(value))
        })
    })

    return summary
  }) as Summary[]

  // Now, we want the amount per interval for every rule,
  // so we can minus by the minumum
  // and then sum the rest

  // Nice log to see the summary for each path
  // console.log(summaries.map(summary => Object.entries(summary).map(([machineType, { gte, lte }]) => `${machineType}: ${gte}-${lte}`).join(', ')))

  return summaries.reduce((acc, summary) => acc + calculateAmountCombinations(summary), 0)
}

export const hasOverlap = (a: Interval, b: Interval): boolean => {
  return a.gte <= b.lte && b.gte <= a.lte
}

export const overlapInInterval = (a: Interval, b: Interval): Interval => {
  if (a.gte > b.lte || b.gte > a.lte) return { gte: 0, lte: 0 }

  return {
    gte: Math.max(a.gte, b.gte),
    lte: Math.min(a.lte, b.lte),
  }
}

export const minusIntervalFromList = (a: Interval, b: Interval[]): Interval[] => {
  return b.reduce((acc, interval) => {
    return acc.flatMap(x => minusInterval(x, interval))
  }, [a])
}

// Given interval a and b, the interval cuts into a and returns the new interval(s)
export const minusInterval = (a: Interval, b: Interval): Interval[] => {
  // No overlap at aall
  if (hasOverlap(a, b) === false) return [a]

  const ret = [] as Interval[]
  
  // Equal
  if (a.gte === b.gte && a.lte === b.lte) return [{
    gte: 0,
    lte: 0,
  }]

  // a is encapsulated by b
  if (a.gte >= b.gte && a.lte <= b.lte) return [{
    gte: 0,
    lte: 0,
  }]

  if (a.gte < b.gte) {
    ret.push({
      gte: a.gte,
      lte: b.gte - 1,
    })
  }

  if (a.lte > b.lte) {
    ret.push({
      gte: b.lte + 1,
      lte: a.lte,
    })
  }
  
  return ret
}

const calculateAmountCombinations = (input: Summary) => {
  return (input.x.lte - input.x.gte + 1) * (input.m.lte - input.m.gte + 1) * (input.a.lte - input.a.gte + 1) * (input.s.lte - input.s.gte + 1)
}
