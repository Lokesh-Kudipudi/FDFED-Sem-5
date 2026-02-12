# Backend - Chasing Horizons

This directory contains the server-side application for the Chasing Horizons platform. It is built using **Node.js**, **Express.js**, and **MongoDB**.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Models](#models)
- [Routes & Controllers](#routes--controllers)

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT (JSON Web Tokens) & Cookies
- **File Uploads**: Multer
- **AI Integration**: Gemini API (for chatbots and recommendations)

## Installation

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start the Server**:
    - **Development Mode** (with nodemon):
        ```bash
        npm run dev
        ```
    - **Production Mode**:
        ```bash
        npm start
        ```

## Environment Variables
Create a `.env` file in the `backend` directory with the following keys:

```env
PORT=5500
MONGO_URI=<Your MongoDB Connection String>
JWT_SECRET=<Your Secret Key>
FRONTEND_URL=<Frontend URL, e.g., http://localhost:5173>
GEMINI_API_KEY=<Your Google Gemini API Key>
EMAIL_USER=<Email for Nodemailer>
EMAIL_PASS=<Password for Nodemailer>
```

## Project Structure
- **`app.js`**: Main entry point. Configures middleware, database connection, and routes.
- **`config/`**: Configuration files (e.g., database, redis).
- **`Controller/`**: Contains business logic for handling requests.
- **`middleware/`**: Custom middleware (authentication, file upload, auto-sign-in).
- **`Model/`**: Mongoose schemas and models.
- **`routes/`**: Express routers defining API endpoints.

## Models

### 1. User (`userModel.js`)
Represents all users in the system.
- **Roles**: `user`, `admin`, `hotelManager`, `tourGuide`.
- **Key Fields**: `fullName`, `email`, `passwordHash` (stored securely), `role`, `bookings` (array of booking IDs).

### 2. Tour (`tourModel.js`)
Represents a tour package.
- **Key Fields**:
    - `tourGuideId`: Reference to the `User` (Tour Guide) who created it.
    - `destinations`: Array of locations with images.
    - `itinerary`: Day-by-day plan.
    - `bookingDetails`: Availability, dates, and status.
    - `price`: Pricing information.
    - `mainImage`: URL of the cover image.

### 3. Hotel (`hotelModel.js`)
Represents a hotel property.
- **Key Fields**:
    - `managerId`: Reference to the `User` (Hotel Manager).
    - `rooms`: Array of room types and availability.
    - `facilities`: List of amenities.

### 4. Booking (`bookingModel.js`)
Represents a reservation for a Tour or Hotel.
- **Key Fields**:
    - `userId`: The user who made the booking.
    - `itemId`: ID of the Tour or Hotel.
    - `type`: `Tour` or `Hotel`.
    - `status`: `pending`, `confirmed`, `cancelled`, `completed`.
    - `bookingDetails`: Specifics like dates and number of guests.

### 5. Other Models
- **`Contact`**: Stores contact form submissions.
- **`Review`**: Stores user reviews for tours/hotels.
- **`Favourite`**: Stores user's favorite items.
- **`CustomTourRequest`**: Stores user requests for personalized tours.

## Routes & Controllers

The application follows a modular architecture where routes are defined in `routes/` and corresponding logic is often delegated to `Controller/`.

### Authentication (`authRouter.js`)
Handles user registration and login.
- **Endpoints**:
    - `POST /signup`: Register a new user.
    - `POST /login`: Authenticate and receive a JWT (stored in HTTP-only cookie).
    - `POST /logout`: Clear the cookie.

### Users (`usersRouter.js`)
Manages user profiles.
- **Controller**: `userController.js`
- **Key Functionality**:
    - Get user profile.
    - Update profile (including photo upload via `multer`).
    - Change password.

### Tours (`toursRouter.js`)
Manages tour packages.
- **Controller**: `tourController.js`
- **Key Functionality**:
    - **GET /**: Fetch all tours.
    - **GET /:id**: Fetch a single tour by ID.
    - **GET /destinations**: Fetch top destinations.
    - **POST /**: Create a new tour (Admin/Tour Guide only). Handles file uploads for main image and destination images. *Note: Logic for parsing complex JSON fields and handling files is implemented directly in the router.*
    - **PUT /:id**: Update an existing tour.
    - **DELETE /:id**: Delete a tour.

### Hotels (`hotelsRouter.js`)
Manages hotel listings.
- **Controller**: `hotelController.js`
- **Key Functionality**:
    - Search availability based on dates and location.
    - Manage rooms and bookings for hotel managers.

### Bookings (`bookingsRouter.js`)
Handles the booking process.
- **Controller**: `bookingController.js`
- **Key Functionality**:
    - **GET /**: Fetch all bookings for the logged-in user.
    - **POST /**: Create a new booking.
    - **POST /:id/cancel**: Cancel a booking.

### Admin (`adminRouter.js`)
Provides statistics and management capabilities for administrators.
- **Controller**: `analyticsController.js`, `adminUserController.js`
- **Key Functionality**:
    - View dashboard stats (users, total bookings, revenue).
    - Manage users and approvals.

### AI Integration
- **Gemini Controller (`geminiController.js`)**:
    - Uses Google Gemini API to provide travel recommendations and chatbot responses.
    - Identify user preferences and suggest tours/hotels.
