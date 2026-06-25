"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function updateUserDetails(userId, { name, email }) {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email }),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || "Failed to update user details");
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to update user details via API:", error);
        throw new Error("Failed to update user details");
    }
}

export async function handleSuccessfulPurchase(bookId, userEmail) {
    try {
        const response = await fetch(`${API_URL}/purchases`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bookId, userEmail }),
        });

        if (!response.ok) {
            return { success: false };
        }

        return await response.json();
    } catch (error) {
        console.error("Purchase registration failed via API:", error);
        return { success: false };
    }
}

export async function getPurchasedBooks(email) {
    try {
        const response = await fetch(`${API_URL}/purchases/${encodeURIComponent(email)}`, {
            next: { revalidate: 0 },
        });

        if (!response.ok) {
            return [];
        }

        const books = await response.json();
        return books.map(b => ({ ...b, _id: b._id.toString() }));
    } catch (error) {
        console.error("Failed to get purchased books via API:", error);
        return [];
    }
}

export async function getBookmarkedBooks(email) {
    try {
        const response = await fetch(`${API_URL}/bookmarks/${encodeURIComponent(email)}`, {
            next: { revalidate: 0 },
        });

        if (!response.ok) {
            return [];
        }

        const books = await response.json();
        return books.map(b => ({ ...b, _id: b._id.toString() }));
    } catch (error) {
        console.error("Failed to get bookmarked books via API:", error);
        return [];
    }
}

export async function getTransactionHistory(email) {
    try {
        const response = await fetch(`${API_URL}/transactions/${encodeURIComponent(email)}`, {
            next: { revalidate: 0 },
        });

        if (!response.ok) {
            return [];
        }

        const transactions = await response.json();
        return transactions.map(t => ({
            ...t,
            _id: t._id.toString(),
            bookId: t.bookId.toString(),
            name: t.bookName,
            id: t._id.toString()
        }));
    } catch (error) {
        console.error("Failed to get transaction history via API:", error);
        return [];
    }
}


