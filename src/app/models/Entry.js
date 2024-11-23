import mongoose from 'mongoose';

const EntrySchema = new mongoose.Schema({
    registration: { type: String, required: true }, // Aircraft registration
    interactionType: { type: String, enum: ['saw', 'flown'], required: true }, // 'saw' or 'flown'
    location: { type: String }, // For 'saw'
    departureAirport: { type: String }, // For 'flown'
    destinationAirport: { type: String }, // For 'flown'
    flightNumber: { type: String }, // For 'flown'
    notes: { type: String }, // Notes on the flight (optional)
    image: { type: String }, // URL of the uploaded image (optional)
    date: { type: Date, default: Date.now }, // Entry creation date
});

export default mongoose.models.Entry || mongoose.model('Entry', EntrySchema);
