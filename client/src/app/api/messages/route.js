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
export async function PUT(request) {
    try {
        const {messagesNeedChangeId, changes} = await request.json();
        const data = await fsPromises.readFile(usersFilePath, 'utf-8');
        const messages = JSON.parse(data);
        const messagesIndex = messagesNeedChangeId.map(id => messages.findIndex(message => message.id === id));
        if (messagesIndex.length === 0) return Response.json({text: "No messages to update", status: 400 });
        for (let i = 0; i < messagesIndex.length; i++) {
            const index = messagesIndex[i];
            if (index !== -1) {
                messages[index] = { ...messages[index], ...changes };
            } else {
                return Response.json({text: "Message not found", status: 404 });
            }
        }
        await fsPromises.writeFile(usersFilePath, JSON.stringify(messages, null, 2));
        return Response.json({text: "Success", status: 201 });
    } catch (error) {
        return Response.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
export async function DELETE(request) {
    try {
        const { deleteMessageIds } = await request.json();
        const data = await fsPromises.readFile(usersFilePath, 'utf-8');
        const messages = JSON.parse(data);
        if (deleteMessageIds.length === 0) return Response.json({text: "No messages to delete", status: 400 });
        const newMessages = messages.filter(message => !deleteMessageIds.includes(message.id));
        if (newMessages.length === messages.length) return Response.json({text: "No messages deleted", status: 400 });
        await fsPromises.writeFile(usersFilePath, JSON.stringify(newMessages, null, 2));
        return Response.json({text: "Success", status: 201 });
    } catch (error) {
        return Response.json({ error: 'Failed to send message' }, { status: 500 });
    }
}