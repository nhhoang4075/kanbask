"use server";

import { signIn } from "@/auth";

const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function validateUser(email, password) {
    try {
        // Use absolute URL for server-side requests
        const res = await fetch(`${url}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const {success, data, message} = await res.json();
        if (!success) {
            console.error(message);
            return null; // Handle error response
        }
        return data.user;
    } catch (error) {
        return null;
    }
}

export async function registerUser(email, password, first_name, last_name) {
    try {
        const res = await fetch(`${url}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, first_name, last_name}),
        });
        const {success, data} = await res.json();
        if (!success) {
            console.error('Error registering user:', data);
            return null; // Handle error response
        }
        return data.user;
    } catch (error) {
        console.error('Error registering user:', error);
        return null;
    }
}

export async function LoginAction(credentials) {
  try {
    const result = await signIn("credentials", {
      ...credentials,
      redirect: false,
      redirectTo: "/dashboard",
    });
    return result;
  } catch (error) {
    console.error('Error logging in:', error);
    return null;
  }
}