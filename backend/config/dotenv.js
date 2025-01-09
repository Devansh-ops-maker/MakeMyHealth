import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();


process.env.JWT_SECRET = '65ed2a1a80f1c527e4f91badfbe8ba1ed1893461326dae1d45e0614b4aeacdba53928b1cde0bb59e9ec2ac1d10f5fda637eedfe817fed877abad57b8fd39db01';
process.env.JWT_EXPIRES_IN = '1h';
process.env.MONGO_URI='mongodb+srv://ds109:blgeJGBK6015@cluster0.aiecc.mongodb.net/mydatabase?retryWrites=true&w=majority';


// You can also log or handle error scenarios if necessary
if (!process.env.JWT_SECRET || !process.env.MONGO_URI){
  console.error('Missing required environment variables');
  process.exit(1); // Terminate the app if essential variables are missing
}
