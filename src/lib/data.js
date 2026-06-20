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

export const getBooksByEmail = async (email) => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/books/${encodeURIComponent(email)}`
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


export const booksdata = [
    {
        "slug": "whispers-of-the-tide",
        "title": "Whispers of the Tide",
        "description": "A captivating story of a coastal town and the secrets hidden beneath the waves.",
        "price": 19.99,
        "genre": "Fiction",
        "coverImage": "https://images.unsplash.com/photo-1512820790803-83ca734da794",
        "writerName": "Sophia Carter",
        "writerEmail": "sophia@auroralib.com",
        "status": "Available",
        "isFeatured": true,
        "bookmarks": [],
        "createdAt": "2026-04-01T09:15:00.000Z"
    },
    {
        "slug": "code-beyond-limits",
        "title": "Code Beyond Limits bbbbbbg hkvhbk hhkg vgjhvb gvhbhjv",
        "description": "Practical insights into modern software engineering and scalable systems. In an era where software defines to modern software engineering and scalable systems. In an era where software defines to modern software engineering and scalable systems. In an era where software defines to modern software engineering and scalable systems. In an era where software defines the heartbeat of global industries, the gap between making it work and building it to last has neveble, real - world strategies.",
        "price": 29.99,
        "genre": "Technology",
        "coverImage": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
        "writerName": "Daniel Brooks",
        "writerEmail": "daniel@auroralib.com",
        "status": "Unavailable",
        "isFeatured": false,
        "bookmarks": [],
        "createdAt": "2026-04-05T12:00:00.000Z"
    },
    {
        "slug": "the-silent-galaxy",
        "title": "The Silent Galaxy",
        "description": "An epic science fiction adventure through unexplored regions of space.",
        "price": 22.5,
        "genre": "Sci-Fi",
        "coverImage": "https://images.unsplash.com/photo-1462331940025-496dfbfc7564",
        "writerName": "Ava Reynolds",
        "writerEmail": "ava@auroralib.com",
        "status": "Coming Soon",
        "isFeatured": true,
        "bookmarks": [],
        "createdAt": "2026-04-08T14:20:00.000Z"
    },
    {
        "slug": "mastering-mindfulness",
        "title": "Mastering Mindfulness",
        "description": "A practical guide to focus, calmness, and personal growth.",
        "price": 17.99,
        "genre": "Self-Help",
        "coverImage": "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
        "writerName": "Liam Foster",
        "writerEmail": "liam@auroralib.com",
        "status": "Available",
        "isFeatured": false,
        "bookmarks": [],
        "createdAt": "2026-04-10T08:30:00.000Z"
    },
    {
        "slug": "the-forgotten-kingdom",
        "title": "The Forgotten Kingdom",
        "description": "A fantasy tale of lost civilizations, magic, and destiny.",
        "price": 26.99,
        "genre": "Fantasy",
        "coverImage": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
        "writerName": "Mia Thornton",
        "writerEmail": "mia@auroralib.com",
        "status": "Available",
        "isFeatured": true,
        "bookmarks": [],
        "createdAt": "2026-04-12T11:45:00.000Z"
    },
    {
        "slug": "business-in-the-digital-age",
        "title": "Business in the Digital Age",
        "description": "Strategies for entrepreneurs navigating modern markets.",
        "price": 21.5,
        "genre": "Business",
        "coverImage": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
        "writerName": "Ethan Walker",
        "writerEmail": "ethan@auroralib.com",
        "status": "Available",
        "isFeatured": false,
        "bookmarks": [],
        "createdAt": "2026-04-15T13:00:00.000Z"
    },
    {
        "slug": "echoes-of-yesterday",
        "title": "Echoes of Yesterday",
        "description": "A moving historical novel spanning three generations.",
        "price": 18.75,
        "genre": "Historical Fiction",
        "coverImage": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
        "writerName": "Olivia Hayes",
        "writerEmail": "olivia@auroralib.com",
        "status": "Available",
        "isFeatured": true,
        "bookmarks": [],
        "createdAt": "2026-04-18T10:10:00.000Z"
    },
    {
        "slug": "artificial-horizons",
        "title": "Artificial Horizons",
        "description": "Understanding AI, machine learning, and the future of technology.",
        "price": 31.99,
        "genre": "Technology",
        "coverImage": "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
        "writerName": "Noah Bennett",
        "writerEmail": "noah@auroralib.com",
        "status": "Available",
        "isFeatured": true,
        "bookmarks": [],
        "createdAt": "2026-04-20T15:40:00.000Z"
    },
    {
        "slug": "the-last-detective",
        "title": "The Last Detective",
        "description": "A suspense-filled mystery packed with twists and intrigue.",
        "price": 20.99,
        "genre": "Mystery",
        "coverImage": "https://images.unsplash.com/photo-1519682337058-a94d519337bc",
        "writerName": "Grace Mitchell",
        "writerEmail": "grace@auroralib.com",
        "status": "Available",
        "isFeatured": false,
        "bookmarks": [],
        "createdAt": "2026-04-22T17:25:00.000Z"
    },
    {
        "slug": "journey-through-nature",
        "title": "Journey Through Nature",
        "description": "Beautiful stories and lessons inspired by the natural world.",
        "price": 16.99,
        "genre": "Nature",
        "coverImage": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        "writerName": "Lucas Green",
        "writerEmail": "lucas@auroralib.com",
        "status": "Available",
        "isFeatured": false,
        "bookmarks": [],
        "createdAt": "2026-04-25T07:50:00.000Z"
    },
    {
        "slug": "startup-blueprint",
        "title": "Startup Blueprint",
        "description": "A step-by-step roadmap for launching and scaling startups.",
        "price": 23.99,
        "genre": "Business",
        "coverImage": "https://images.unsplash.com/photo-1455390582262-044cdead277a",
        "writerName": "Chloe Adams",
        "writerEmail": "chloe@auroralib.com",
        "status": "Available",
        "isFeatured": true,
        "bookmarks": [],
        "createdAt": "2026-04-28T12:35:00.000Z"
    },
    {
        "slug": "poems-under-moonlight",
        "title": "Poems Under Moonlight",
        "description": "A collection of heartfelt poetry exploring love and dreams.",
        "price": 14.99,
        "genre": "Poetry",
        "coverImage": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
        "writerName": "Emily Rose",
        "writerEmail": "emily@auroralib.com",
        "status": "Available",
        "isFeatured": false,
        "bookmarks": [],
        "createdAt": "2026-05-01T18:15:00.000Z"
    },
    {
        "slug": "cyber-fortress",
        "title": "Cyber Fortress",
        "description": "Essential cybersecurity concepts for developers and businesses.",
        "price": 27.99,
        "genre": "Technology",
        "coverImage": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6",
        "writerName": "Ryan Cooper",
        "writerEmail": "ryan@auroralib.com",
        "status": "Available",
        "isFeatured": true,
        "bookmarks": [],
        "createdAt": "2026-05-05T09:05:00.000Z"
    },
    {
        "slug": "mountains-beyond-the-clouds",
        "title": "Mountains Beyond the Clouds",
        "description": "An inspiring travel memoir across remote landscapes.",
        "price": 18.49,
        "genre": "Travel",
        "coverImage": "https://images.unsplash.com/photo-1474932430478-367dbb6832c1",
        "writerName": "Hannah Lewis",
        "writerEmail": "hannah@auroralib.com",
        "status": "Available",
        "isFeatured": false,
        "bookmarks": [],
        "createdAt": "2026-05-08T14:55:00.000Z"
    },
    {
        "slug": "the-quantum-enigma",
        "title": "The Quantum Enigma",
        "description": "A beginner-friendly introduction to quantum physics and its mysteries.",
        "price": 32.99,
        "genre": "Science",
        "coverImage": "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
        "writerName": "Nathan Clarke",
        "writerEmail": "nathan@auroralib.com",
        "status": "Available",
        "isFeatured": true,
        "bookmarks": [],
        "createdAt": "2026-05-10T16:45:00.000Z"
    }
] 
