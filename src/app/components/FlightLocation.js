import { Map, Marker } from 'pigeon-maps';

export default function FlightLocation({ flight }) {
    if (!flight) return <p>No active flight</p>;

    return (
        <div className="lg:flex-1 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Flight Location</h2>
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
    );
}
