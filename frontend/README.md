# Frontend - Chasing Horizons

This directory contains the client-side application for the Chasing Horizons platform. It is built using **React** and **Vite**, offering a fast and responsive user experience.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Key Features & Pages](#key-features--pages)

## Tech Stack
- **Framework**: React.js
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit & React Context
- **Routing**: React Router DOM
- **Charts**: Chart.js (via react-chartjs-2)
- **Icons**: React Icons
- **Notifications**: React Hot Toast

## Installation

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start the Development Server**:
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173`.

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Project Structure

- **`src/`**: Source code directory.
    - **`assets/`**: Static assets like images and icons.
    - **`components/`**: Reusable UI components (Buttons, Cards, Modals, Navbar, Footer).
    - **`config/`**: Configuration files (API base URL).
    - **`context/`**: React Context for global state, specifically authentication (`UserContext`).
    - **`hooks/`**: Custom React hooks.
    - **`pages/`**: View components corresponding to routes.
    - **`redux/`**: Redux slices and store configuration for managing application state (Tours, Hotels).
    - **`App.jsx`**: Main application component defining routes.
    - **`main.jsx`**: Entry point rendering the React app.

## Key Features & Pages

The application is divided into several sections based on user roles and features:

### 1. General Pages
Accessible to all visitors.
- **Home (`Home.jsx`)**: Landing page with featured tours and hotels.
- **Tours (`ToursIndex.jsx`)**: List of all available tours with filtering.
- **Tour Details (`TourDetail.jsx`)**: Detailed view of a specific tour, including itinerary and booking options.
- **Hotels (`HotelIndex.jsx`)**: List of all available hotels.
- **Hotel Details (`HotelDetail.jsx`)**: detailed view of a specific hotel with room booking options.
- **Customize Tour (`CustomizeTour.jsx`)**: Form for users to request personalized tour packages.
- **Recommendation (`Recommendation.jsx`)**: AI-powered travel recommendations.
- **Contact (`Contact.jsx`)**: Contact form for inquiries.

### 2. Authentication
- **Sign In (`SignIn.jsx`)**: User login.
- **Sign Up (`SignUp.jsx`)**: User registration.
- **Sign Up Hotel Manager**: Registration for hotel managers.
- **Sign Up Tour Guide**: Registration for tour guides.

### 3. User Dashboard
Accessible to logged-in users.
- **Dashboard (`UserDashboard.jsx`)**: Overview of user activity.
- **My Custom Requests (`MyCustomRequests.jsx`)**: Status of customized tour requests.

### 4. Admin Dashboard
Accessible to administrators only.
- **Dashboard (`AdminDashboard.jsx`)**: Platform-wide statistics and charts.
- **Manage Users**: View and manage all user accounts (`AdminCustomers`, `AdminTourGuides`, `AdminHotelManagers`).
- **Manage Content**: Approve/Reject packages (`AdminPackages`), manage hotels (`AdminHotelManagement`).
- **Queries (`AdminQueries`)**: View user inquiries.

### 5. Hotel Manager Dashboard
Accessible to hotel managers.
- **Dashboard (`HotelManagerDashboard.jsx`)**: Analytics for their hotel.
- **My Hotel (`HotelManagerMyHotel.jsx`)**: Manage hotel details.
- **Room Inventory (`HotelManagerRooms.jsx`)**: Manage room availability and pricing.
- **Bookings (`HotelManagementBookings.jsx`)**: View and manage reservations.

### 6. Tour Guide Dashboard
Accessible to tour guides.
- **Dashboard (`TourGuideDashboard.jsx`)**: Analytics for their tours.
- **My Tours (`TourGuideMyTours.jsx`)**: Manage created tours.
- **Create Tour (`TourGuideCreateTour.jsx`)**: Form to create new tour packages.
- **Bookings (`TourGuideBookings.jsx`)**: View and manage tour bookings.
