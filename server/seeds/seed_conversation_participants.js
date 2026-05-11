/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex("conversation_participants").del();
  await knex("conversation_participants").insert([
    { conversation_id: 1, user_id: 1 },
    { conversation_id: 1, user_id: 2 },
    { conversation_id: 2, user_id: 1 },
    { conversation_id: 2, user_id: 2 },
    { conversation_id: 2, user_id: 3 },
    { conversation_id: 3, user_id: 1 },
    { conversation_id: 3, user_id: 3 },
    { conversation_id: 4, user_id: 2 },
    { conversation_id: 4, user_id: 3 },
    { conversation_id: 5, user_id: 1 },
    { conversation_id: 5, user_id: 2 }
  ]);
}
