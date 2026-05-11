/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("conversation_participants", (table) => {
    table
      .integer("conversation_id")
      .references("id")
      .inTable("conversations")
      .notNullable()
      .onDelete("CASCADE");
    table.uuid("user_id").references("id").inTable("users").notNullable().onDelete("CASCADE");
    table.primary(["conversation_id", "user_id"]);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists("conversation_participants");
}
