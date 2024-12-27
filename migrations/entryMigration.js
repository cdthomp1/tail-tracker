const mongoose = require('mongoose');

// MongoDB URI
const dbUri = 'mongodb+srv://cameronthompson:9YqOCqq7vmAEZnSJ@delta.xx7aicl.mongodb.net/tailtracker?retryWrites=true&w=majority&appName=Delta';

// Migration logic wrapped in a function
const migrateEntries = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

        const entryCollection = mongoose.connection.db.collection('entries');

        console.log('Fetching entries...');
        const entries = await entryCollection.find({}).toArray();

        console.log(`Found ${entries.length} entries. Starting migration...`);

        for (const entry of entries) {
            const sighting = {
                interactionType: entry.interactionType,
                location: entry.location,
                departureAirport: entry.departureAirport,
                destinationAirport: entry.destinationAirport,
                flightNumber: entry.flightNumber,
                notes: entry.notes,
                image: entry.image,
                date: entry.date || new Date(),
            };

            const updatedEntry = {
                $set: {
                    sightings: [sighting],
                    flightHistory: entry.flightHistory || [],
                    lastFlightHistoryCheck: entry.lastFlightHistoryCheck || new Date(),
                },
                $unset: {
                    interactionType: '',
                    location: '',
                    departureAirport: '',
                    destinationAirport: '',
                    flightNumber: '',
                    notes: '',
                    image: '',
                    date: '',
                },
            };

            await entryCollection.updateOne({ _id: entry._id }, updatedEntry);
        }

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Run the migration
migrateEntries();
