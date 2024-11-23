'use client';

import { useState } from 'react';

export default function JournalForm({ onAddEntry }) {
    const [registration, setRegistration] = useState('');
    const [interactionType, setInteractionType] = useState('saw'); // 'saw' or 'flown'
    const [location, setLocation] = useState(''); // For 'saw'
    const [departureAirport, setDepartureAirport] = useState(''); // For 'flown'
    const [destinationAirport, setDestinationAirport] = useState(''); // For 'flown'
    const [flightNumber, setFlightNumber] = useState(''); // For 'flown'
    const [notes, setNotes] = useState(''); // Flight notes
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state

    const handleImageUpload = async (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        return new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        let imageUrl = '';
        if (image) {
            const base64Image = await handleImageUpload(image);
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file: base64Image }),
            });
            const data = await res.json();
            imageUrl = data.imageUrl;
        }

        const newEntry = {
            registration,
            interactionType,
            location: interactionType === 'saw' ? location : null,
            departureAirport: interactionType === 'flown' ? departureAirport : null,
            destinationAirport: interactionType === 'flown' ? destinationAirport : null,
            flightNumber: interactionType === 'flown' ? flightNumber : null,
            notes: interactionType === 'flown' ? notes : null,
            image: imageUrl,
        };

        await onAddEntry(newEntry);

        // Clear form fields after submission
        setRegistration('');
        setInteractionType('saw');
        setLocation('');
        setDepartureAirport('');
        setDestinationAirport('');
        setFlightNumber('');
        setNotes('');
        setImage(null);
        setLoading(false); // Stop loading
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4"
        >
            <h2 className="text-xl font-semibold text-gray-800">TailTracker Entry</h2>

            {loading && <p className="text-center text-indigo-600">Submitting...</p>}

            {/* Form Fields */}
            {!loading && (
                <>
                    <div>
                        <label
                            htmlFor="registration"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Aircraft Registration
                        </label>
                        <input
                            id="registration"
                            type="text"
                            placeholder="Aircraft Registration"
                            value={registration}
                            onChange={(e) => setRegistration(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <fieldset className="space-y-2">
                        <legend className="text-sm font-medium text-gray-700">
                            Saw or Flown
                        </legend>
                        <div className="flex items-center space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="interactionType"
                                    value="saw"
                                    checked={interactionType === 'saw'}
                                    onChange={(e) => setInteractionType(e.target.value)}
                                    className="form-radio text-indigo-600"
                                />
                                <span className="ml-2 text-gray-700">Saw</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="interactionType"
                                    value="flown"
                                    checked={interactionType === 'flown'}
                                    onChange={(e) => setInteractionType(e.target.value)}
                                    className="form-radio text-indigo-600"
                                />
                                <span className="ml-2 text-gray-700">Flown</span>
                            </label>
                        </div>
                    </fieldset>

                    {interactionType === 'saw' && (
                        <div>
                            <label
                                htmlFor="location"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Where did you see the aircraft?
                            </label>
                            <input
                                id="location"
                                type="text"
                                placeholder="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                    )}

                    {interactionType === 'flown' && (
                        <>
                            <div>
                                <label
                                    htmlFor="departureAirport"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Departure Airport
                                </label>
                                <input
                                    id="departureAirport"
                                    type="text"
                                    placeholder="Departure Airport"
                                    value={departureAirport}
                                    onChange={(e) => setDepartureAirport(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="destinationAirport"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Destination Airport
                                </label>
                                <input
                                    id="destinationAirport"
                                    type="text"
                                    placeholder="Destination Airport"
                                    value={destinationAirport}
                                    onChange={(e) => setDestinationAirport(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="flightNumber"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Flight Number
                                </label>
                                <input
                                    id="flightNumber"
                                    type="text"
                                    placeholder="Flight Number"
                                    value={flightNumber}
                                    onChange={(e) => setFlightNumber(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="notes"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Notes on the Flight
                                </label>
                                <textarea
                                    id="notes"
                                    placeholder="Notes on the flight"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                ></textarea>
                            </div>
                        </>
                    )}

                    <div>
                        <label
                            htmlFor="image"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Upload Image
                        </label>
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="mt-1 block w-full text-gray-600"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:ring focus:ring-indigo-300"
                    >
                        Add Entry
                    </button>
                </>
            )}
        </form>
    );
}
