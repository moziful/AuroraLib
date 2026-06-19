export const addBook = async (bookData) => {
    // Retrieve your token (adjust based on how you store it, e.g., localStorage)
    const token = localStorage.getItem('token');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Add this line
        },
        body: JSON.stringify(bookData),
    });

    if (!res.ok) {
        // ... rest of your error handling
    }
    return res.json();
};