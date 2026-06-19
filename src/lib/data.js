export const getAllBooks = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`);

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