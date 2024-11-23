'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function EntriesList({ entries, onDelete }) {
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = async (id) => {
        setDeletingId(id); // Show loader for the deleting entry
        await onDelete(id); // Call the onDelete function
        setDeletingId(null); // Reset the loader after deletion
    };

    if (!entries.length) {
        return <p className="text-center text-gray-500">No entries yet!</p>;
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
            {entries.map((entry) => (
                <div
                    key={entry._id}
                    className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
                >
                    <Link
                        href={{
                            pathname: `/details/${entry.registration}`,
                            query: { image: entry.image || '' }, // Pass the entry image as a query parameter
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
                            <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                                <p className="text-sm text-gray-400">No image available</p>
                            </div>
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

                    {/* Action Button */}
                    <div className="px-4 pb-4">
                        {deletingId === entry._id ? (
                            <div className="w-full bg-gray-200 text-center py-2 rounded-md">
                                <span className="text-gray-500">Deleting...</span>
                            </div>
                        ) : (
                            <button
                                className="p-2 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent navigation while deleting
                                    handleDelete(entry._id);
                                }}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
