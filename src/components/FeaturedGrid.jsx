"use client";

import { motion } from "framer-motion";
import BookCard, { BookCardSkeleton } from "./BookCard";

export default function FeaturedGrid({ books }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08
          }
        }
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      {books.length
        ? books.map((book) => (
            <BookCard
              key={book.slug || `${book.title}-${book.createdAt}`}
              book={book}
            />
          ))
        : Array.from({ length: 6 }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))}
    </motion.div>
  );
}
