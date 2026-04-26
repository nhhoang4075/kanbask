"use server";

import fsPromises from 'fs/promises';
import path from 'path';

const usersFilePath = path.join(process.cwd(),'src', 'data', 'users.json');

export async function POST(req) {
    try {
        const loginUser = await req.json();
        const data = await fsPromises.readFile(usersFilePath, 'utf-8');
        const users = JSON.parse(data);
        const user = users.find(user => user.username === loginUser.username && user.password === loginUser.password);
        if (user) {
            return Response.json(user, { status: 200 });
        } else {
            return Response.json({ error: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error) {
        console.error('Error validating user', error);
        return Response.json({ error: 'Failed to validate' }, { status: 500 });
    }
}