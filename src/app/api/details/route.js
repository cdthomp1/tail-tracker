// app/api/details/route.js

import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const registration = searchParams.get('registration');

    if (!registration) {
        return NextResponse.json({ error: 'Registration is required' }, { status: 400 });
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
        console.log('process.env.FLIGHTRADAR_API_KEY', process.env.FLIGHTRADAR_API_KEY)
        const flightData = await flightRes.json();
        console.log(JSON.stringify(flightData))
        return NextResponse.json({
            aircraft: aircraftData.response.aircraft,
            flight: flightData.data?.[0] || null,
        });
    } catch (error) {
        console.error('Error fetching details:', error);
        return NextResponse.json({ error: 'Failed to fetch data.' }, { status: 500 });
    }
}
