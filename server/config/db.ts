import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Listen for the connected event
    mongoose.connection.on('connected', async () => {
      console.log('MongoDB connected');
    });
    
    // Connect to the database using the environment variable
    await mongoose.connect(process.env.MONGODB_URI!);
  } catch (error: any) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;