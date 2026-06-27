import { notFound } from "next/navigation";
import { getBookById } from "@/lib/data";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import BackButton from "@/components/BackButton";
import BookDetailsLayout from "@/components/BookDetailsLayout";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const getStatusStyles = (status) => {
  switch (status) {
    case "Available": return "border-emerald-500/20 bg-emerald-500/40 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-300";
    case "Unavailable": return "border-rose-500/20 bg-rose-500/40 dark:bg-rose-500/10 text-rose-500 dark:text-rose-300";
    default: return "border-amber-500/20 bg-amber-500/40 dark:bg-amber-500/10 text-amber-500 dark:text-amber-300";
  }
};

export default async function BookDetailsPage({ params }) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    notFound();
  }

  const session = await auth.api.getSession({ headers: await headers() });
  const currentUserEmail = session?.user?.email;
  const isOwned = currentUserEmail && book.buyerEmail === currentUserEmail;
  const isOwnBook = currentUserEmail && book.writerEmail === currentUserEmail;

  const isAvailable = book.status === "Available" && !isOwned && !isOwnBook;
  const statusStyles = getStatusStyles(book.status);

  return (
    <div className="sm:h-[calc(100vh-4rem)] overflow-hidden bg-white dark:bg-slate-950 px-4 py-6">
      <div className="mx-auto flex h-full min-h-0 max-w-7xl flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <BackButton />
        </div>
        <BookDetailsLayout
          book={book}
          isAvailable={isAvailable}
          isOwned={isOwned}
          isOwnBook={isOwnBook}
          isLoggedIn={!!session}
          statusStyles={statusStyles}
          formatDate={formatDate(book.createdAt)}
        />
      </div>
    </div>
  );
}