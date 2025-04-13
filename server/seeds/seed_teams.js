/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex("teams").del();
  await knex("teams").insert([
    {
      id: 1,
      name: "Development Team",
      code: "DEV123",
      description: "Handles all development tasks"
    },
    {
      id: 2,
      name: "Marketing Team",
      code: "MKT456",
      description: "Focuses on marketing and outreach"
    },
    {
      id: 3,
      name: "Support Team",
      code: "SUP789",
      description: "Provides customer support"
    }
  ]);
}
