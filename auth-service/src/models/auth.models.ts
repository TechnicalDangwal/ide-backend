import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { IAuth, IAuthModel } from '../types/index.js';
import bcrypt from 'bcryptjs';
import { boolean } from 'zod';

const authSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        minlength: 3,
        maxlength: 30,
        required: true,
    },
    isEmailVerified: {
        type: boolean,
        default: false,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: [String],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

authSchema.methods.generateTokens = async function (res: Response) {
    const user = this as IAuth;

    const accessToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET_KEY as string,
        { expiresIn: '7d' }
    );

    user.refreshToken.push(refreshToken);
    await user.save();

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return the access token
    return { accessToken };
};

authSchema.methods.revokeRefreshToken = async function (refreshToken: string) {
    const user = this as IAuth;
    user.refreshToken = user.refreshToken.filter(token => token !== refreshToken);
    await user.save();
};

authSchema.statics.hashPassword = async function (password: string) {
    return await bcrypt.hash(password, 10);
};

authSchema.methods.comparePassword = async function (password: string) {
    const user = this as IAuth;
    return await bcrypt.compare(password, user.password);
};
// Create a model from the schema with the interface
const Auth = mongoose.model<IAuth,IAuthModel>('Auth', authSchema);

export default Auth;
