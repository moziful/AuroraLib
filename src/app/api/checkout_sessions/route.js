import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '../../../lib/stripe';
import { auth } from '@/lib/auth';

export async function POST(req) {
    try {
        const headersList = await headers();
        const session = await auth.api.getSession({ headers: headersList });
        const userEmail = session?.user?.email;

        if (!userEmail) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const formData = await req.formData();
        const title = formData.get('title') || 'Untitled Book';
        const price = parseFloat(formData.get('price'));
        const bookId = formData.get('bookId');

        if (!price || isNaN(price)) {
            return NextResponse.json({ error: "Invalid price" }, { status: 400 });
        }

        const origin = headersList.get('origin') || "http://localhost:3000";

        const stripeSession = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: title,
                        },
                        unit_amount: Math.round(price * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/canceled`,
            metadata: {
                bookId: bookId,
                userEmail: userEmail,
            }
        });

        return NextResponse.redirect(stripeSession.url, 303);

    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        );
    }
}
