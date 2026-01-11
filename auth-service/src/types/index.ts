import { Document, Model, Schema } from 'mongoose';
import { Response } from 'express';

// Define the interface for the Auth document
export interface IAuth extends Document {
    email: string;
    isEmailVerified: boolean;
    password: string;
    refreshToken: string[];
    userId: Schema.Types.ObjectId;

    generateTokens(res: Response): Promise<{ accessToken: string }>;
    revokeRefreshToken(refreshToken: string): Promise<void>;
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string): Promise<boolean>;
}

export interface IAuthModel extends Model<IAuth> {
  hashPassword(password: string): Promise<IAuth | null>;
}
