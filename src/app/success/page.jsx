import { redirect } from "next/navigation";
import { stripe } from "../../lib/stripe";
import { handleSuccessfulPurchase } from "@/lib/user-actions";
import { getBookById } from "@/lib/data";
import SuccessLayout from "@/components/SuccessLayout";

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id");
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const { status, customer_details, metadata } = session;

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    const appUserEmail = metadata?.userEmail || customer_details?.email;
    let book = null;
    if (metadata?.bookId) {
      await handleSuccessfulPurchase(metadata.bookId, appUserEmail);
      book = await getBookById(metadata.bookId);
    }

    return (
      <SuccessLayout
        book={book}
        appUserEmail={appUserEmail}
        session_id={session_id}
        amount_total={session.amount_total}
      />
    );
  }
}
