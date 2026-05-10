/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex("conversations").del();
  await knex("conversations").insert([
    { id: 1, type: "direct" },
    { id: 2, type: "team", team_id: 2 },
    { id: 3, type: "direct" },
    { id: 4, type: "direct" },
    { id: 5, type: "project", project_id: 1 }
  ]);
}
