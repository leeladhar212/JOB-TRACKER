# API Documentation

## Auth Endpoints
Base Route: `/api/v1/auth`

### `POST /register`
- **Description**: Registers a new user.
- **Payload**:
  ```json
  {
    "name": "Jane User",
    "email": "user@test.com",
    "password": "123",
    "role": "user",
    "skills": ["React", "Node.js"],
    "experience": 3
  }
  ```
- **Response**: Returns User Object + JWT Token.

### `POST /login`
- **Description**: Authenticates existing user.
- **Payload**: `{ "email": "user@test.com", "password": "123" }`
- **Response**: Returns User Object + JWT Token.

### `GET /me`
- **Description**: Verifies session.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Returns User Object.

## Job Endpoints
Base Route: `/api/v1/jobs`

### `GET /`
- **Description**: Public route to get all jobs.
- **Response**: Returns array of jobs.

### `GET /recommended`
- **Description**: Secure route that leverages the backend matching service to calculate AI matches for the currently authenticated user.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Returns array of jobs enriched with a `matchScore` property, sorted descendingly.

### `POST /`
- **Description**: Recruiter route to post new job.
- **Headers**: `Authorization: Bearer <token>`
- **Payload**: Job Object.
- **Response**: Returns created Job Object.
