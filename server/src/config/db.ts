import mongoose from 'mongoose';
import { seedAdmin } from './seedAdmin.js';

export const connectDB = async (): Promise<void> => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || '');
        console.log(`MongoDB Connected : ${conn.connection.host}`);
        await seedAdmin();
    }catch(error){
        console.error(`Database connection error: ${error}`);
        process.exit(1);
    }
};