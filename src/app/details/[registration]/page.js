'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Map, Marker } from 'pigeon-maps';
import FlightHistory from '@/app/components/FlightHistory';

export default function Details({ params: paramsPromise }) {
    const [params, setParams] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSightingIndex, setCurrentSightingIndex] = useState(0);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();

    // Resolve paramsPromise
    useEffect(() => {
        let isMounted = true;

        const resolveParams = async () => {
            try {
                const resolvedParams = await paramsPromise;
                if (isMounted) setParams(resolvedParams);
            } catch (err) {
                console.error('Failed to resolve params:', err);
            }
        };

        resolveParams();

        return () => {
            isMounted = false;
        };
    }, [paramsPromise]);

    // Fetch data once params are resolved
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                if (!params || !params.registration) {
                    throw new Error('Invalid parameters');
                }

                setLoading(true);

                const res = await fetch(`/api/details?registration=${params.registration}`);
                const result = await res.json();

                if (result.error) {
                    throw new Error(result.error);
                }

                if (isMounted) setData(result);
            } catch (err) {
                setError('Failed to fetch data.');
                console.error(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (params) fetchData();

        return () => {
            isMounted = false;
        };
    }, [params]);

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    const { aircraft, flightHistory, sightings, flight } = data || {};
    const currentSighting = sightings?.[currentSightingIndex];
    const photos = [currentSighting?.image, aircraft?.url_photo].filter(Boolean);

    const handleNextPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
    };

    const handlePrevPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleNextSighting = () => {
        setCurrentSightingIndex((prevIndex) => (prevIndex + 1) % sightings.length);
    };

    const handlePrevSighting = () => {
        setCurrentSightingIndex((prevIndex) => (prevIndex - 1 + sightings.length) % sightings.length);
    };

    const userLocale = navigator.language || 'en-US';

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-gray-50 py-6 px-4 sm:px-8">
            <button
                onClick={() => router.back()}
                className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700"
            >
                ← Back
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Aircraft Details</h1>

            {/* Sighting Navigation */}
            {sightings && sightings.length > 1 && (
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={handlePrevSighting}
                        className="px-4 py-2 bg-gray-300 rounded-md shadow hover:bg-gray-400"
                    >
                        ‹ Previous Sighting
                    </button>
                    <p>
                        Sighting {currentSightingIndex + 1} of {sightings.length}
                    </p>
                    <button
                        onClick={handleNextSighting}
                        className="px-4 py-2 bg-gray-300 rounded-md shadow hover:bg-gray-400"
                    >
                        Next Sighting ›
                    </button>
                </div>
            )}

            {/* Details and Image Section */}
            <div className="flex flex-col lg:flex-row lg:gap-6 bg-white shadow-md rounded-lg mb-6">
                <div className="flex-1 p-6 mb-6">
                    {/* Aircraft Info */}
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Airplane Info</h2>
                    {aircraft && (
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600"><strong>Type:</strong> {aircraft.type || 'N/A'}</p>
                            <p className="text-sm text-gray-600"><strong>ICAO Type:</strong> {aircraft.icao_type || 'N/A'}</p>
                            <p className="text-sm text-gray-600"><strong>Manufacturer:</strong> {aircraft.manufacturer || 'N/A'}</p>
                            <p className="text-sm text-gray-600"><strong>Registration:</strong> {aircraft.registration || 'N/A'}</p>
                        </div>
                    )}

                    {/* Sighting Info */}
                    <h2 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Sighting Info</h2>
                    {currentSighting && (
                        <div className="space-y-2">
                            {currentSighting.interactionType === 'flown' && (
                                <>
                                    <p className="text-sm text-gray-600">
                                        <strong>Departure:</strong> {currentSighting.departureAirport || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Arrival:</strong> {currentSighting.destinationAirport || 'N/A'}
                                    </p>
                                </>
                            )}
                            {currentSighting.interactionType !== 'flown' && (
                                <p className="text-sm text-gray-600">
                                    <strong>Location:</strong> {currentSighting.location || 'N/A'}
                                </p>
                            )}
                            <p className="text-sm text-gray-600">
                                <strong>Interaction:</strong>{' '}
                                {currentSighting.interactionType
                                    ? currentSighting.interactionType.charAt(0).toUpperCase() +
                                    currentSighting.interactionType.slice(1)
                                    : 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Date:</strong>{' '}
                                {new Date(currentSighting.date).toLocaleString(userLocale) || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Notes:</strong> {currentSighting.notes || 'N/A'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Image Section */}
                <div className="lg:flex-1 p-6 order-first lg:order-last">
                    <div className="relative w-full h-80">
                        {photos.length > 0 ? (
                            <img
                                src={photos[currentPhotoIndex]}
                                alt={`Photo ${currentPhotoIndex + 1}`}
                                className="w-full h-80 object-cover rounded-md cursor-pointer"
                                onClick={openModal}
                            />
                        ) : (
                            <img
                                src="https://res.cloudinary.com/cameron-projects/image/upload/v1734630411/tailtracker/bhpfq1obxmdxcw7xa4sz.jpg"
                                alt="Stock image of metal toy plane"
                                className="w-full h-80 object-cover rounded-md"
                            />
                        )}

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
                </div>
            </div>

            {/* Map and Flight History */}
            <div className="flex flex-col lg:flex-row lg:gap-6">
                {/* Map Section */}
                <div className="lg:flex-1 bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Active Flight Location</h2>

                    {flight && (
                        <div>
                            <p className="text-sm text-gray-600"><strong>Flight:</strong> {flight.flight || 'N/A'}</p>
                            <p className="text-sm text-gray-600"><strong>Callsign:</strong> {flight.callsign || 'N/A'}</p>
                            <p className="text-sm text-gray-600"><strong>Altitude:</strong> {flight.alt || 'N/A'} ft</p>
                            <p className="text-sm text-gray-600"><strong>Ground Speed:</strong> {flight.gspeed || 'N/A'} knots</p>
                            <p className="text-sm text-gray-600"><strong>Track/Heading:</strong> {flight.track || 'N/A'}°</p>
                            <p className="text-sm text-gray-600">
                                <strong>Origin:</strong> {flight.orig_icao || 'N/A'} ({flight.orig_iata || 'N/A'})
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Destination:</strong> {flight.dest_icao || 'N/A'} ({flight.dest_iata || 'N/A'})
                            </p>

                            <div style={{ width: '100%', height: '26rem' }}>
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
                        </div>
                    )}

                    {!flight && <p>No active flight</p>}
                </div>

                {/* Flight History Table */}
                <FlightHistory flightHistory={flightHistory} />
            </div>

            {/* Modal for Enlarged Image */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="relative">
                        <button
                            className="absolute top-4 right-4 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700"
                            onClick={closeModal}
                        >
                            ✕
                        </button>
                        <img
                            src={photos[currentPhotoIndex]}
                            alt={`Enlarged Photo ${currentPhotoIndex + 1}`}
                            className="max-w-full max-h-screen rounded-lg"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
