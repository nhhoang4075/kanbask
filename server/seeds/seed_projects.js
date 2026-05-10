/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex("projects").del();
  await knex("projects").insert([
    {
      id: 1,
      team_id: 1,
      name: "Project Alpha",
      description: "Description for Project Alpha",
      created_by: 1
    },
    {
      id: 2,
      team_id: 2,
      name: "Project Beta",
      description: "Description for Project Beta",
      created_by: 2
    },
    {
      id: 3,
      team_id: 1,
      name: "Project Gamma",
      description: "Description for Project Gamma",
      created_by: 1
    }
  ]);
}
