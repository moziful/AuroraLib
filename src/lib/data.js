export const getAllBooks = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`);
    const books = await res.json();
    return books;
};