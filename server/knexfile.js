import "dotenv/config";

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: "pg",
    connection: process.env.DEV_DATABASE_URL,
    migrations: {
      directory: "./migrations",
      loadExtensions: [".js"]
    },
    seeds: {
      directory: "./seeds",
      loadExtensions: [".js"]
    }
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./migrations",
      loadExtensions: [".js"]
    },
    seeds: {
      directory: "./seeds",
      loadExtensions: [".js"]
    }
  }
};
