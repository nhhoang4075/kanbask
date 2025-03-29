"use server";

export async function validateUser(username, password) {
    // Use absolute URL for server-side requests
    const res = await fetch(`http://localhost:3000/api/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
        console.error('Error validating user:', res.statusText);
        return null; // Handle error response
    }
    const user = await res.json();
    return user;
}