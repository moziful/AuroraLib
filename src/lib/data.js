export const getAllBooks = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams(
            Object.entries(params).filter(([_, v]) => v != null && v !== "")
        ).toString();
        const url = `${process.env.NEXT_PUBLIC_API_URL}/books${queryParams ? `?${queryParams}` : ''}`;
        const res = await fetch(url);

        if (!res.ok) {
            console.error(`API error: ${res.status} ${res.statusText}`);
            return [];
        }

        const books = await res.json();
        return books;
    } catch (error) {
        console.error("Failed to fetch books:", error);
        return [];
    }
};

export const getBooksByEmail = async (email) => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/books/email/${encodeURIComponent(email)}`
        );

        if (!res.ok) {
            console.error(`API error: ${res.status} ${res.statusText}`);
            return [];
        }

        return await res.json();
    } catch (error) {
        console.error("Failed to fetch books by email:", error);
        return [];
    }
};

export const getBookById = async (id) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`);

        if (!res.ok) {
            console.error(`API error: ${res.status} ${res.statusText}`);
            return null;
        }

        return await res.json();
    } catch (error) {
        console.error("Failed to fetch book by ID:", error);
        return null;
    }
};

export const getAllTransactions = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`);
        if (!res.ok) {
            console.error(`API error: ${res.status} ${res.statusText}`);
            return [];
        }
        const transactions = await res.json();
        return transactions.map((tx) => ({
            _id: tx._id?.toString(),
            type: tx.type || "purchase",
            email: tx.userEmail || tx.email,
            amount: tx.price || tx.amount,
            date: tx.date,
        }));
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        return [];
    }
};

export const getWriterSales = async (email) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/writer/${encodeURIComponent(email)}`);
        if (!res.ok) {
            console.error(`API error: ${res.status} ${res.statusText}`);
            return [];
        }
        const sales = await res.json();
        return sales.map((s) => ({
            id: s._id?.toString(),
            title: s.bookName,
            buyer: s.userEmail || s.email,
            date: s.date,
            amount: s.price || s.amount,
        }));
    } catch (error) {
        console.error("Failed to fetch writer sales:", error);
        return [];
    }
};
