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

    // Fetch Aircraft Data
    const aircraftRes = await fetch(`https://api.adsbdb.com/v0/aircraft/${registration}`);
    const aircraftData = await aircraftRes.json();

    const currentEpoch = Math.floor(Date.now() / 1000); // Current time in epoch seconds
    const oneHourAgo = currentEpoch - 3600; // Epoch time for one hour ago
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000); // Date 30 minutes ago

    console.log("CALLING FLIGHT RADAR")
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
    let flightHistory = entry.flightHistory || [];
    const recentFlight = flightHistory.find(
        (flight) => flight.lastSeen >= oneHourAgo
    );

    if (recentFlight) {
        // Recent flight found within the last hour
        console.log('Recent flight found within the last hour:', recentFlight);
        return NextResponse.json({
            ...entry._doc,
            aircraft: aircraftData.response.aircraft,
            flight: currentFlight, // Always return live flight data for UI
            flightHistory: entry.flightHistory,
        });
    }

    // Determine if OpenSky API call is needed
    const lastFlightHistoryCheck = entry.lastFlightHistoryCheck || new Date(0); // Default to epoch start if undefined
    const shouldCallOpenSky = lastFlightHistoryCheck < thirtyMinutesAgo || entry.flightHistory.length === 0;


    if (!shouldCallOpenSky) {
        // No need to call OpenSky
        console.log('OpenSky API call not needed; last check was less than 30 minutes ago.');
        return NextResponse.json({
            ...entry._doc,
            aircraft: aircraftData.response.aircraft,
            flight: currentFlight, // Always include live flight data
            flightHistory: entry.flightHistory,
        });
    }

    // Determine the begin value
    let begin = Math.floor(entry.date.getTime() / 1000); // Default to entry creation date (epoch seconds)
    if (flightHistory.length > 0) {
        const latestFlight = flightHistory.reduce((a, b) =>
            a.lastSeen > b.lastSeen ? a : b
        );
        begin = latestFlight.lastSeen; // Already in epoch seconds
    }

    // Build OpenSky API URL
    const url = `https://opensky-network.org/api/flights/aircraft?icao24=${aircraftData.response.aircraft.mode_s.toLowerCase()}&begin=${begin}&end=${currentEpoch}`;

    // Fetch flight history from OpenSky
    console.log("CALLING OPENSKY");
    const openSkyRes = await fetch(
        url,
        {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${process.env.OPENSKY_USER}:${process.env.OPENSKY_PASS}`).toString('base64'),
            }
        }
    );

    if (!openSkyRes.ok) {
        console.error('OpenSky API error:', await openSkyRes.text());
        return NextResponse.json({
            ...entry._doc,
            aircraft: aircraftData.response.aircraft,
            flight: currentFlight, // Always include live flight data
            flightHistory: entry.flightHistory,
        });
    }

    const openSkyData = await openSkyRes.json();

    // Append new flight history data
    entry.flightHistory = [...openSkyData, ...entry.flightHistory];

    // Sort the flight history by `lastSeen` property in descending order
    entry.flightHistory.sort((a, b) => b.lastSeen - a.lastSeen);

    entry.lastFlightHistoryCheck = new Date(); // Update the lastFlightHistoryCheck timestamp
    await entry.save();

    return NextResponse.json({
        ...entry._doc,
        aircraft: aircraftData.response.aircraft,
        flight: currentFlight, // Always include live flight data
        flightHistory: entry.flightHistory,
    });

}
