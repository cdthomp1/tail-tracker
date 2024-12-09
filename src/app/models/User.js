import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true, // Ensures no duplicate userId
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no duplicate email
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically sets creation date
    },
    displayName: {
        type: String,
        default: null, // Optional user display name
    },
    profileImageUrl: {
        type: String,
        default: null, // URL for the user's profile image
    },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
