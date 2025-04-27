"use server";

import fsPromises from 'fs/promises';
import path from 'path';

const usersFilePath = path.join(process.cwd(),'src', 'data', 'messages.json');

export async function GET() {
    try {
        const data = await fsPromises.readFile(usersFilePath, 'utf-8');
        const messages = JSON.parse(data);
        return Response.json(messages, { status: 200 });
    } catch (error) {
        return Response.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}
export async function POST(request) {
    try {
        const message = await request.json();
        const data = await fsPromises.readFile(usersFilePath, 'utf-8');
        const messages = JSON.parse(data);
        messages.push(message);
        await fsPromises.writeFile(usersFilePath, JSON.stringify(messages, null, 2));
        return Response.json({text: "Success", status: 201 });
    } catch (error) {
        return Response.json({ error: 'Failed to send message' }, { status: 500 });
    }
}