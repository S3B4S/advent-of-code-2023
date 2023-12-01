/**
 * Parses "blocks" of lines, where each block has a double newline between
 * 
 * For example:
 * 541532
 * 453215123
 * 
 * 315321
 * 5321523
 * 53215113
 * 
 * 351252
 * 3211235
 * 
 * 5312523
 * 
 * Returns:
 * [
 *   ['541532', '453215123'],
 *   ['315321', '5321523', '53215113'],
 *   ['351252', '3211235'],
 *   ['5312523'],
 * ]
 */
export const parseInputBlocks = (input: string) => {
  return input
    .split('\n\n')
    .map(block => block.split('\n')
    .filter(substr => substr !== ""))
}
