const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Load env vars
dotenv.config({ path: '../.env' }); // load from root .env

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const quizRoutes = require('./routes/quizRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/quiz', quizRoutes);

app.get('/', (req, res) => {
  res.send('JOB_TRACKER API is running...');
});

const PORT = process.env.PORT || 5000;

// Database Connection Logic
const startServer = async () => {
    try {
        let mongoUri = process.env.MONGO_URI;

        // Use In-Memory MongoDB only in local development if no URI is provided
        if (process.env.NODE_ENV !== 'production' && !mongoUri) {
            console.log('Spinning up In-Memory MongoDB server for development...');
            const mongoServer = await MongoMemoryServer.create();
            mongoUri = mongoServer.getUri();
            
            // Seed data automatically in dev mode
            await mongoose.connect(mongoUri);
            console.log(`In-Memory MongoDB Connected at ${mongoUri}`);
            
            const { seedData } = require('./utils/seeder');
            await seedData();
        } else {
            // Connect to Cloud Database (Atlas) in production
            if (!mongoUri) throw new Error('MONGO_URI is missing in production environment');
            await mongoose.connect(mongoUri);
            console.log('MongoDB Atlas Connected Successfully');
        }

        app.listen(PORT, () => console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`));
    } catch (err) {
        console.error('Database connection failed', err);
        process.exit(1);
    }
}

startServer();
