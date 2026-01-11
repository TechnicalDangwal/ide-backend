import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from 'shared';

interface JwtPayload {
  userId: string;
  email: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | any;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies?.accessToken;
    console.log(accessToken,'mai pahuch gya');
    
    if (!accessToken) {
      throw next(new ApiError('Unauthorized', 401));
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET_KEY!
    ) as JwtPayload;

    if(!decoded) {
      throw next(new ApiError('Invalid or expired token',401))
    }
    // attach user to request
    req.user = decoded;
    console.log('i have reached');
    
    next();
  } catch (err: any) {
    return new ApiError('Invalid or expired token', 401);
  }
};
