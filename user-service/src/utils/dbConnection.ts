import mongoose from 'mongoose';

export default async () => {
  try {
    console.log(process.env.MONGO_URI);
    
    const conn = await mongoose.connect(process.env.MONGO_URI as string,{
        dbName: 'onlineIDE'
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error : any) {

    console.log(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};
