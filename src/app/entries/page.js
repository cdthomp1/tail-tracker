'use client';

import { useState, useEffect } from 'react';
import JournalForm from '../components/JournalForm';
import EntriesList from '../components/EntriesList';

export default function page() {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        fetch('/api/entries')
            .then((res) => res.json())
            .then((data) => setEntries(data));
    }, []);

    const addEntry = async (entry) => {
        const res = await fetch('/api/entries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry),
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
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6 px-4 sm:px-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                TailTracker
            </h1>
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-4 mb-6">
                <JournalForm onAddEntry={addEntry} />
            </div>
            <div className="w-full max-w-6xl">
                <EntriesList entries={entries} onDelete={deleteEntry} />
            </div>
        </div>
    );
}