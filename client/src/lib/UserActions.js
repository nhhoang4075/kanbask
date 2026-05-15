"use server";

export async function validateUser(email, password) {
    // Use absolute URL for server-side requests
    const res = await fetch(`http://localhost:3000/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({gmail, password }),
    });
    if (!res.ok) {
        console.error('Error validating user:', res.statusText);
        return null; // Handle error response
    }
    const newUser = await res.json();
    return newUser;
}
export async function getUsers() {
    const res = await fetch("http://localhost:3000/api/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) {
        console.error("Error fetching users:", res.statusText);
        return null; 
    }
    const users = await res.json();
    return users;
}
export async function registerUser(firstname, lastname, email, password) {
    const res = await fetch(`http://localhost:3000/api/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstname, lastname, email, password }),
    });
    if (res.status === 409) {
        console.error('Email already exists:', res.statusText);
        return "Email already exists";
    }
    if (!res.ok) {
        console.error('Error registering user:', res.statusText);
        return null; 
    }
    const user = await res.json();
    return user;
}