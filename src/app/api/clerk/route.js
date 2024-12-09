import { Webhook } from '@clerk/clerk-sdk-node';
import { connectToDatabase } from '@/app/lib/mongodb';
import { NextResponse } from 'next/server';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET; // Store securely in .env.local

export async function POST(request) {
    console.log("Here in web hook")
    // if (request.method !== 'POST') {
    //     return res.status(405).json({ message: 'Method not allowed' });
    // }

    const payload = request.body;
    const signature = request.headers['clerk-signature'];

    try {
        // Verify the webhook signature
        const event = Webhook.verify(payload, signature, webhookSecret);

        if (event.type === 'user.created') {
            const { id: userId, email_addresses } = event.data;
            const email = email_addresses[0]?.email_address || null;

            // Connect to MongoDB and save the user
            const db = await connectToDatabase();
            const collection = db.collection('users');

            // Insert the new user
            await collection.insertOne({ userId, email, createdAt: new Date() });
            console.log("User created and saved to database")

            return NextResponse.json({ message: 'User created and saved to database' });
        }

        return NextResponse.json({ message: 'Unhandled event type' });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ message: 'Invalid webhook payload' });
    }
}
``