import mongoose, { Model, Models } from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        minlength: 3,
        maxlength: 30,
        required: true,
    },
    username: {
        type: String,
        unique: true,
    },
    profilePic: {
        type: String,
        default: '',
    },
    authId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth' },
});
const User = mongoose.model<Models>('UserProfile', userSchema);
export default User;
