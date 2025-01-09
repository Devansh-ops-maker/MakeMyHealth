// config/mongodb.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = "mongodb+srv://ds109:blgeJGBK6015@cluster0.aiecc.mongodb.net/mydatabase?retryWrites=true&w=majority";
    
    const connectionParams = {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    };

    const conn = await mongoose.connect(uri, connectionParams);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
