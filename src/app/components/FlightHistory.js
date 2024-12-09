export default function FlightHistory({ flightHistory }) {
    if (!flightHistory || flightHistory.length === 0) {
        return <p>No flight history available</p>;
    }

    return (
        <div className="lg:flex-1 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Flight History</h2>
            <div className="overflow-x-auto max-h-[800px] overflow-y-auto">
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
                        {flightHistory.map((flight, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{flight.callsign || 'N/A'}</td>
                                <td className="border px-4 py-2">{flight.estDepartureAirport || 'N/A'}</td>
                                <td className="border px-4 py-2">{new Date(flight.firstSeen * 1000).toLocaleString() || 'N/A'}</td>
                                <td className="border px-4 py-2">{flight.estArrivalAirport || 'N/A'}</td>
                                <td className="border px-4 py-2">{new Date(flight.lastSeen * 1000).toLocaleString() || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
