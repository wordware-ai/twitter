import { Pool } from '@neondatabase/serverless'
// import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-serverless'

// import { drizzle } from 'drizzle-orm/neon-http'

import * as schema from './schema'

// config({ path: '.env' })

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
// const sql = neon(process.env.DATABASE_URL!)

export const db = drizzle(pool, { schema })
