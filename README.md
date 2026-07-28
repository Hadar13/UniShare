# UniShare

UniShare is a full stack academic summary sharing platform for students.

The system allows users to register, log in, upload academic summaries, browse shared summaries, edit and delete summaries, and manage their personal profile.

## Features

- User registration and login
- Google Login authentication
- JWT-based authentication
- Protected routes
- Upload academic summaries with files
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

## Project Structure

UniShare/
- client/
  - src/
    - components/
    - context/
    - hooks/
    - pages/
    - services/
    - store/
  - .env.example

- Server/
  - controllers/
  - middleware/
  - models/
  - routes/
  - uploads/
  - validation/
  - .env.example

## Environment Variables

### Server

Create a `.env` file inside the `Server` folder:

PORT=5000  
MONGO_URI=your_mongodb_connection_string_here  
JWT_SECRET=your_jwt_secret_here  
JWT_EXPIRES_IN=1h  
GOOGLE_CLIENT_ID=your_google_client_id  

### Client

Create a `.env` file inside the `client` folder:

VITE_GOOGLE_CLIENT_ID=your_google_client_id

## Installation and Setup

### Server

Go to the Server folder:

cd Server

Install dependencies:

npm install

Run the server:

node server.js

The server runs on:

http://127.0.0.1:5000

### Client

Go to the client folder:

cd client

Install dependencies:

npm install

Run the client:

npm run dev

The client runs on:

http://localhost:5173

Build the client:

npm run build

## API Endpoints

### Auth Routes

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| POST | /api/auth/register | Register a new user | No |
| POST | /api/auth/login | Login user | No |
| POST | /api/auth/google | Login with Google | No |
| GET | /api/auth/me | Get current user profile | Yes |
| PUT | /api/auth/profile-image | Upload profile image | Yes |

### Summary Routes

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| GET | /api/summaries | Get all summaries | No |
| GET | /api/summaries/:id | Get summary by ID | No |
| POST | /api/summaries | Create a new summary with file upload | Yes |
| PUT | /api/summaries/:id | Update summary | Yes |
| DELETE | /api/summaries/:id | Delete summary | Yes |

## Main Pages

- Home page
- Login / Register page
- Browse summaries page
- Upload summary page
- Profile page
- 404 Not Found page

## Screenshots

Screenshots will be added before submission.

## Author

Hadar Yakuti
