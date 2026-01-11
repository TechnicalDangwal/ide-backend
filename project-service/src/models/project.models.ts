import mongoose, { Model, Models } from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 6,
        maxLength: 30,
        required: true,
    },
    language: {
        type: String,
        required: true
    },
    store: {
        type: String,
        default: '',
    },
    authId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
const Project = mongoose.model<Models>('project', projectSchema);
export default Project;
