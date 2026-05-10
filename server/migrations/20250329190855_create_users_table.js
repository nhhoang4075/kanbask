/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("users", function (table) {
    table.uuid("id").primary();
    table.string("username", 100).notNullable().unique();
    table.string("email", 100).notNullable().unique();
    table.string("password_hash", 255).notNullable();
    table.string("first_name", 100);
    table.string("last_name", 100);
    table.string("avatar_url", 255);
    table.string("role", 30).checkIn(["user", "admin"]).defaultTo("user");
    table.timestamp("last_login");
    table.boolean("is_active").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists("users");
}
