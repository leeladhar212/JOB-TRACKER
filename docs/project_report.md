# Project Report: JOB_TRACKER

## Problem Statement
In today's fast-paced job market, finding the right candidate for the right job is a complex challenge. Existing platforms rely on basic keyword filtering which often leads to inaccurate matches, wasting the time of both recruiters and job seekers. There is a need for an intelligent system that semantically understands user skills and job requirements to suggest opportunities with a high probability of success.

## Solution Overview
JOB_TRACKER is an AI-driven job matching platform that leverages a vector-space methodology (Cosine Similarity) to calculate the relevance of a candidate's profile to a job posting. By quantifying the overlap in core competencies, experience, and domain knowledge, the platform surfaces top-tier matches on a personalized dashboard dynamically.

## Architecture Diagram
```
[ Frontend: React + Vite + Tailwind ]
          |     (REST APIs)
          v
[ Backend: Node.js + Express.js ]
   |                  |
   v                  v
[ MongoDB ]     [ AI Matching Engine ]
(Data layer)    (Cosine Similarity Service)
```

## Tech Stack
- Frontend: ReactJS, Vite, Tailwind CSS, Framer Motion
- Backend: NodeJS, ExpressJS
- Database: MongoDB via Mongoose
- Utilities: JWT (Auth), Bcrypt (Security), Axios (Networking)

## Features
1. **JWT-Secured Role Based Access Control**: Discerning between recruiters and job seekers.
2. **AI Metric System**: Computes real-time match percentage on newly added jobs.
3. **Data Pre-population**: Seeder scripts capable of synthesizing up to 200 realistic user and job variants for immediate testing.

## Future Scope
- **Resume Parsing**: Directly integrating an NLP engine to extract skills from PDF uploads.
- **Collaborative Filtering**: Leveraging past successful applications to refine recommendation weights dynamically.
