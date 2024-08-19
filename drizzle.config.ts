// import { config } from 'dotenv'
import { Config, defineConfig } from 'drizzle-kit'

// config({ path: '.env.local' })

export default defineConfig({
  schema: './src/drizzle/schema.ts',
  out: './src/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
}) satisfies Config
