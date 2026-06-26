"use server";

import { revalidatePath } from "next/cache";

export const addBook = async (bookData, token) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) throw new Error("API URL is not configured.");

    const res = await fetch(`${apiUrl}/books`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(bookData),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
};

export const updateBook = async (id, bookData, token) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) throw new Error("API URL is not configured.");

    const res = await fetch(`${apiUrl}/books/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(bookData),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Request failed with status ${res.status}`);
    return data;
};

export const updateBookStatus = async (id, status, token) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) throw new Error("API URL is not configured.");

    const res = await fetch(`${apiUrl}/books/${id}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Request failed with status ${res.status}`);
    return data;
};

export const deleteBookAction = async (id, token) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) throw new Error("API URL is not configured.");

    const res = await fetch(`${apiUrl}/books/${id}`, {
        method: "DELETE",
        headers: {
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Request failed with status ${res.status}`);
    return data;
};

export async function revalidateBooks() {
    revalidatePath("/books");
    revalidatePath("/dashboard/writer/view-book");
}

export async function updateUserDetails(userId, { name, email, image }) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) throw new Error("API URL is not configured.");

    const res = await fetch(`${apiUrl}/users/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, image }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Request failed with status ${res.status}`);
    return data;
}
