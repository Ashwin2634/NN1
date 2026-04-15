import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,          // ← very important for login systems
        trim: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true   // automatically adds createdAt & updatedAt
});

// Very important: collection name should be lowercase & plural in most cases
const User = mongoose.model('user', userSchema);  
// or: const User = mongoose.model('user', userSchema);  ← collection will be "users"

export default User;