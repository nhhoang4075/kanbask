import "dotenv/config";
import knex from "knex";
import { neon } from "@neondatabase/serverless";

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DEV_DATABASE_URL
  }
});

const sql = neon(process.env.DEV_DATABASE_URL);

export { db, sql };
