import { z } from 'zod'

export const UsernameRequestBodySchema = z.object({ username: z.string() })
