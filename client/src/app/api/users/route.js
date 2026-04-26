"use server";

import fsPromises from 'fs/promises';
import path from 'path';

const usersFilePath = path.join(process.cwd(),'src', 'data', 'users.json');

export async function GET() {
    try {
        const data = await fsPromises.readFile(usersFilePath, 'utf-8');
        const users = JSON.parse(data);
        return Response.json(users, { status: 200 });
    } catch (error) {
        return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}