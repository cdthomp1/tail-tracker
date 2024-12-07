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
        let isMounted = true;
        const fetchData = async () => {
            try {
                setLoading(true);
                const resolvedParams = await paramsPromise;
                if (!resolvedParams || !resolvedParams.registration) {
                    throw new Error('Invalid parameters');
                }
                const { registration } = resolvedParams;

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
            isMounted = false;
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

    const mockFlightHistory = [
        {
            icao24: "ac048d",
            firstSeen: 1733322360,
            estDepartureAirport: "KSLC",
            lastSeen: 1733326918,
            estArrivalAirport: "KOAK",
            callsign: "SWA897  ",
            estDepartureAirportHorizDistance: 1053,
            estDepartureAirportVertDistance: 92,
            estArrivalAirportHorizDistance: 1479,
            estArrivalAirportVertDistance: 94,
            departureAirportCandidatesCount: 1,
            arrivalAirportCandidatesCount: 5
        },
        {
            icao24: "ac048d",
            firstSeen: 1733271860,
            estDepartureAirport: "KDAL",
            lastSeen: 1733280381,
            estArrivalAirport: "KSLC",
            callsign: "SWA3390 ",
            estDepartureAirportHorizDistance: 2834,
            estDepartureAirportVertDistance: 179,
            estArrivalAirportHorizDistance: 1940,
            estArrivalAirportVertDistance: 84,
            departureAirportCandidatesCount: 0,
            arrivalAirportCandidatesCount: 3
        },
        {
            icao24: "ac048d",
            firstSeen: 1733250191,
            estDepartureAirport: "KSFO",
            lastSeen: 1733257782,
            estArrivalAirport: "KDEN",
            callsign: "SWA2712 ",
            estDepartureAirportHorizDistance: 504,
            estDepartureAirportVertDistance: 42,
            estArrivalAirportHorizDistance: 5548,
            estArrivalAirportVertDistance: 17,
            departureAirportCandidatesCount: 0,
            arrivalAirportCandidatesCount: 17
        }
    ];

    const userLocale = navigator.language || 'en-US';

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-8">
            <button
                onClick={() => router.back()}
                className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700"
            >
                ← Back
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Aircraft Details</h1>

            {/* Row 1: Airplane Info and Sighting Info stacked on the left, Pictures on the right */}
            <div className="flex flex-wrap lg:flex-nowrap gap-6 mb-6">
                {/* Left Column: Airplane Info and Sighting Info */}
                <div className="flex-1">
                    {/* Airplane Info */}
                    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Airplane Info</h2>
                        {aircraft && (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600"><strong>Type:</strong> {aircraft.type || 'N/A'}</p>
                                <p className="text-sm text-gray-600"><strong>ICAO Type:</strong> {aircraft.icao_type || 'N/A'}</p>
                                <p className="text-sm text-gray-600"><strong>Manufacturer:</strong> {aircraft.manufacturer || 'N/A'}</p>
                                <p className="text-sm text-gray-600"><strong>Registration:</strong> {aircraft.registration || 'N/A'}</p>
                            </div>
                        )}
                    </div>

                    {/* Sighting Info */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Sighting Info</h2>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600"><strong>Location:</strong> {location || 'N/A'}</p>
                            <p className="text-sm text-gray-600"><strong>Interaction:</strong> {interactionType || 'N/A'}</p>
                            <p className="text-sm text-gray-600"><strong>Date:</strong> {new Date(date).toLocaleString(userLocale) || 'N/A'}</p>
                            <p className="text-sm text-gray-600"><strong>Notes:</strong> {notes}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Pictures */}
                <div className="flex-1 bg-white shadow-md rounded-lg p-6">
                    <div className="relative w-full h-80">
                        {photos.length > 0 ? (
                            <>
                                <img
                                    src={photos[currentPhotoIndex]}
                                    alt={`Photo ${currentPhotoIndex + 1}`}
                                    className="w-full h-80 object-cover rounded-md"
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
                            </>
                        ) : (
                            <p className="text-center text-gray-500">No photos available</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Row 2: Map + Flight History Table */}
            <div className="bg-white shadow-md rounded-lg p-6 flex flex-wrap lg:flex-nowrap gap-6">
                {/* Map Section */}
                {flight && (

                    <div className="flex-1">
                        <div className="flex-1 mb-1">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Flight Location</h2>
                            <div >
                                <h3 className="font-semibold text-gray-800">Current Flight</h3>
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
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Map</h2>
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
                                            transform: `rotate(${flight.track - 90}deg)`
                                        }}
                                    />
                                </Marker>
                            </Map>
                        </div>
                    </div>
                )}

                {/* Flight History Table */}
                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Flight History</h2>
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2">Callsign</th>
                                <th className="border px-4 py-2">Departure Airport</th>
                                <th className="border px-4 py-2">Departure Time</th>
                                <th className="border px-4 py-2">Arrival Airport</th>
                                <th className="border px-4 py-2">Arrival Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockFlightHistory.map((flight, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2">{flight.callsign?.trim() || 'N/A'}</td>
                                    <td className="border px-4 py-2">{flight.estDepartureAirport || 'N/A'}</td>
                                    <td className="border px-4 py-2">
                                        {flight.firstSeen
                                            ? new Date(flight.firstSeen * 1000).toLocaleString()
                                            : 'N/A'}
                                    </td>
                                    <td className="border px-4 py-2">{flight.estArrivalAirport || 'N/A'}</td>
                                    <td className="border px-4 py-2">
                                        {flight.lastSeen
                                            ? new Date(flight.lastSeen * 1000).toLocaleString()
                                            : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
}
