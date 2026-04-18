# JOB_TRACKER - AI-Based Smart Job Matching Platform

![App Mockup](https://via.placeholder.com/1200x600/09090b/3b82f6?text=JOB_TRACKER+)

## Overview
JOB_TRACKER is a modern, high-performance full-stack web application designed for a national-level hackathon. It strategically connects job seekers with relevant job opportunities using an advanced AI-based recommendation logic (Cosine Similarity implementation).

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MongoDB (Mongoose)

## Features
- **Smart AI Matching**: Custom cosine-similarity matching engine evaluates user skills vs job required skills.
- **Dynamic Percentage Scoring**: Visually represented match score (%) for each recommended opportunity.
- **Authentication**: Secure JWT-based registration and login system with Role-based access.
- **Premium UI**: Framer motion micro-animations, glassmorphism, responsive grid layouts, and a curated dark-theme palette.

## Installation & Setup

> Note: To run this project, make sure you have Node.js installed on your machine.

1. **Clone the repository** (if from Git) or extract the `.zip`.

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Variables**:
   In the root directory, there is a `.env` file containing:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/job_tracker
   JWT_SECRET=supersecretjwtkey_for_hackathon123
   JWT_EXPIRE=30d
   ```
   *Make sure you have a local MongoDB server running on `localhost:27017` or change the `MONGO_URI` to your MongoDB Atlas connection string.*

5. **Generate Fake Data**:
   To seed 200 users and 200 job postings:
   ```bash
   cd backend
   npm run seed
   ```

6. **Run the Project (Concurrently)**:
   You can run both Frontend and Backend concurrently from the root directory:
   ```bash
   cd .. # Back to root
   npm install concurrently
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Test Credentials
After running the seeder, you can log in with:
- **Email**: user@test.com
- **Password**: 123456

## Documentation
The `docs/` folder contains comprehensive technical reports and API documentation. Since you requested PDF outputs, they are provided in Markdown format which can be directly printed to PDF via any standard browser or markdown viewer.
