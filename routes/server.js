import express from "express";
import cors from "cors";
import connectDB from "../backend/config/mogodb.js";
import router from "../backend/routes/authRoutes.js";
import Prescriptionrouter from "../backend/routes/prescriptionRoutes.js";
import cookieParser from 'cookie-parser';

const app = express();



process.env.JWT_SECRET = '65ed2a1a80f1c527e4f91badfbe8ba1ed1893461326dae1d45e0614b4aeacdba53928b1cde0bb59e9ec2ac1d10f5fda637eedfe817fed877abad57b8fd39db01';
process.env.JWT_EXPIRES_IN = '1h';
process.env.MONGO_URI='mongodb+srv://ds109:blgeJGBK6015@cluster0.aiecc.mongodb.net/mydatabase?retryWrites=true&w=majority';


app.use(cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if(!origin) return callback(null, true);
      return callback(null, origin);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  app.use(cookieParser());
  app.use(express.json());
  
// Connect to MongoDB
console.log(process.env.JWT_SECRET);  // Should log the secret key or undefined if it's missing

try {
    await connectDB();
    console.log('Connected to MongoDB');
} catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
}

// Routes
app.use('/api/v1/auth', router);
app.get('/', (req, res) => {
    res.send('API is working!!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App running on the port ${port}...`);
});
