export const addBook = async (bookData) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `API error: ${res.status}`);
    }
    return res.json();
};