"use server";

export async function validateUser(username, password) {
    // Use absolute URL for server-side requests
    const res = await fetch(`http://localhost:3000/api/login`, {
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
    const newUser = await res.json();
    return newUser;
}
export async function getUsers() {
    // Fetch users from the api
    const res = await fetch("http://localhost:3000/api/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    // Handle error response
    if (!res.ok) {
        console.error("Error fetching users:", res.statusText);
        return null; 
    }
    // Return Users
    const users = await res.json();
    return users;
}
export async function registerUser(fullname, username, email, password) {
    const res = await fetch(`http://localhost:3000/api/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullname, username, email, password }),
    });
    if (res.status === 409) {
        console.error('Username already exists:', res.statusText);
        return "Username already exists"; // Handle conflict response
    }
    if (!res.ok) {
        console.error('Error registering user:', res.statusText);
        return null; // Handle error response
    }
    const user = await res.json();
    return user;
}