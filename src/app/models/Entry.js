import mongoose from 'mongoose';

const SightingSchema = new mongoose.Schema({
    interactionType: { type: String, enum: ['saw', 'flown'], required: true },
    location: { type: String },
    departureAirport: { type: String },
    destinationAirport: { type: String },
    flightNumber: { type: String },
    notes: { type: String },
    image: { type: String },
    date: { type: Date, default: Date.now },
});

const EntrySchema = new mongoose.Schema({
    registration: { type: String, required: true },
    sightings: { type: [SightingSchema], default: [] }, // Array of sightings
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
        default: [], // Shared flight history for the entire entry
    },
    lastFlightHistoryCheck: { type: Date, default: Date.now },
    userId: { type: String, required: true }, // Link to the User model
});

export default mongoose.models.Entry || mongoose.model('Entry', EntrySchema);
