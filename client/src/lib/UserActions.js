"use server";

const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function getOneUserById(userId) {
  try {
    const res = await fetch(`${url}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const { success, data } = await res.json();
    if (!success) {
      console.error("Error getting user:", data);
      return null; // Handle error response
    }
    // Return the user
    return data.user;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}
