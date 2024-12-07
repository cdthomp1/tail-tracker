import mongoose from 'mongoose';

const EntrySchema = new mongoose.Schema({
    registration: { type: String, required: true },
    interactionType: { type: String, enum: ['saw', 'flown'], required: true },
    location: { type: String },
    departureAirport: { type: String },
    destinationAirport: { type: String },
    flightNumber: { type: String },
    notes: { type: String },
    image: { type: String },
    date: { type: Date, default: Date.now },
    flightHistory: {
        type: [
            {
                icao24: { type: String, required: true },
                firstSeen: { type: Number, required: true },
                estDepartureAirport: { type: String },
                lastSeen: { type: Number, required: true },
                estArrivalAirport: { type: String },
                callsign: { type: String },
                estDepartureAirportHorizDistance: { type: Number },
                estDepartureAirportVertDistance: { type: Number },
                estArrivalAirportHorizDistance: { type: Number },
                estArrivalAirportVertDistance: { type: Number },
                departureAirportCandidatesCount: { type: Number },
                arrivalAirportCandidatesCount: { type: Number },
            },
        ],
        default: [], // Set an empty array as the default value
    },
    lastFlightHistoryCheck: { type: Date, default: Date.now }
});

export default mongoose.models.Entry || mongoose.model('Entry', EntrySchema);