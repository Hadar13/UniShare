# UniShare

## Live Demo

Frontend: https://uni-share-mu.vercel.app

Backend: https://unishare-server-1vdq.onrender.com

UniShare is a full stack academic summary sharing platform for students.

The system allows users to register, log in, upload academic summaries, browse shared summaries, search and filter summaries, edit and delete summaries they uploaded, and manage their personal profile.

Uploaded summary files and profile images are handled with Multer and stored in MongoDB.

## Features

- User registration and login
- Google Login authentication
- JWT-based authentication
- Protected routes
- Upload academic summaries with files
- Store uploaded files in MongoDB
- Browse summaries
- Search and filter summaries
- Edit and delete summaries
- Profile page
- Profile image upload
- Dynamic media display for uploaded files
- Loading and error states
- 404 Not Found page

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- Context API
- Redux Toolkit
- Tailwind CSS
- Google OAuth

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- JOI validation
- Multer
- Google Auth Library
- Helmet
- Express Rate Limit

## Project Structure

```text
UniShare/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── store/
│   ├── .env.example
│   └── package.json
│
├── Server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── validation/
│   ├── .env.example
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── screenshots/
├── postman/
├── README.md
└── .gitignore
```

## Code Architecture

The project is built as a full stack monorepo with a clear separation between the frontend and backend.

The `client/` folder contains the React frontend. It includes pages, reusable components, Context API for authentication state, Redux Toolkit for summaries state management, custom hooks, and an Axios service layer for API communication.

The `Server/` folder contains the Express backend. It follows a structured architecture with routes, controllers, models, middleware, config, and validation folders.

- `routes/` define the API endpoints.
- `controllers/` contain the main business logic.
- `models/` define the MongoDB data structure using Mongoose schemas.
- `middleware/` handles authentication, validation, file upload, logging, rate limiting, and security checks.
- `config/` contains the MongoDB connection setup.
- `validation/` contains JOI validation schemas.

The frontend communicates with the backend through Axios using the `VITE_API_URL` environment variable. The backend connects to MongoDB Atlas using `MONGO_URI` and protects private actions with JWT authentication.

## Data Architecture

The database is hosted on MongoDB Atlas and uses Mongoose schemas.

The main collections are:

- `users` — stores registered users, authentication details, profile data, university, major, and role.
- `summaries` — stores uploaded academic summaries, including course details, file metadata, the uploaded file buffer, and the uploader reference.

Relationship between collections:

Each summary belongs to one user. This relationship is implemented in the `Summary` schema using an ObjectId reference:

```js
uploader: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
}
```

This relationship allows the backend to use `populate()` when displaying uploader details and to check ownership before allowing update or delete actions.

## Environment Variables

### Server

Create a `.env` file inside the `Server` folder:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1h
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
```

### Client

Create a `.env` file inside the `client` folder:

```env
VITE_API_URL=http://127.0.0.1:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Installation and Setup

### Server

Go to the Server folder:

```bash
cd Server
```

Install dependencies:

```bash
npm install
```

Run the server:

```bash
npm start
```

The server runs locally on:

```text
http://127.0.0.1:5000
```

### Client

Go to the client folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Run the client:

```bash
npm run dev
```

The client runs locally on:

```text
http://localhost:5173
```

Build the client:

```bash
npm run build
```

## API Endpoints

### Auth Routes

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/google` | Login with Google | No |
| GET | `/api/auth/me` | Get current user profile | Yes |
| PUT | `/api/auth/profile-image` | Upload profile image to MongoDB | Yes |
| GET | `/api/auth/profile-image/:id` | Get profile image from MongoDB | No |

### Summary Routes

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| GET | `/api/summaries` | Get all summaries | No |
| GET | `/api/summaries/:id` | Get summary by ID | No |
| GET | `/api/summaries/:id/file` | Get uploaded summary file from MongoDB | No |
| POST | `/api/summaries` | Create a new summary with file upload | Yes |
| PUT | `/api/summaries/:id` | Update summary | Yes |
| DELETE | `/api/summaries/:id` | Delete summary | Yes |

## API Request and Response Examples

### Register User

Request:

```http
POST /api/auth/register
Content-Type: application/json
```

Request body:

```json
{
  "name": "Student Name",
  "email": "student@example.com",
  "password": "123456",
  "university": "Bar-Ilan University",
  "major": "Information Science"
}
```

Response:

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Student Name",
    "email": "student@example.com",
    "university": "Bar-Ilan University",
    "major": "Information Science",
    "role": "user"
  }
}
```

### Login User

Request:

```http
POST /api/auth/login
Content-Type: application/json
```

Request body:

```json
{
  "email": "student@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Student Name",
    "email": "student@example.com",
    "role": "user"
  }
}
```

### Get Current User

Request:

```http
GET /api/auth/me
Authorization: Bearer jwt_token_here
```

Response:

```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "Student Name",
    "email": "student@example.com",
    "university": "Bar-Ilan University",
    "major": "Information Science",
    "role": "user"
  }
}
```

### Create Summary

Request:

```http
POST /api/summaries
Authorization: Bearer jwt_token_here
Content-Type: multipart/form-data
```

Form data:

```text
courseName: Advanced Full Stack
university: Bar-Ilan University
subject: Information Science
description: Final project summary
file: uploaded file
```

Response:

```json
{
  "success": true,
  "data": {
    "_id": "summary_id",
    "courseName": "Advanced Full Stack",
    "university": "Bar-Ilan University",
    "subject": "Information Science",
    "description": "Final project summary",
    "fileUrl": "/api/summaries/summary_id/file",
    "fileMimeType": "application/pdf",
    "fileOriginalName": "summary.pdf",
    "uploader": {
      "_id": "user_id",
      "name": "Student Name",
      "email": "student@example.com"
    }
  }
}
```

### Get All Summaries

Request:

```http
GET /api/summaries
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "_id": "summary_id",
      "courseName": "Advanced Full Stack",
      "university": "Bar-Ilan University",
      "subject": "Information Science",
      "description": "Final project summary",
      "fileUrl": "/api/summaries/summary_id/file",
      "fileMimeType": "application/pdf",
      "fileOriginalName": "summary.pdf",
      "uploader": {
        "_id": "user_id",
        "name": "Student Name",
        "email": "student@example.com"
      }
    }
  ]
}
```

### Get Summary By ID

Request:

```http
GET /api/summaries/:id
```

Response:

```json
{
  "success": true,
  "data": {
    "_id": "summary_id",
    "courseName": "Advanced Full Stack",
    "university": "Bar-Ilan University",
    "subject": "Information Science",
    "description": "Final project summary",
    "fileUrl": "/api/summaries/summary_id/file",
    "uploader": {
      "_id": "user_id",
      "name": "Student Name",
      "email": "student@example.com"
    }
  }
}
```

### Get Uploaded Summary File

Request:

```http
GET /api/summaries/:id/file
```

Response:

```text
Returns the uploaded file from MongoDB with the correct Content-Type header.
```

### Update Summary

Request:

```http
PUT /api/summaries/:id
Authorization: Bearer jwt_token_here
Content-Type: application/json
```

Request body:

```json
{
  "courseName": "Updated Course Name",
  "university": "Bar-Ilan University",
  "subject": "Information Science",
  "description": "Updated description"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "_id": "summary_id",
    "courseName": "Updated Course Name",
    "university": "Bar-Ilan University",
    "subject": "Information Science",
    "description": "Updated description"
  }
}
```

### Delete Summary

Request:

```http
DELETE /api/summaries/:id
Authorization: Bearer jwt_token_here
```

Response:

```json
{
  "success": true,
  "message": "Summary deleted successfully"
}
```

## Main Pages

- Home page
- Login / Register page
- Browse summaries page
- Upload summary page
- Profile page
- Summary detail page
- 404 Not Found page

## Screenshots

### Home

![Home](screenshots/home.png)

### Login

![Login](screenshots/login.png)

### Register

![Register](screenshots/register.png)

### Browse Summaries

![Browse](screenshots/browse.png)

### Upload Summary

![Upload](screenshots/upload.png)

### Profile

![Profile](screenshots/profile.png)

### Edit Summary

![Edit Summary](screenshots/edit-summary.png)

### 404 Not Found

![Not Found](screenshots/not-found.png)

## Deployment

The frontend is deployed on Vercel.

The backend is deployed on Render.

The database is hosted on MongoDB Atlas.

The frontend uses `VITE_API_URL` to communicate with the deployed backend API.

## Team Members and Roles

- Hadar Yakuti — Full Stack Developer: React frontend, Node.js and Express backend, MongoDB and Mongoose models, authentication, file upload, deployment, README documentation, and API testing.

## Git Workflow

The project is managed with Git and GitHub.

Commit messages use clear conventional prefixes such as `feat`, `fix`, `docs`, `refactor`, and `style`.

The project includes a meaningful commit history and pull request workflow evidence. Production-ready code is deployed from the `main` branch.

## Author

Hadar Yakuti