import { connectToDatabase } from '../../lib/mongodb';
import Entry from '../../models/Entry';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const registration = searchParams.get('registration');

    if (!registration) {
        return NextResponse.json({ error: 'Registration is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Fetch entry
    let entry = await Entry.findOne({ registration });
    if (!entry) {
        return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    // Ensure `sightings` array exists and is properly initialized
    if (!entry.sightings || entry.sightings.length === 0) {
        entry.sightings = [
            {
                interactionType: 'unknown',
                location: '',
                departureAirport: '',
                destinationAirport: '',
                flightNumber: '',
                notes: '',
                image: '',
                date: new Date(),
            },
        ];
        await entry.save();
    }

    // Fetch Aircraft Data
    const aircraftRes = await fetch(`https://api.adsbdb.com/v0/aircraft/${registration}`);
    const aircraftData = await aircraftRes.json();

    const currentEpoch = Math.floor(Date.now() / 1000); // Current time in epoch seconds
    const oneHourAgo = currentEpoch - 3600; // Epoch time for one hour ago
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000); // Date 30 minutes ago

    console.log("CALLING FLIGHT RADAR");
    // Fetch live flight data
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
    const currentFlight = flightData.data?.[0] || null;

    // Check if there is a recent flight within the last hour
    const flightHistory = entry.flightHistory || [];
    const recentFlight = flightHistory.find((flight) => flight.lastSeen >= oneHourAgo);

    if (recentFlight) {
        console.log('Recent flight found within the last hour:', recentFlight.callsign);
        return NextResponse.json({
            registration: entry.registration,
            sightings: entry.sightings,
            flightHistory: entry.flightHistory,
            lastFlightHistoryCheck: entry.lastFlightHistoryCheck,
            aircraft: aircraftData.response?.aircraft || null,
            flight: currentFlight,
        });
    }

    // Determine if OpenSky API call is needed
    const lastFlightHistoryCheck = entry.lastFlightHistoryCheck || new Date(0);
    const shouldCallOpenSky =
        lastFlightHistoryCheck < thirtyMinutesAgo || entry.flightHistory.length === 0;

    if (!shouldCallOpenSky) {
        console.log('OpenSky API call not needed; last check was less than 30 minutes ago.');
        return NextResponse.json({
            registration: entry.registration,
            sightings: entry.sightings,
            flightHistory: entry.flightHistory,
            lastFlightHistoryCheck: entry.lastFlightHistoryCheck,
            aircraft: aircraftData.response?.aircraft || null,
            flight: currentFlight,
        });
    }

    let begin = Math.floor(entry.sightings[0]?.date.getTime() / 1000 || Date.now() / 1000);
    if (flightHistory.length > 0) {
        const latestFlight = flightHistory.reduce((a, b) => (a.lastSeen > b.lastSeen ? a : b));
        begin = latestFlight.lastSeen;
    }

    let allFlightHistory = [];
    const maxRangeInSeconds = 30 * 24 * 60 * 60; // 30 days
    let currentBegin = begin;
    let tempCurrentEpoch = currentEpoch;

    while (currentBegin < currentEpoch) {
        tempCurrentEpoch = Math.min(currentBegin + maxRangeInSeconds, currentEpoch);
        const chunkUrl = `https://opensky-network.org/api/flights/aircraft?icao24=${aircraftData.response?.aircraft?.mode_s?.toLowerCase()}&begin=${currentBegin}&end=${tempCurrentEpoch}`;

        console.log("CALLING OPENSKY", chunkUrl);

        const chunkResponse = await fetch(chunkUrl, {
            method: 'GET',
            headers: {
                Authorization:
                    'Basic ' +
                    Buffer.from(
                        `${process.env.OPENSKY_USER}:${process.env.OPENSKY_PASS}`
                    ).toString('base64'),
            },
        });

        if (!chunkResponse.ok) {
            console.error('OpenSky API error:', await chunkResponse.text());
            break;
        }

        const chunkData = await chunkResponse.json();
        allFlightHistory = [...allFlightHistory, ...chunkData];
        currentBegin = tempCurrentEpoch;
    }

    entry.flightHistory = [...allFlightHistory, ...entry.flightHistory];
    entry.flightHistory.sort((a, b) => b.lastSeen - a.lastSeen);

    entry.lastFlightHistoryCheck = new Date();
    await entry.save();

    return NextResponse.json({
        registration: entry.registration,
        sightings: entry.sightings,
        flightHistory: entry.flightHistory,
        lastFlightHistoryCheck: entry.lastFlightHistoryCheck,
        aircraft: aircraftData.response?.aircraft || null,
        flight: currentFlight,
    });
}
