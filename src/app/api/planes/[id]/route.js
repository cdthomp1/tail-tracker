import { connectToDatabase } from '../../../lib/mongodb';
import Plane from '../../../models/Plane';

// GET plane by registration
export async function GET(req, { params }) {
    const { registration } = params; // Access the registration parameter
    await connectToDatabase();

    try {
        const plane = await Plane.findOne({ registration }); // Find plane by registration
        if (!plane) {
            return new Response(JSON.stringify({ error: "Plane not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(plane), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid registration or server error" }), { status: 500 });
    }
}

// Update plane by registration
export async function PUT(req, { params }) {
    const { registration } = params; // Access the registration parameter
    const data = await req.json(); // Get the updated data from the request body
    await connectToDatabase();

    try {
        const updatedPlane = await Plane.findOneAndUpdate({ registration }, data, { new: true });
        if (!updatedPlane) {
            return new Response(JSON.stringify({ error: "Plane not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(updatedPlane), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid registration or server error" }), { status: 500 });
    }
}

// Delete plane by registration
export async function DELETE(req, { params }) {
    const { registration } = params; // Access the registration parameter
    await connectToDatabase();

    try {
        const deletedPlane = await Plane.findOneAndDelete({ registration }); // Find and delete by registration
        if (!deletedPlane) {
            return new Response(JSON.stringify({ error: "Plane not found" }), { status: 404 });
        }
        return new Response(JSON.stringify({ message: "Plane deleted" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid registration or server error" }), { status: 500 });
    }
}
