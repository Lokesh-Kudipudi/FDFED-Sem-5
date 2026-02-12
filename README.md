# Chasing Horizons - Travel & Tourism Management System

## Overview
Chasing Horizons is a comprehensive web-based platform designed to facilitate travel and tourism management. Built using the **MERN Stack** (MongoDB, Express.js, React, Node.js), it serves multiple stakeholders including regular users, hotel managers, tour guides, and administrators.

The application allows users to search and book hotels and tours, customize tour packages, and interact with an AI chatbot for recommendations. Service providers (Hotel Managers, Tour Guides) have dedicated dashboards to manage their offerings, while Administrators oversee the entire platform.

## Project Structure
The project is divided into two main directories:

- **`backend/`**: Contains the server-side logic, API endpoints, database models, and controllers.
- **`frontend/`**: Contains the client-side user interface built with React and Vite.

## Prerequisites
Before running the project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas connection string)

## Getting Started

### 1. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5500
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
# API Keys for third-party services (if applicable)
```

Start the backend server:
```bash
npm start
# OR for development with nodemon
npm run dev
```
The server will run on `http://localhost:5500`.

### 2. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```
The application will be accessible at the URL provided by Vite (usually `http://localhost:5173`).

## Key Features
- **User Roles**: Distinct flows for Travelers, Hotel Managers, Tour Guides, and Admins.
- **Booking System**: Real-time booking for hotels and tours with availability checks.
- **Custom Tours**: Users can request customized tour packages.
- **AI Integration**: Chatbot and personalized recommendations using Gemini AI.
- **Dashboards**: Comprehensive analytics and management tools for admins and service providers.

## License
[License Name]
