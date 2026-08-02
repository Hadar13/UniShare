# UniShare Client

This is the frontend side of the UniShare project.

The client is built with React, Vite, TypeScript, Tailwind CSS, React Router, Redux Toolkit, Axios, and Google OAuth.

## Main Features

- Home page
- Login and Register
- Google Login
- Browse summaries
- Upload summaries
- Edit and delete summaries
- Profile page
- 404 page
- Protected routes
- Loading and error states

## Run Locally

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_URL=http://127.0.0.1:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```