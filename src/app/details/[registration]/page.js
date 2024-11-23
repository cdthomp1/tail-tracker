'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Details({ params: paramsPromise }) {
    const [params, setParams] = useState(null);
    const [aircraftData, setAircraftData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const searchParams = useSearchParams(); // Get query parameters
    const entryImage = searchParams.get('image'); // Extract the image from query
    const router = useRouter(); // Router instance for navigation

    useEffect(() => {
        const fetchParamsAndData = async () => {
            try {
                // Resolve the params Promise
                const resolvedParams = await paramsPromise;
                setParams(resolvedParams);

                // Extract registration from params and fetch aircraft data
                const { registration } = resolvedParams;
                const res = await fetch(`https://api.adsbdb.com/v0/aircraft/${registration}`);
                const data = await res.json();
                setAircraftData(data.response.aircraft);
            } catch (err) {
                setError('Failed to fetch aircraft data.');
            } finally {
                setLoading(false);
            }
        };

        fetchParamsAndData();
    }, [paramsPromise]);

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    const {
        type,
        icao_type,
        manufacturer,
        mode_s,
        registration: reg,
        registered_owner_country_name,
        registered_owner,
        url_photo: apiPhoto,
    } = aircraftData || {};

    // Gather photos for the carousel
    const photos = [];
    if (entryImage) photos.push(entryImage); // Entry photo
    if (apiPhoto) photos.push(apiPhoto); // API photo

    const handleNextPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
    };

    const handlePrevPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6 px-4 sm:px-8">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="self-start mb-4 px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition-colors"
            >
                ← Back
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Aircraft Details
            </h1>

            <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
                {/* Photo Carousel */}
                {photos.length > 0 ? (
                    <div className="relative w-full h-48 mb-6">
                        <img
                            src={photos[currentPhotoIndex]}
                            alt={`Photo ${currentPhotoIndex + 1}`}
                            className="w-full h-48 object-cover rounded-md"
                        />
                        {/* Carousel Controls */}
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
                    <p className="text-center text-gray-500">No photos provided at this time</p>
                )}

                {/* Aircraft Details */}
                <div className="space-y-2">
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
                        <strong>Registration:</strong> {reg || 'No information provided at this time'}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Country:</strong> {registered_owner_country_name || 'No information provided at this time'}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Owner:</strong> {registered_owner || 'No information provided at this time'}
                    </p>
                </div>
            </div>
        </div>
    );
}
