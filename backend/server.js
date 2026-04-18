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

// Start In-Memory MongoDB Server instead of local!
const startServer = async () => {
    try {
        console.log('Spinning up In-Memory MongoDB server...');
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(`In-Memory MongoDB Connected at ${mongoUri}`);

        // Seed data automatically on startup
        const { seedData } = require('./utils/seeder');
        await seedData();

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('Database connection failed', err);
        process.exit(1);
    }
}

startServer();
