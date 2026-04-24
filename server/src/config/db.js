import "dotenv/config";
import { neon } from "@neondatabase/serverless";

let sql;
const connectDb = () => {
  sql = neon(process.env.DATABASE_URL);
};

export { connectDb, sql };
