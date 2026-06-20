import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
    try {
        // Use Better Auth's jwt plugin server-side API to get the token.
        // This returns an Ed25519-signed JWT using the key stored in MongoDB (jwks collection).
        // The backend verifies it via /api/auth/jwks — no shared secret needed.
        const result = await auth.api.getToken({
            headers: await headers(),
        });

        if (!result?.token) {
            return NextResponse.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        return NextResponse.json({ success: true, token: result.token });
    } catch (err) {
        console.error("[/api/auth/token] Error:", err);
        return NextResponse.json(
            { success: false, message: "Failed to issue token" },
            { status: 500 }
        );
    }
}