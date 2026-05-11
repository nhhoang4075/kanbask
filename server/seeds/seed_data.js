/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await deleteData(knex);

  await seedUsers(knex);
  await seedTeams(knex);
  await seedProjects(knex);
  await seedConversations(knex);
  await seedConversationParticipants(knex);
}

async function deleteData(knex) {
  await knex("conversation_participants").del();
  await knex("conversations").del();
  await knex("teams").del();
  await knex("projects").del();
  await knex("users").del();
}

async function seedUsers(knex) {
  await knex("users").del();
  await knex("users").insert([
    {
      id: "fa6f94cf-9dba-4d19-8455-0208d0c8c6f0",
      username: "nhhoang.4075",
      email: "nhh4075@gmail.com",
      password_hash: "123456",
      first_name: "Hoang",
      last_name: "Nguyen",
      avatar_url: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
      role: "admin",
      last_login: null,
      is_active: true
    },
    {
      id: "8b513cad-3214-41ca-9669-8d90c1066270",
      username: "johndoe",
      email: "johndoe@example.com",
      password_hash: "abcdef",
      first_name: "John",
      last_name: "Doe",
      avatar_url: "https://www.gravatar.com/avatar/00000000000000000000000000000000",
      role: "user",
      last_login: null,
      is_active: true
    },
    {
      id: "d3c4f5e6-7b8a-4c9b-8d7e-9f0e1a2b3c4d",
      username: "janedoe",
      email: "janedoe@example.com",
      password_hash: "ghijkl",
      first_name: "Jane",
      last_name: "Doe",
      avatar_url: "https://www.gravatar.com/avatar/11111111111111111111111111111111",
      role: "user",
      last_login: null,
      is_active: false
    },
    {
      id: "e4f5d6c7-8b9a-4c0d-8e7f-9a0b1c2d3e4f",
      username: "adminuser",
      email: "admin@example.com",
      password_hash: "admin123",
      first_name: "Admin",
      last_name: "User",
      avatar_url: "https://www.gravatar.com/avatar/22222222222222222222222222222222",
      role: "admin",
      last_login: null,
      is_active: true
    }
  ]);
}

async function seedTeams(knex) {
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

async function seedProjects(knex) {
  await knex("projects").del();
  await knex("projects").insert([
    {
      id: 1,
      team_id: 1,
      name: "Project Alpha",
      description: "Description for Project Alpha",
      created_by: "fa6f94cf-9dba-4d19-8455-0208d0c8c6f0"
    },
    {
      id: 2,
      team_id: 2,
      name: "Project Beta",
      description: "Description for Project Beta",
      created_by: "fa6f94cf-9dba-4d19-8455-0208d0c8c6f0"
    },
    {
      id: 3,
      team_id: 1,
      name: "Project Gamma",
      description: "Description for Project Gamma",
      created_by: "8b513cad-3214-41ca-9669-8d90c1066270"
    }
  ]);
}

async function seedConversations(knex) {
  await knex("conversations").del();
  await knex("conversations").insert([
    { id: 1, type: "direct" },
    { id: 2, type: "team", team_id: 2 },
    { id: 3, type: "direct" },
    { id: 4, type: "direct" },
    { id: 5, type: "project", project_id: 1 }
  ]);
}

async function seedConversationParticipants(knex) {
  await knex("conversation_participants").del();
  await knex("conversation_participants").insert([
    { conversation_id: 1, user_id: "fa6f94cf-9dba-4d19-8455-0208d0c8c6f0" },
    { conversation_id: 1, user_id: "8b513cad-3214-41ca-9669-8d90c1066270" },
    { conversation_id: 2, user_id: "fa6f94cf-9dba-4d19-8455-0208d0c8c6f0" },
    { conversation_id: 2, user_id: "8b513cad-3214-41ca-9669-8d90c1066270" },
    { conversation_id: 2, user_id: "d3c4f5e6-7b8a-4c9b-8d7e-9f0e1a2b3c4d" },
    { conversation_id: 3, user_id: "fa6f94cf-9dba-4d19-8455-0208d0c8c6f0" },
    { conversation_id: 3, user_id: "d3c4f5e6-7b8a-4c9b-8d7e-9f0e1a2b3c4d" },
    { conversation_id: 4, user_id: "fa6f94cf-9dba-4d19-8455-0208d0c8c6f0" },
    { conversation_id: 4, user_id: "8b513cad-3214-41ca-9669-8d90c1066270" }
  ]);
}
