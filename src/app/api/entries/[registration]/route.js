import { connectToDatabase } from '../../../lib/mongodb';
import Entry from '../../../models/Entry';

// Get entry by registration
export async function GET(req, { params }) {
    const { registration } = params; // Access the dynamic registration parameter
    await connectToDatabase();

    try {
        const entry = await Entry.findOne({ registration }); // Query by registration
        if (!entry) {
            return new Response(JSON.stringify({ error: "Entry not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(entry), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid registration or server error" }), { status: 500 });
    }
}

// Update entry by registration
export async function PUT(req, { params }) {
    const { registration } = params; // Access the dynamic registration parameter
    const data = await req.json(); // Read JSON body from the request
    await connectToDatabase();

    try {
        const updatedEntry = await Entry.findOneAndUpdate({ registration }, data, { new: true }); // Update entry
        if (!updatedEntry) {
            return new Response(JSON.stringify({ error: "Entry not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(updatedEntry), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid registration or server error" }), { status: 500 });
    }
}

// Delete entry by registration
export async function DELETE(req, { params }) {
    const { registration } = params; // Access the dynamic registration parameter
    await connectToDatabase();

    try {
        const deletedEntry = await Entry.findOneAndDelete({ registration }); // Delete entry by registration
        if (!deletedEntry) {
            return new Response(JSON.stringify({ error: "Entry not found" }), { status: 404 });
        }
        return new Response(JSON.stringify({ message: "Entry deleted" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid registration or server error" }), { status: 500 });
    }
}
