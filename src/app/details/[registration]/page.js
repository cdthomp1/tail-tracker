'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Map, Marker } from 'pigeon-maps';

export default function Details({ params: paramsPromise }) {
    const [params, setParams] = useState(null);
    const [aircraftData, setAircraftData] = useState(null);
    const [flightPosition, setFlightPosition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const searchParams = useSearchParams();
    const entryImage = searchParams.get('image');
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Resolve paramsPromise
                const resolvedParams = await paramsPromise;
                if (!resolvedParams || !resolvedParams.registration) {
                    throw new Error('Invalid parameters');
                }
                setParams(resolvedParams);

                const { registration } = resolvedParams;

                // Fetch Aircraft Data
                const aircraftRes = await fetch(`https://api.adsbdb.com/v0/aircraft/${registration}`);
                const aircraftData = await aircraftRes.json();
                setAircraftData(aircraftData.response.aircraft);

                // Fetch Flight Position
                const flightRes = await fetch(
                    `https://fr24api.flightradar24.com/api/live/flight-positions/full?registrations=${registration}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_FLIGHTRADAR_API_KEY}`,
                            'Accept-Version': 'v1',
                        },
                    }
                );
                const flightData = await flightRes.json();
                if (flightData.data && flightData.data.length > 0) {
                    setFlightPosition(flightData.data[0]);
                }
            } catch (err) {
                setError('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [paramsPromise]);

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    const {
        type,
        icao_type,
        manufacturer,
        mode_s,
        registration,
        registered_owner_country_name,
        registered_owner,
        url_photo: apiPhoto,
    } = aircraftData || {};

    const photos = [];
    if (entryImage) photos.push(entryImage);
    if (apiPhoto) photos.push(apiPhoto);

    const handleNextPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
    };

    const handlePrevPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
    };

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

                {/* Aircraft Details */}
                <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-600">
                        <strong>Type:</strong> {type || 'No information provided at this time'}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>ICAO Type:</strong> {icao_type || 'No information provided at this time'}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Manufacturer:</strong> {manufacturer || 'No information provided at this time'}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Mode S:</strong> {mode_s || 'No information provided at this time'}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Registration:</strong> {registration || 'No information provided at this time'}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Country:</strong> {registered_owner_country_name || 'No information provided at this time'}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Owner:</strong> {registered_owner || 'No information provided at this time'}
                    </p>
                </div>

                {/* Current Flight Section */}
                {flightPosition ? (
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Current Flight</h2>
                        <p className="text-sm text-gray-600">
                            <strong>Flight:</strong> {flightPosition.flight || 'No information provided'}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Callsign:</strong> {flightPosition.callsign || 'No information provided'}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Altitude:</strong> {flightPosition.alt || 'No information provided'} ft
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Ground Speed:</strong> {flightPosition.gspeed || 'No information provided'} knots
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Vertical Speed:</strong> {flightPosition.vspeed + " ft/min" || 'No information provided'}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Track:</strong> {flightPosition.track || 'No information provided'}°
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Origin:</strong> {flightPosition.orig_icao || 'No information provided'} ({flightPosition.orig_iata || 'N/A'})
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Destination:</strong> {flightPosition.dest_icao || 'No information provided'} ({flightPosition.dest_iata || 'N/A'})
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>ETA:</strong> {flightPosition.eta || 'No information provided'}
                        </p>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No live flight data available.</p>
                )}

                {/* Map Section */}
                {flightPosition && (
                    <div className="w-full h-64">
                        <Map
                            defaultCenter={[flightPosition.lat, flightPosition.lon]}
                            defaultZoom={6}
                            style={{ width: '100%', height: '100%' }}
                        >
                            <Marker
                                width={50}
                                anchor={[flightPosition.lat, flightPosition.lon]}
                            >
                                <img
                                    src="/plane-solid.svg"
                                    alt="Airplane Icon"
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        transform: `rotate(${flightPosition.track - 90}deg)`,
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
