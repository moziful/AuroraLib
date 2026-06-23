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


// export const booksdata = [
//     {
//         "slug": "whispers-of-the-tide",
//         "title": "Whispers of the Tide",
//         "description": "A captivating story of a coastal town and the secrets hidden beneath the waves.",
//         "price": 19.99,
//         "genre": "Fiction",
//         "coverImage": "https://images.unsplash.com/photo-1512820790803-83ca734da794",
//         "writerName": "Sophia Carter",
//         "writerEmail": "sophia@auroralib.com",
//         "status": "Available",
//         "isFeatured": true,
//         "bookmarks": [],
//         "createdAt": "2026-04-01T09:15:00.000Z"
//     },
//     {
//         "slug": "code-beyond-limits",
//         "title": "Code Beyond Limits bbbbbbg hkvhbk hhkg vgjhvb gvhbhjv",
//         "description": "Practical insights into modern software engineering and scalable systems. In an era where software defines to modern software engineering and scalable systems. In an era where software defines to modern software engineering and scalable systems. In an era where software defines to modern software engineering and scalable systems. In an era where software defines the heartbeat of global industries, the gap between making it work and building it to last has neveble, real - world strategies.",
//         "price": 29.99,
//         "genre": "Technology",
//         "coverImage": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
//         "writerName": "Daniel Brooks",
//         "writerEmail": "daniel@auroralib.com",
//         "status": "Unavailable",
//         "isFeatured": false,
//         "bookmarks": [],
//         "createdAt": "2026-04-05T12:00:00.000Z"
//     },
//     {
//         "slug": "the-silent-galaxy",
//         "title": "The Silent Galaxy",
//         "description": "An epic science fiction adventure through unexplored regions of space.",
//         "price": 22.5,
//         "genre": "Sci-Fi",
//         "coverImage": "https://images.unsplash.com/photo-1462331940025-496dfbfc7564",
//         "writerName": "Ava Reynolds",
//         "writerEmail": "ava@auroralib.com",
//         "status": "Coming Soon",
//         "isFeatured": true,
//         "bookmarks": [],
//         "createdAt": "2026-04-08T14:20:00.000Z"
//     },
//     {
//         "slug": "mastering-mindfulness",
//         "title": "Mastering Mindfulness",
//         "description": "A practical guide to focus, calmness, and personal growth.",
//         "price": 17.99,
//         "genre": "Self-Help",
//         "coverImage": "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
//         "writerName": "Liam Foster",
//         "writerEmail": "liam@auroralib.com",
//         "status": "Available",
//         "isFeatured": false,
//         "bookmarks": [],
//         "createdAt": "2026-04-10T08:30:00.000Z"
//     },
//     {
//         "slug": "the-forgotten-kingdom",
//         "title": "The Forgotten Kingdom",
//         "description": "A fantasy tale of lost civilizations, magic, and destiny.",
//         "price": 26.99,
//         "genre": "Fantasy",
//         "coverImage": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
//         "writerName": "Mia Thornton",
//         "writerEmail": "mia@auroralib.com",
//         "status": "Available",
//         "isFeatured": true,
//         "bookmarks": [],
//         "createdAt": "2026-04-12T11:45:00.000Z"
//     },
//     {
//         "slug": "business-in-the-digital-age",
//         "title": "Business in the Digital Age",
//         "description": "Strategies for entrepreneurs navigating modern markets.",
//         "price": 21.5,
//         "genre": "Business",
//         "coverImage": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
//         "writerName": "Ethan Walker",
//         "writerEmail": "ethan@auroralib.com",
//         "status": "Available",
//         "isFeatured": false,
//         "bookmarks": [],
//         "createdAt": "2026-04-15T13:00:00.000Z"
//     },
//     {
//         "slug": "echoes-of-yesterday",
//         "title": "Echoes of Yesterday",
//         "description": "A moving historical novel spanning three generations.",
//         "price": 18.75,
//         "genre": "Historical Fiction",
//         "coverImage": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
//         "writerName": "Olivia Hayes",
//         "writerEmail": "olivia@auroralib.com",
//         "status": "Available",
//         "isFeatured": true,
//         "bookmarks": [],
//         "createdAt": "2026-04-18T10:10:00.000Z"
//     },
//     {
//         "slug": "artificial-horizons",
//         "title": "Artificial Horizons",
//         "description": "Understanding AI, machine learning, and the future of technology.",
//         "price": 31.99,
//         "genre": "Technology",
//         "coverImage": "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
//         "writerName": "Noah Bennett",
//         "writerEmail": "noah@auroralib.com",
//         "status": "Available",
//         "isFeatured": true,
//         "bookmarks": [],
//         "createdAt": "2026-04-20T15:40:00.000Z"
//     },
//     {
//         "slug": "the-last-detective",
//         "title": "The Last Detective",
//         "description": "A suspense-filled mystery packed with twists and intrigue.",
//         "price": 20.99,
//         "genre": "Mystery",
//         "coverImage": "https://images.unsplash.com/photo-1519682337058-a94d519337bc",
//         "writerName": "Grace Mitchell",
//         "writerEmail": "grace@auroralib.com",
//         "status": "Available",
//         "isFeatured": false,
//         "bookmarks": [],
//         "createdAt": "2026-04-22T17:25:00.000Z"
//     },
//     {
//         "slug": "journey-through-nature",
//         "title": "Journey Through Nature",
//         "description": "Beautiful stories and lessons inspired by the natural world.",
//         "price": 16.99,
//         "genre": "Nature",
//         "coverImage": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
//         "writerName": "Lucas Green",
//         "writerEmail": "lucas@auroralib.com",
//         "status": "Available",
//         "isFeatured": false,
//         "bookmarks": [],
//         "createdAt": "2026-04-25T07:50:00.000Z"
//     },
//     {
//         "slug": "startup-blueprint",
//         "title": "Startup Blueprint",
//         "description": "A step-by-step roadmap for launching and scaling startups.",
//         "price": 23.99,
//         "genre": "Business",
//         "coverImage": "https://images.unsplash.com/photo-1455390582262-044cdead277a",
//         "writerName": "Chloe Adams",
//         "writerEmail": "chloe@auroralib.com",
//         "status": "Available",
//         "isFeatured": true,
//         "bookmarks": [],
//         "createdAt": "2026-04-28T12:35:00.000Z"
//     },
//     {
//         "slug": "poems-under-moonlight",
//         "title": "Poems Under Moonlight",
//         "description": "A collection of heartfelt poetry exploring love and dreams.",
//         "price": 14.99,
//         "genre": "Poetry",
//         "coverImage": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
//         "writerName": "Emily Rose",
//         "writerEmail": "emily@auroralib.com",
//         "status": "Available",
//         "isFeatured": false,
//         "bookmarks": [],
//         "createdAt": "2026-05-01T18:15:00.000Z"
//     },
//     {
//         "slug": "cyber-fortress",
//         "title": "Cyber Fortress",
//         "description": "Essential cybersecurity concepts for developers and businesses.",
//         "price": 27.99,
//         "genre": "Technology",
//         "coverImage": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6",
//         "writerName": "Ryan Cooper",
//         "writerEmail": "ryan@auroralib.com",
//         "status": "Available",
//         "isFeatured": true,
//         "bookmarks": [],
//         "createdAt": "2026-05-05T09:05:00.000Z"
//     },
//     {
//         "slug": "mountains-beyond-the-clouds",
//         "title": "Mountains Beyond the Clouds",
//         "description": "An inspiring travel memoir across remote landscapes.",
//         "price": 18.49,
//         "genre": "Travel",
//         "coverImage": "https://images.unsplash.com/photo-1474932430478-367dbb6832c1",
//         "writerName": "Hannah Lewis",
//         "writerEmail": "hannah@auroralib.com",
//         "status": "Available",
//         "isFeatured": false,
//         "bookmarks": [],
//         "createdAt": "2026-05-08T14:55:00.000Z"
//     },
//     {
//         "slug": "the-quantum-enigma",
//         "title": "The Quantum Enigma",
//         "description": "A beginner-friendly introduction to quantum physics and its mysteries.",
//         "price": 32.99,
//         "genre": "Science",
//         "coverImage": "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
//         "writerName": "Nathan Clarke",
//         "writerEmail": "nathan@auroralib.com",
//         "status": "Available",
//         "isFeatured": true,
//         "bookmarks": [],
//         "createdAt": "2026-05-10T16:45:00.000Z"
//     },
//     {
//         "slug": "shadows-of-the-forest",
//         "title": "Shadows of the Forest",
//         "description": "A thrilling adventure uncovering secrets hidden deep within an ancient forest.",
//         "price": 18.99,
//         "genre": "Adventure",
//         "coverImage": "https://images.unsplash.com/photo-1448375240586-882707db888b",
//         "writerName": "Evelyn Scott",
//         "writerEmail": "evelyn@auroralib.com",
//         "status": "Available",
//         "isFeatured": false,
//         "bookmarks": [],
//         "createdAt": "2026-05-12T10:00:00.000Z"
//     },
//     {
//         "slug": "future-cities",
//         "title": "Future Cities",
//         "description": "Exploring how technology and sustainability will shape tomorrow's urban life.",
//         "price": 24.99,
//         "genre": "Technology",
//         "coverImage": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df",
//         "writerName": "Oliver King",
//         "writerEmail": "oliver@auroralib.com",
//         "status": "Available",
//         "isFeatured": true,
//         "bookmarks": [],
//         "createdAt": "2026-05-13T09:30:00.000Z"
//     },
//     {
//         "slug": "the-golden-compass",
//         "title": "The Golden Compass",
//         "description": "A young explorer follows a mysterious map to an unknown world.",
//         "price": 21.99,
//         "genre": "Fantasy",
//         "coverImage": "https://images.unsplash.com/photo-1516972810927-80185027ca84",
//         "writerName": "Isabella Moore",
//         "writerEmail": "isabella@auroralib.com",
//         "status": "Available",
//         "isFeatured": true,
//         "bookmarks": [],
//         "createdAt": "2026-05-14T12:15:00.000Z"
//     },
//     {
//         "slug": "health-habits",
//         "title": "Health Habits",
//         "description": "Simple daily practices for long-term wellness and productivity.",
//         "price": 15.99,
//         "genre": "Health",
//         "coverImage": "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
//         "writerName": "Jacob Turner",
//         "writerEmail": "jacob@auroralib.com",
//         "status": "Available",
//         "isFeatured": false,
//         "bookmarks": [],
//         "createdAt": "2026-05-15T08:45:00.000Z"
//     },
//     {
//         "slug": "the-hidden-clue",
//         "title": "The Hidden Clue",
//         "description": "A detective races against time to solve a baffling disappearance.",
//         "price": 19.49,
//         "genre": "Mystery",
//         "coverImage": "https://images.unsplash.com/photo-1512820790803-83ca734da794",
//         "writerName": "Amelia Reed",
//         "writerEmail": "amelia@auroralib.com",
//         "status": "Available",
//         "isFeatured": false,
//         "bookmarks": [],
//         "createdAt": "2026-05-16T11:20:00.000Z"
//     },
//     {
//         "slug": "ocean-of-stars",
//         "title": "Ocean of Stars",
//         "description": "A science fiction journey through distant galaxies and cosmic mysteries.",
//         "price": 25.99,
//         "genre": "Sci-Fi",
//         "coverImage": "https://images.unsplash.com/photo-1462331940025-496dfbfc7564",
//         "writerName": "Logan Price",
//         "writerEmail": "logan@auroralib.com",
//         "status": "Coming Soon",
//         "isFeatured": true,
//         "bookmarks": [],
//         "createdAt": "2026-05-17T15:30:00.000Z"
//     },
//     {
//         "slug": "leadership-unlocked",
//         "title": "Leadership Unlocked",
//         "description": "Practical lessons for leading teams and building successful organizations.",
//         "price": 22.99,
//         "genre": "Business",
//         "coverImage": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
//         "writerName": "Sophie Hall",
//         "writerEmail": "sophie@auroralib.com",
//         "status": "Available",
//         "isFeatured": true,
//         "bookmarks": [],
//         "createdAt": "2026-05-18T09:10:00.000Z"
//     },
//     {
//         "slug": "voices-of-history",
//         "title": "Voices of History",
//         "description": "Stories from remarkable figures who shaped the modern world.",
//         "price": 20.99,
//         "genre": "History",
//         "coverImage": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
//         "writerName": "Benjamin Cook",
//         "writerEmail": "benjamin@auroralib.com",
//         "status": "Available",
//         "isFeatured": false,
//         "bookmarks": [],
//         "createdAt": "2026-05-19T14:40:00.000Z"
//     },
//     {
//         "slug": "creative-writing-mastery",
//         "title": "Creative Writing Mastery",
//         "description": "Techniques and exercises to improve storytelling and writing skills.",
//         "price": 16.99,
//         "genre": "Education",
//         "coverImage": "https://images.unsplash.com/photo-1455390582262-044cdead277a",
//         "writerName": "Victoria Lane",
//         "writerEmail": "victoria@auroralib.com",
//         "status": "Available",
//         "isFeatured": false,
//         "bookmarks": [],
//         "createdAt": "2026-05-20T16:10:00.000Z"
//     },
//     {
//         "slug": "desert-winds",
//         "title": "Desert Winds",
//         "description": "A dramatic tale of survival and self-discovery across endless dunes.",
//         "price": 18.5,
//         "genre": "Fiction",
//         "coverImage": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
//         "writerName": "Henry Stone",
//         "writerEmail": "henry@auroralib.com",
//         "status": "Available",
//         "isFeatured": false,
//         "bookmarks": [],
//         "createdAt": "2026-05-21T13:25:00.000Z"
//     },
//     {
//         "slug": "modern-javascript-guide",
//         "title": "Modern JavaScript Guide",
//         "description": "Comprehensive coverage of ES6+, frameworks, and best practices.",
//         "price": 34.99,
//         "genre": "Technology",
//         "coverImage": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
//         "writerName": "David Morgan",
//         "writerEmail": "david@auroralib.com",
//         "status": "Available",
//         "isFeatured": true,
//         "bookmarks": [],
//         "createdAt": "2026-05-22T10:50:00.000Z"
//     },
//     {
//         "slug": "dreams-in-ink",
//         "title": "Dreams in Ink",
//         "description": "A collection of inspiring poems and reflections.",
//         "price": 13.99,
//         "genre": "Poetry",
//         "coverImage": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
//         "writerName": "Ella Brooks",
//         "writerEmail": "ella@auroralib.com",
//         "status": "Available",
//         "isFeatured": false,
//         "bookmarks": [],
//         "createdAt": "2026-05-23T18:00:00.000Z"
//     },
//     {
//         "slug": "around-the-world",
//         "title": "Around the World",
//         "description": "Travel experiences from vibrant cities and remote destinations.",
//         "price": 19.99,
//         "genre": "Travel",
//         "coverImage": "https://images.unsplash.com/photo-1474932430478-367dbb6832c1",
//         "writerName": "Lily Evans",
//         "writerEmail": "lily@auroralib.com",
//         "status": "Available",
//         "isFeatured": true,
//         "bookmarks": [],
//         "createdAt": "2026-05-24T07:30:00.000Z"
//     },
//     {
//         "slug": "deep-space-chronicles",
//         "title": "Deep Space Chronicles",
//         "description": "An interstellar saga of discovery, danger, and exploration.",
//         "price": 27.49,
//         "genre": "Sci-Fi",
//         "coverImage": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa",
//         "writerName": "Jason Ward",
//         "writerEmail": "jason@auroralib.com",
//         "status": "Available",
//         "isFeatured": true,
//         "bookmarks": [],
//         "createdAt": "2026-05-25T15:45:00.000Z"
//     },
//     {
//         "slug": "green-earth",
//         "title": "Green Earth",
//         "description": "Understanding environmental challenges and sustainable solutions.",
//         "price": 17.49,
//         "genre": "Nature",
//         "coverImage": "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
//         "writerName": "Mason Hill",
//         "writerEmail": "mason@auroralib.com",
//         "status": "Available",
//         "isFeatured": false,
//         "bookmarks": [],
//         "createdAt": "2026-05-26T11:35:00.000Z"
//     },
//     {
//         "slug": "financial-freedom",
//         "title": "Financial Freedom",
//         "description": "A practical guide to saving, investing, and wealth building.",
//         "price": 28.99,
//         "genre": "Finance",
//         "coverImage": "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
//         "writerName": "Aiden Ross",
//         "writerEmail": "aiden@auroralib.com",
//         "status": "Available",
//         "isFeatured": true,
//         "bookmarks": [],
//         "createdAt": "2026-05-27T09:25:00.000Z"
//     },
//     {
//         "slug": "the-crystal-crown",
//         "title": "The Crystal Crown",
//         "description": "A magical kingdom faces its greatest threat in centuries.",
//         "price": 24.49,
//         "genre": "Fantasy",
//         "coverImage": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
//         "writerName": "Scarlett White",
//         "writerEmail": "scarlett@auroralib.com",
//         "status": "Available",
//         "isFeatured": true,
//         "bookmarks": [],
//         "createdAt": "2026-05-28T14:15:00.000Z"
//     },
//     {
//         "slug": "psychology-of-success",
//         "title": "Psychology of Success",
//         "description": "Discover the mindset patterns behind high achievement.",
//         "price": 18.99,
//         "genre": "Self-Help",
//         "coverImage": "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
//         "writerName": "Natalie Young",
//         "writerEmail": "natalie@auroralib.com",
//         "status": "Available",
//         "isFeatured": false,
//         "bookmarks": [],
//         "createdAt": "2026-05-29T08:20:00.000Z"
//     },
//     {
//         "slug": "hidden-equations",
//         "title": "Hidden Equations",
//         "description": "Exploring the beauty of mathematics in everyday life.",
//         "price": 26.99,
//         "genre": "Science",
//         "coverImage": "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
//         "writerName": "Andrew Bell",
//         "writerEmail": "andrew@auroralib.com",
//         "status": "Available",
//         "isFeatured": false,
//         "bookmarks": [],
//         "createdAt": "2026-05-30T12:05:00.000Z"
//     },
//     {
//         "slug": "the-midnight-train",
//         "title": "The Midnight Train",
//         "description": "A suspenseful journey where every passenger hides a secret.",
//         "price": 21.99,
//         "genre": "Thriller",
//         "coverImage": "https://images.unsplash.com/photo-1519682337058-a94d519337bc",
//         "writerName": "Zoe Parker",
//         "writerEmail": "zoe@auroralib.com",
//         "status": "Available",
//         "isFeatured": true,
//         "bookmarks": [],
//         "createdAt": "2026-05-31T17:55:00.000Z"
//     }
// ] 
