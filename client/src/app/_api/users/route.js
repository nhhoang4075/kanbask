"use server";

import fsPromises from "fs/promises";
import path from "path";

const usersFilePath = path.join(process.cwd(), "src", "data", "users.json");

export async function GET() {
  try {
    const data = await fsPromises.readFile(usersFilePath, "utf-8");
    const users = JSON.parse(data);
    return Response.json(users, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
export async function POST(request) {
  try {
    const userGet = await request.json();
    const data = await fsPromises.readFile(usersFilePath, "utf-8");
    const users = JSON.parse(data);
    // Check if the username already exists
    const userExists = users.some((user) => user.username === userGet.username);
    if (userExists) {
      return Response.json({ error: "Username already exists" }, { status: 409 });
    }
    const newNumberId = users.length + 1;
    const newId = "user" + newNumberId.toString();
    const newUser = { ...userGet, id: newId, role: "user", avatar_url: null };
    users.push(newUser);
    await fsPromises.writeFile(usersFilePath, JSON.stringify(users, null, 2));
    return Response.json(newUser, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to create user" }, { status: 500 });
  }
}
