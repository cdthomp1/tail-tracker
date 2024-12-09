import { Webhook } from '@clerk/clerk-sdk-node';
import { connectToDatabase } from '@/lib/mongodb';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET; // Store securely in .env.local

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const payload = req.body;
    const signature = req.headers['clerk-signature'];

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

            return res.status(200).json({ message: 'User created and saved to database' });
        }

        return res.status(400).json({ message: 'Unhandled event type' });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return res.status(400).json({ message: 'Invalid webhook payload' });
    }
}
``