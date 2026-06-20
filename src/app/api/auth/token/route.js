import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SignJWT } from "jose";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user) {
            return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
        }
        const secret = process.env.BETTER_AUTH_SECRET;
        if (!secret) {
            return NextResponse.json({ success: false, message: "Server misconfiguration" }, { status: 500 });
        }
        const secretKey = new TextEncoder().encode(secret);
        const token = await new SignJWT({
            email: session.user.email,
            role: session.user.role,
            name: session.user.name,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("1h")
            .sign(secretKey);
        return NextResponse.json({ success: true, token });
    } catch (err) {
        console.error("[/api/auth/token] Error:", err);
        return NextResponse.json({ success: false, message: "Failed to issue token" }, { status: 500 });
    }
}