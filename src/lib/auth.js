import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt, admin } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("AuroraLib");

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"],
        },
    },
    database: mongodbAdapter(db, {
        // Optional: if you don't provide a client, database transactions won't be enabled.
        client
    }),
    plugins: [
        jwt(),
        admin(),
    ],
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "reader",
                input: true,
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (userData) => {
                    if (!userData.role || userData.role === "user") {
                        return { data: { ...userData, role: "reader" } };
                    }
                    return { data: userData };
                },
            },
        },
    },
});
