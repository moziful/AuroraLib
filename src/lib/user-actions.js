"use server";

import { MongoClient } from "mongodb";

export async function updateUserDetails(userId, { name, email }) {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not configured");
    }
    
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        const db = client.db("AuroraLib");
        
        // better-auth uses "user" collection with a string id
        const result = await db.collection("user").updateOne(
            { id: userId },
            { $set: { name, email } }
        );
        
        if (result.matchedCount === 0) {
            throw new Error("User not found");
        }
        
        return { success: true };
    } catch (error) {
        console.error("Failed to update user details:", error);
        throw new Error("Failed to update user details");
    } finally {
        await client.close();
    }
}
