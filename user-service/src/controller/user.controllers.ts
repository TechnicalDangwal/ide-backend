import { Request, RequestHandler, Response } from "express";
import User from "../models/user.models.js";
import { ApiError, ApiResponse, asyncHandler } from "shared";
import cloudinary from "../utils/cloudinary.js";
import { JwtPayload } from "jsonwebtoken";
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | any;
    }
  }
}
const getProfile: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers['x-user-id']
    console.log(req.headers,'userId');
    
    const user = await User.findOne({authId:userId});
    if (!user) {
        throw new ApiError("Invalid user ID", 400);
    }

    return res.status(200).json(new ApiResponse(200, "User profile retrieved successfully", user));
})

const uploadAvatar: RequestHandler = asyncHandler(async (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000);

  const folder = `users/avatars`;

  const signature = await cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
    },
    process.env.CLOUDINARY_API_SECRET!
  );

  return res.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    signature,
    folder,
  });
});

const deleteImg: RequestHandler =  asyncHandler(async (req:Request, res: Response) => {
  const { public_id } = req.body; // public_id of the image in Cloudinary

  if (!public_id) {
    return res.status(400).json({ message: 'public_id is required' });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    if (result.result !== 'ok') {
      return res.status(400).json({ message: 'Failed to delete image' });
    }

    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
export { getProfile, uploadAvatar, deleteImg };