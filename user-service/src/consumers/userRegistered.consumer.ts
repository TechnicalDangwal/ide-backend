import User from "../models/user.models.js";

export default async (data: any) => {
    const { userId, email, username, profilePic } = data;
    console.log(data , 'we reached');
    
    await User.create({
        authId: userId,
        email,
        username,
        profilePic

    })
}