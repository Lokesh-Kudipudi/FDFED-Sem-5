# Chasing Horizons

This is a full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js). It features hotel and tour bookings, user authentication, and more.

## Project Structure

- **frontend/**: React application using Vite and Tailwind CSS.
- **backend/**: Node.js/Express server using MongoDB and Redis.

## Prerequisites

Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (or a cloud instance like MongoDB Atlas)
- [Redis](https://redis.io/) (or a cloud instance like Upstash)

## Installation & Setup

### 1. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory and add the following environment variables:

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   FRONTEND_URL=http://localhost:5173
   
   # Cloudinary Configuration
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
   
   # Email Configuration (Nodemailer)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_email_app_password
   
   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379
   UPSTASH_REDIS_REST_URL=your_upstash_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_token
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will typically run on `http://localhost:4000` (or the port defined in `app.js`).

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Running the Application

To run the full application, you need to have both the backend and frontend servers running simultaneously in separate terminal windows.

## Features

- User Authentication (Sign up, Sign in)
- Hotel Management
- Tour Booking
- Profile Management
- Integration with Gemini AI and Cloudinary

## License

This project is licensed under the ISC License.
