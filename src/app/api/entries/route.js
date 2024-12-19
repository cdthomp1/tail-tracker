import { connectToDatabase } from '../../lib/mongodb';
import Entry from '../../models/Entry';
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
    const user = await currentUser();
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    await connectToDatabase();

    // Find entries that belong to the current user
    const entries = await Entry.find({ userId: user.id }).sort({ date: -1 }); // Sort by date in descending order

    return new Response(JSON.stringify(entries), { status: 200 });
}

export async function POST(req) {
    await connectToDatabase();
    const data = await req.json();

    // Associate the new entry with the current user
    const user = await currentUser();
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const entry = new Entry({ ...data, userId: user.id });
    console.log(entry)
    await entry.save();

    return new Response(JSON.stringify(entry), { status: 201 });
}
