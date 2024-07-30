import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

config({ path: '.env.local' })

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw Error(`DATABASE_URL was not defined: ${databaseUrl}`)
}

const dbConnection = drizzle(postgres(`${databaseUrl}`, { ssl: 'require', max: 1 }))

const main = async () => {
  try {
    await migrate(dbConnection, { migrationsFolder: './src/drizzle/migrations' })
    console.log('Schema migration complete')
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
  process.exit(0)
}

main()
