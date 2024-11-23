'use client';

export default function EntriesList({ entries, onDelete }) {
    if (!entries.length) return <p className="text-center text-gray-500">No entries yet!</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {entries.map((entry) => (
                <div
                    key={entry._id}
                    className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden"
                >
                    {/* Image */}
                    {entry.image && (
                        <img
                            src={entry.image}
                            alt="Aircraft"
                            className="w-full h-48 object-cover"
                        />
                    )}

                    {/* Card Content */}
                    <div className="p-4">
                        {/* Registration */}
                        <h3 className="text-lg font-bold text-gray-800">{entry.registration || 'Unknown Aircraft'}</h3>
                        {/* Interaction Type */}
                        <p className="text-sm text-gray-600 mb-2">
                            {entry.interactionType === 'saw' ? 'Saw' : 'Flown'}
                        </p>

                        {/* Additional Details */}
                        {entry.interactionType === 'saw' && (
                            <p className="text-sm text-gray-700">
                                <strong>Location:</strong> {entry.location || 'N/A'}
                            </p>
                        )}
                        {entry.interactionType === 'flown' && (
                            <>
                                <p className="text-sm text-gray-700">
                                    <strong>Departure:</strong> {entry.departureAirport || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <strong>Destination:</strong> {entry.destinationAirport || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <strong>Flight Number:</strong> {entry.flightNumber || 'N/A'}
                                </p>
                            </>
                        )}
                        <p className="text-sm text-gray-700 mt-2">
                            <strong>Notes:</strong> {entry.notes || 'No notes provided'}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            {entry.date && new Date(entry.date).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-4 pb-4">
                        <button
                            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
                            onClick={() => onDelete(entry._id)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
