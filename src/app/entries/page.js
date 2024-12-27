'use client';

import { useState, useEffect } from 'react';
import JournalForm from '../components/JournalForm';
import EntriesList from '../components/EntriesList';

export default function Page() {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        fetch('/api/entries')
            .then((res) => res.json())
            .then((data) => setEntries(data));
    }, []);

    const addEntry = async (entry) => {
        // Ensure the entry includes a sightings array
        const formattedEntry = {
            ...entry,
            sightings: entry.sightings || [
                {
                    interactionType: entry.interactionType || 'saw',
                    location: entry.location || '',
                    departureAirport: entry.departureAirport || '',
                    destinationAirport: entry.destinationAirport || '',
                    flightNumber: entry.flightNumber || '',
                    notes: entry.notes || '',
                    image: entry.image || '',
                    date: entry.date || new Date(),
                },
            ],
        };

        const res = await fetch('/api/entries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formattedEntry),
        });
        const newEntry = await res.json();
        setEntries((prev) => [...prev, newEntry]);
    };

    const deleteEntry = async (id) => {
        await fetch(`/api/entries/${id}`, {
            method: 'DELETE',
        });
        setEntries((prev) => prev.filter((entry) => entry._id !== id));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-gray-50 flex flex-col items-center py-6 px-4 sm:px-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                TailTracker
            </h1>
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-4 mb-6">
                {/* Pass the new schema format to the JournalForm */}
                <JournalForm onAddEntry={addEntry} />
            </div>
            <div className="w-full max-w-6xl">
                {/* Ensure EntriesList can handle sightings */}
                <EntriesList entries={entries} onDelete={deleteEntry} />
            </div>
        </div>
    );
}
