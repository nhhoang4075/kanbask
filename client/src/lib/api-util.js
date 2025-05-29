export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function handleResponse(res) {
  try {
    const data = await res.json();

    if (!data.success) {
      throw new ApiError(res.status, data.message);
    }

    return data.data ?? data.message;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(res.status, error.message);
  }
}
