/**
 * Model configuration for the Vercel AI Gateway.
 *
 * The model is a plain Gateway model string (`creator/model`), so it can be
 * swapped by setting the AI_MODEL env var — no code changes or provider
 * packages needed. Auth: AI_GATEWAY_API_KEY locally, OIDC automatically on
 * Vercel deployments.
 *
 * Catalog: https://vercel.com/ai-gateway/models
 */
export const AI_MODEL = process.env.AI_MODEL ?? 'xai/grok-4.20-non-reasoning'
