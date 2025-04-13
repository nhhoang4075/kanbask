/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex("users").del();
  await knex("users").insert([
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
