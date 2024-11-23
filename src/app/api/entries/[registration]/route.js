import { connectToDatabase } from '../../../lib/mongodb';
import Entry from '../../../models/Entry';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


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
    const { registration: id } = await params;
    await connectToDatabase();

    try {
        // Find the entry by _id
        const entry = await Entry.findById(id);
        if (!entry) {
            return new Response(JSON.stringify({ error: 'Entry not found' }), { status: 404 });
        }

        // If the entry has an associated image, delete it from Cloudinary
        if (entry.image) {
            const publicId = entry.image.split('/').pop().split('.')[0]; // Extract public_id from the URL
            await cloudinary.v2.uploader.destroy(`tailtracker/${publicId}`);
        }

        // Delete the entry from the database
        await Entry.findByIdAndDelete(id);

        return new Response(JSON.stringify({ message: 'Entry and image deleted' }), { status: 200 });
    } catch (error) {
        console.error('Error deleting entry or image:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete entry or image' }), { status: 500 });
    }
}
