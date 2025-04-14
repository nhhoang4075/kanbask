/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("conversations", function (table) {
    table.increments("id").primary();
    table.string("type", 30).notNullable().checkIn(["direct", "team", "project"]);
    table.integer("team_id", 100).references("id").inTable("teams").onDelete("CASCADE");
    table.integer("project_id").references("id").inTable("projects").onDelete("CASCADE");
    table.timestamp("last_message_at");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists("projects");
}
