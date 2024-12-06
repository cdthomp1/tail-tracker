// app/api/details/route.js
import { connectToDatabase } from '../../lib/mongodb';
import Entry from '../../models/Entry';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const registration = searchParams.get('registration');

    if (!registration) {
        return NextResponse.json({ error: 'Registration is required' }, { status: 400 });
    }

    let entry;

    try {
        entry = await Entry.findOne({ registration }); // Query by registration
        if (!entry) {
            return new Response(JSON.stringify({ error: "Entry not found" }), { status: 404 });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid registration or server error" }), { status: 500 });
    }

    try {
        // Fetch Aircraft Data
        const aircraftRes = await fetch(`https://api.adsbdb.com/v0/aircraft/${registration}`);
        const aircraftData = await aircraftRes.json();

        // Fetch Flight Position
        const flightRes = await fetch(
            `https://fr24api.flightradar24.com/api/live/flight-positions/full?registrations=${registration}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.FLIGHTRADAR_API_KEY}`,
                    'Accept-Version': 'v1',
                },
            }
        );
        const flightData = await flightRes.json();

        return NextResponse.json({
            ...entry._doc,
            aircraft: aircraftData.response.aircraft,
            flight: flightData.data?.[0] || null,
        });
    } catch (error) {
        console.error('Error fetching details:', error);
        return NextResponse.json({ error: 'Failed to fetch data.' }, { status: 500 });
    }
}
