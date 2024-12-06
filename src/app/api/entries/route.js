import { connectToDatabase } from '../../lib/mongodb';
import Entry from '../../models/Entry';

export async function GET() {
    await connectToDatabase();
    const entries = await Entry.find({}).sort({ date: 1 }); // Sort by date in descending order (-1 for descending, 1 for ascending)
    return new Response(JSON.stringify(entries), { status: 200 });
}


export async function POST(req) {
    await connectToDatabase();
    const data = await req.json();
    const entry = new Entry(data);
    await entry.save();
    return new Response(JSON.stringify(entry), { status: 201 });
}
