import { email, z, ZodError } from 'zod';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import AuthDB from '../models/auth.models.js';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ApiError, ApiResponse, asyncHandler, rabbitmq } from 'shared'
import Redis from 'ioredis';
import { redis } from '../utils/redis.js';
import { access } from 'fs';

// Zod schema for validating login data
const loginSchema = z.object({
    email: z.string().min(1, 'Email is required'), // Validate username is not empty
    password: z.string().min(6, 'Password should be at least 6 characters'), // Validate password length
});

const login: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Login attempt:', req.body);
        const { email, password } = loginSchema.parse(req.body);

        const user = await AuthDB.findOne({ email });
        if (!user) {
            throw next(new ApiError('User not found', 404));

        }

        console.log(await bcrypt.hash(password, 10), 'password');

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            throw next(new ApiError('Invalid credentials', 401));
        }

        const { accessToken } = await user.generateTokens(res);

        return res.status(200).json(new ApiResponse(200, 'Login successful', { accessToken }));
    } catch (err) {
        if (err instanceof z.ZodError) {
            throw next(new ApiError(JSON.parse((err as ZodError).message).map((e: Error) => e.message), 400));
        }
        throw err;
    }
});

const RegisterSchema = z.object({
    username: z
        .string()
        .min(3, { message: 'Username must be at least 3 characters long' })
        .max(30, { message: 'Username cannot be longer than 30 characters' })
        .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username must contain only letters, numbers, and underscores' }),
    profilePic: z.string({
        error: "profilePic should be string"
    }).optional(),
    email: z.string().email({ message: 'Invalid email address' }).regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Invalid email format' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' })
        .max(100, { message: 'Password cannot be longer than 100 characters' }),
    confirmPassword: z.string().min(6, { message: 'Confirm Password must be at least 6 characters long' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
});

// Register Controller wrapped with asyncHandler
const register: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = RegisterSchema.safeParse(req.body);
    
    if (!result.success) {
        throw next(new ApiError(JSON.parse(result.error.message).map((e: Error) => e.message), 400));
    }

    const { username, email, profilePic, password } = result.data;

    // Check if user already exists
    const existingUser = await AuthDB.findOne({ email });
    if (existingUser) {
        throw next(new ApiError('Email already exists.', 400));
    }

    // Hash the password
    const hashedPassword = await AuthDB.hashPassword(password);

    const newUser = new AuthDB({
        email,
        password: hashedPassword,
    });

    await newUser.save();
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    console.log(emailVerificationToken, 'token');

    const hash = crypto.createHash('sha256').update(emailVerificationToken!).digest('hex');
    redis.setex(`emailVerificationToken:${hash}`, 3600, email);
    rabbitmq.publishFanout('user.registered', { userId: newUser._id, email, username, profilePic, emailVerificationToken });

    return res.status(201).json(new ApiResponse(201, 'User registered successfully. A verification email has been sent. Please check your inbox to verify your account.'));
});

const verifyEmail: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token = req.params.token
    if (!token) {
        throw new ApiError('Invalid or missing token', 400);
    }

    const hash = crypto.createHash('sha256').update(token).digest('hex');
    let email = await redis.get(`emailVerificationToken:${hash}`)
    if (!email) {
        throw new ApiError('Invalid or expired token', 400);
    }

    let user = await AuthDB.findOne({ email });

    if (!user) {
        throw new ApiError('Invalid Token', 404);
    }

    let accessToken = await user.generateTokens(res)
    user.isEmailVerified = true;
    await user.save();
    redis.del(`emailVerificationToken:${hash}`);

    return res.status(200).json(new ApiResponse(200, 'Email verified successfully.', {
        accessToken
    }));
})

const logout: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies['refreshToken']

    if(refreshToken){
        const userId = req.user._id
        const user = await AuthDB.findById(userId)
        user?.revokeRefreshToken(refreshToken)
    }

    res.clearCookie('accessToken',{
        httpOnly: true,
        secure: true,
    })

    res.status(200).json(new ApiResponse(200,'Logout Successfully'))
})

const verify: RequestHandler = asyncHandler((req: Request, res: Response) => {
    res.setHeader('X-User-Id', req.user.userId);
    res.setHeader('X-User-Email', req.user.email);

    res.sendStatus(200);
  })

export { login, register, verifyEmail, logout, verify };