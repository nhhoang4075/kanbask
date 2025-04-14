/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("projects", function (table) {
    table.increments("id").primary();
    table.integer("team_id").notNullable().references("id").inTable("teams").onDelete("CASCADE");
    table.string("name", 100).notNullable();
    table.text("description");
    table.uuid("created_by").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists("projects");
}
