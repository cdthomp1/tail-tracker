'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Map, Marker } from 'pigeon-maps';

export default function Details({ params: paramsPromise }) {
    const [params, setParams] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const router = useRouter();

    useEffect(() => {
        let isMounted = true; // To prevent state updates after unmount
        const fetchData = async () => {
            try {
                setLoading(true);

                const resolvedParams = await paramsPromise;
                if (!resolvedParams || !resolvedParams.registration) {
                    throw new Error('Invalid parameters');
                }
                const { registration } = resolvedParams;

                // Fetch details data
                const res = await fetch(`/api/details?registration=${registration}`);
                const result = await res.json();

                if (result.error) {
                    throw new Error(result.error);
                }

                if (isMounted) {
                    setParams(resolvedParams);
                    setData(result);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to fetch data.');
                    console.error(err);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false; // Cleanup flag
        };
    }, [paramsPromise]);

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    const { aircraft, flight, image, location, date, notes, interactionType } = data || {};
    const photos = [image, aircraft?.url_photo].filter(Boolean);

    const handleNextPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
    };

    const handlePrevPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
    };

    const userLocale = navigator.language || 'en-US'; // Fallback to 'en-US'


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6 px-4 sm:px-8">
            <button
                onClick={() => router.back()}
                className="self-start mb-4 px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700"
            >
                ← Back
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Aircraft Details</h1>

            <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
                {/* Image Carousel */}
                {photos.length > 0 ? (
                    <div className="relative w-full h-64 mb-6">
                        <img
                            src={photos[currentPhotoIndex]}
                            alt={`Photo ${currentPhotoIndex + 1}`}
                            className="w-full h-64 object-cover rounded-md"
                        />
                        {photos.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevPhoto}
                                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                                >
                                    ‹
                                </button>
                                <button
                                    onClick={handleNextPhoto}
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                                >
                                    ›
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No photos available</p>
                )}

                {/* Documentation Details */}
                <div className="space-y-2 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Interaction Details</h2>
                    <p className="text-sm text-gray-600"><strong>Location:</strong> {location || 'N/A'}</p>
                    <p className="text-sm text-gray-600">
                        <strong>Interaction:</strong>{' '}
                        {interactionType ? interactionType.charAt(0).toUpperCase() + interactionType.slice(1) : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600"><strong>Date:</strong> {new Date(date).toLocaleString() || 'N/A'}</p>
                    <p className="text-sm text-gray-600"><strong>Notes:</strong> {notes || 'N/A'}</p>
                </div>

                {/* Aircraft Details */}
                {aircraft && (
                    <div className="space-y-2 mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Aircraft Details</h2>
                        <p className="text-sm text-gray-600"><strong>Type:</strong> {aircraft.type || 'N/A'}</p>
                        <p className="text-sm text-gray-600"><strong>ICAO Type:</strong> {aircraft.icao_type || 'N/A'}</p>
                        <p className="text-sm text-gray-600"><strong>Manufacturer:</strong> {aircraft.manufacturer || 'N/A'}</p>
                        <p className="text-sm text-gray-600"><strong>Mode S:</strong> {aircraft.mode_s || 'N/A'}</p>
                        <p className="text-sm text-gray-600"><strong>Registration:</strong> {aircraft.registration || 'N/A'}</p>
                        <p className="text-sm text-gray-600"><strong>Country:</strong> {aircraft.registered_owner_country_name || 'N/A'}</p>
                        <p className="text-sm text-gray-600"><strong>Owner:</strong> {aircraft.registered_owner || 'N/A'}</p>
                    </div>
                )}


                {/* Current Flight Section */}
                {flight ? (
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Current Flight</h2>
                        <p className="text-sm text-gray-600"><strong>Flight:</strong> {flight.flight || 'N/A'}</p>
                        <p className="text-sm text-gray-600"><strong>Callsign:</strong> {flight.callsign || 'N/A'}</p>
                        <p className="text-sm text-gray-600"><strong>Altitude:</strong> {flight.alt || 'N/A'} ft</p>
                        <p className="text-sm text-gray-600"><strong>Ground Speed:</strong> {flight.gspeed || 'N/A'} knots</p>
                        <p className="text-sm text-gray-600"><strong>Track/Heading:</strong> {flight.track || 'N/A'}°</p>
                        <p className="text-sm text-gray-600"><strong>Origin:</strong> {flight.orig_icao || 'N/A'} ({flight.orig_iata || 'N/A'})</p>
                        <p className="text-sm text-gray-600"><strong>Destination:</strong> {flight.dest_icao || 'N/A'} ({flight.dest_iata || 'N/A'})</p>
                        <p className="text-sm text-gray-600">
                            <strong>ETA:</strong>{' '}
                            {flight.eta ?
                                new Intl.DateTimeFormat(userLocale, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    timeZoneName: 'short'
                                }).format(new Date(flight.eta))
                                : 'N/A'}
                        </p>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No live flight data available.</p>
                )}

                {/* Map Section */}
                {flight && (
                    <div className="w-full h-64">
                        <Map
                            defaultCenter={[flight.lat, flight.lon]}
                            defaultZoom={6}
                            style={{ width: '100%', height: '100%' }}
                        >
                            <Marker anchor={[flight.lat, flight.lon]}>
                                <img
                                    src="/plane-solid.svg"
                                    alt="Airplane Icon"
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        transform: `rotate(${flight.track - 90}deg)`,
                                    }}
                                />
                            </Marker>
                        </Map>
                    </div>
                )}
            </div>
        </div>
    );
}
