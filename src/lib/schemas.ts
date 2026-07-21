import { z } from 'zod'

/**
 * Output schemas for the analysis generations.
 *
 * These mirror the original Wordware released-app output schemas key-for-key
 * (and the `TwitterAnalysis` / `CompatibilityAnalysis` types in src/types.ts),
 * so freshly generated objects are structurally identical to the analyses
 * cached in the users/pairs JSONB columns since 2024.
 *
 * Key order matters: fields stream to the UI in declaration order.
 */

// Part 1 — the free "roast" run
export const roastSchema = z.object({
  name: z.string().describe("The person's name"),
  about: z
    .string()
    .describe(
      'One-line description of this person including age, sex, job and other interesting info. Starts with "Based on our AI agent\'s analysis of your tweets...." (in the language the user tweets in)',
    ),
  emojis: z.string().describe('5-8 emojis that describe the person'),
  roast: z.string().describe('A brutal roast of at least 6 punchy sentences'),
})

// Part 2 — the full analysis run
export const fullSchema = z.object({
  strengths: z
    .array(
      z.object({
        title: z.string(),
        subtitle: z.string(),
      }),
    )
    .min(5)
    .describe('A list of 5 or more strengths'),
  weaknesses: z
    .array(
      z.object({
        title: z.string(),
        subtitle: z.string(),
      }),
    )
    .min(5)
    .describe('A list of 5 or more weaknesses'),
  loveLife: z.string(),
  money: z.string(),
  health: z.string(),
  biggestGoal: z.string(),
  colleaguePerspective: z.string(),
  pickupLines: z.array(z.string()).min(3).describe('A list of 3 or more pickup lines'),
  famousPersonComparison: z.string(),
  previousLife: z.string(),
  animal: z.string(),
  fiftyDollarThing: z.string(),
  career: z.string(),
  lifeSuggestion: z.string(),
})

// Pair compatibility run
export const compatibilitySchema = z.object({
  mbti: z.object({
    profile1: z.string(),
    profile2: z.string(),
  }),
  about: z.string(),
  crazy: z.string(),
  drama: z.string(),
  emojis: z.string(),
  divorce: z.string(),
  marriage: z.string(),
  '3rd_wheel': z.string(),
  free_time: z.string(),
  red_flags: z.object({
    profile1: z.array(z.string()),
    profile2: z.array(z.string()),
  }),
  dealbreaker: z.string(),
  green_flags: z.object({
    profile1: z.array(z.string()),
    profile2: z.array(z.string()),
  }),
  follower_flex: z.string(),
  risk_appetite: z.string(),
  love_languages: z.string(),
  secret_desires: z.string(),
  friends_forever: z.string(),
  jealousy_levels: z.string(),
  attachment_style: z.string(),
  values_alignment: z.string(),
  breakup_percentage: z.string(),
  overall_compatibility: z.string(),
  personality_type_match: z.string(),
  emotional_compatibility: z.string(),
  financial_compatibility: z.string(),
  communication_style_compatibility: z.string(),
})
