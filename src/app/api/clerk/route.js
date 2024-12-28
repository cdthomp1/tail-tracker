import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { connectToDatabase } from '../../lib/mongodb';
import User from '../../models/User';

export async function POST(req) {
    const SIGNING_SECRET = process.env.SIGNING_SECRET;

    if (!SIGNING_SECRET) {
        throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local');
    }

    // Create new Svix instance with secret
    const wh = new Webhook(SIGNING_SECRET);

    // Get headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error: Missing Svix headers', {
            status: 400,
        });
    }

    // Get body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    let evt;

    // Verify payload with headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        });
    } catch (err) {
        console.error('Error: Could not verify webhook:', err);
        return new Response('Error: Verification error', {
            status: 400,
        });
    }

    // Extract data and handle `user.created` event
    const { id: userId, email_addresses, first_name, last_name, profile_image_url } = evt.data;
    const eventType = evt.type;

    console.log(`Received webhook with ID ${userId} and event type of ${eventType}`);
    console.log('Webhook payload:', body);

    if (eventType === 'user.created') {
        // Save to MongoDB
        try {
            await connectToDatabase();
            const email = email_addresses[0]?.email_address || null;

            let entry = await User.findOne({ email });
            if (entry) {
                console.log("user already added")
                return new Response('Webhook received', { status: 200 });
            }

            // Insert the new user into the database
            const newUser = {
                userId,
                email,
                firstName: first_name || null,
                lastName: last_name || null,
                profileImageUrl: profile_image_url || null,
                createdAt: new Date(),
            };

            var user = User(newUser)

            await user.save()
            console.log('User successfully saved to the database:', newUser);
        } catch (error) {
            console.error('Error saving user to database:', error);
            return new Response('Error: Could not save user to database', {
                status: 500,
            });
        }
    }

    return new Response('Webhook received', { status: 200 });
}

export async function GET() {
    return Response.json({ message: 'Hello World!' })
}