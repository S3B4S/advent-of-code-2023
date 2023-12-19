import { parseInputLines } from "@/utils/parsing"
import { exec } from "child_process"
import { type } from "os"
import { match } from "ts-pattern"

type MachineType = 'x' | 'm' | 'a' | 's'
type Compataror = '<' | '>'
type TypeRule = 'condition' | 'otherwise'

const regex = {
  nameAndRules: /(\w+){([\d\w:,<>]+)}/,
  rule: /(\w)([<>])(\d+):(\w+)/,
  machine: /{x=(\d+),m=(\d+),a=(\d+),s=(\d+)}/,
}
export const solvePart1 = (input: string) => {
  const [rulesRaw, machinesRaw] = input.split('\n\n').map(s => s.trim())

  const rules = {} as Record<string, ({
      type: 'condition',
      machineType: MachineType,
      comparator: Compataror,
      value: number,
      result: string,
    } | {
      type: 'otherwise',
      result: string,
    })[]
  >

  parseInputLines(rulesRaw).forEach(ruleRawStr => {
    const [_, name, rulesStr] = ruleRawStr.match(regex.nameAndRules)!
    const rulesSpl = rulesStr.split(',') // 1 up to length - 2 are conditions, length - 1 is always accepted
    const conditionsRaw = rulesSpl.slice(0, rulesSpl.length - 1)
    const otherwise = rulesSpl[rulesSpl.length - 1]
    const conditions = conditionsRaw.map(cond => {
      const [_, machineType, comparator, value, result] = cond.match(regex.rule)!
      return {
        type: 'condition',
        machineType: machineType as MachineType,
        comparator: comparator as Compataror, 
        value: parseInt(value),
        result,
      }
    })

    // Idk why TS is complaining but fix later
    conditions.push({
      type: 'otherwise',
      result: otherwise,
    } as {
      type: 'otherwise',
      result: string,
    })

    rules[name] = conditions
    
  })

  // console.log(rules)

  const machines = parseInputLines(machinesRaw).map(machineRawStr => {
    const [_, x, m, a, s] = machineRawStr.match(regex.machine)!.map(x => parseInt(x))
    return { x, m, a, s } as Record<MachineType, number>
  }) as Record<MachineType, number>[]
  
  // console.log(machines)

  const acceptedMachines = [] as Record<MachineType, number>[]
  machines.forEach(machine => {
    // console.log(machine)
    let result = 'unresolved' as 'unresolved' | 'accepted' | 'rejected'
    let currentRules = rules['in']
    while(result === 'unresolved') {
      const ruleThatPassed = currentRules.find(rule => {
        if (rule.type === 'otherwise') return true
        // console.log('test')
        // console.log(rule)
        // console.log(machine[rule.machineType] + rule.comparator + rule.value)

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

export const solvePart2 = (input: string) => {
  return 0
}
// 