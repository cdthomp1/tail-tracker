'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function EntriesList({ entries, onDelete }) {
    const [deletingId, setDeletingId] = useState(null);
    const [sortOption, setSortOption] = useState('dateDescending'); // Default sorting option

    const handleDelete = async (id) => {
        setDeletingId(id); // Show loader for the deleting entry
        await onDelete(id); // Call the onDelete function
        setDeletingId(null); // Reset the loader after deletion
    };

    // Apply sorting to the entries based on the selected option
    const sortedEntries = [...entries].sort((a, b) => {
        if (sortOption === 'dateDescending') {
            return new Date(b.date) - new Date(a.date);
        } else if (sortOption === 'dateAscending') {
            return new Date(a.date) - new Date(b.date);
        } else if (sortOption === 'registration') {
            return a.registration.localeCompare(b.registration);
        }
        return 0;
    });

    if (!entries.length) {
        return <p className="text-center text-gray-500">No entries yet!</p>;
    }

    return (
        <div className="p-4">
            {/* Sorting Options */}
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Entries</h2>
                <div className="flex items-center space-x-2">
                    <label
                        htmlFor="sortOptions"
                        className="text-sm text-gray-600 font-medium"
                    >
                        Sort by:
                    </label>
                    <select
                        id="sortOptions"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="dateDescending">Date (Newest First)</option>
                        <option value="dateAscending">Date (Oldest First)</option>
                        <option value="registration">Registration (A-Z)</option>
                    </select>
                </div>
            </div>

            {/* Entries List */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedEntries.map((entry) => (
                    <div
                        key={entry._id}
                        className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
                    >
                        <Link
                            href={{
                                pathname: `/details/${entry.registration}`,
                            }}
                            className="block"
                        >
                            {/* Image */}
                            {entry.image ? (
                                <img
                                    src={entry.image}
                                    alt="Aircraft"
                                    className="w-full h-48 object-cover"
                                />
                            ) : (
                                <img
                                    src="https://res.cloudinary.com/cameron-projects/image/upload/v1734630411/tailtracker/bhpfq1obxmdxcw7xa4sz.jpg"
                                    alt="Aircraft"
                                    className="w-full h-48 object-cover"
                                />
                            )}

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-800">
                                    {entry.registration || 'Unknown Aircraft'}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Interaction: {entry.interactionType === 'saw' ? 'Saw' : 'Flown'}
                                </p>
                                <p className="text-sm text-gray-700 mt-2">
                                    <strong>Notes:</strong> {entry.notes || 'No notes provided'}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    {entry.date && new Date(entry.date).toLocaleDateString()}
                                </p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
