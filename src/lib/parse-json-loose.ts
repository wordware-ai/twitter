/**
 * Parse model output that should be JSON but may be wrapped in markdown fences
 * or preceded by stray text. The generation runs in plain text mode (structured
 * output mode audibly flattens the models' voice), so parsing is lenient.
 */
export function parseJsonLoose(text: string): Record<string, unknown> {
  const stripped = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/, '')
    .trim()
  const start = stripped.indexOf('{')
  const end = stripped.lastIndexOf('}')
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`No JSON object found in model output: ${stripped.slice(0, 120)}`)
  }
  return JSON.parse(stripped.slice(start, end + 1))
}
