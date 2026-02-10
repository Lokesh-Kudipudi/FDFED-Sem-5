// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5500";

// API Route Constants
export const API = {
  BASE: API_BASE_URL,
  
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    REGISTER_HOTEL_MANAGER: `${API_BASE_URL}/api/auth/register/hotel-manager`,
    REGISTER_TOUR_GUIDE: `${API_BASE_URL}/api/auth/register/tour-guide`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    ME: `${API_BASE_URL}/api/auth/me`,
    PASSWORD: `${API_BASE_URL}/api/auth/password`,
    ACCOUNT: `${API_BASE_URL}/api/auth/account`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
    VERIFY_OTP: `${API_BASE_URL}/api/auth/verify-otp`,
    RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
    DELETE_ACCOUNT: `${API_BASE_URL}/api/auth/delete-account`,
    UPDATE_PASSWORD: `${API_BASE_URL}/api/auth/update-password`,
  },
  
  // User
  USERS: {
    TOUR_GUIDES: `${API_BASE_URL}/api/users/tour-guides`,
    PROFILE: `${API_BASE_URL}/api/users/profile`,
    PHOTO: `${API_BASE_URL}/api/users/photo`,
    SETTINGS: `${API_BASE_URL}/api/users/settings`,
    UPLOAD_PHOTO: `${API_BASE_URL}/api/users/upload-photo`,
  },
  
  // Tours
  TOURS: {
    LIST: `${API_BASE_URL}/api/tours`,
    DETAIL: (id) => `${API_BASE_URL}/api/tours/${id}`,
    CREATE: `${API_BASE_URL}/api/tours`,
    UPDATE: (id) => `${API_BASE_URL}/api/tours/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/tours/${id}`,
    BOOK: `${API_BASE_URL}/api/tours/book`,
    DESTINATIONS: `${API_BASE_URL}/api/tours/destinations`,
  },
  
  // Hotels
  HOTELS: {
    LIST: `${API_BASE_URL}/api/hotels`,
    DETAIL: (id) => `${API_BASE_URL}/api/hotels/${id}`,
    CREATE: `${API_BASE_URL}/api/hotels`,
    BOOK: (id) => `${API_BASE_URL}/api/hotels/${id}/book`,
    AVAILABILITY: (id) => `${API_BASE_URL}/api/hotels/${id}/availability`,
    MY_HOTEL: `${API_BASE_URL}/api/hotels/my-hotel`,
    ROOMS: `${API_BASE_URL}/api/hotels/rooms`,
    ROOM: (id) => `${API_BASE_URL}/api/hotels/rooms/${id}`,
    ROOM_TYPES: `${API_BASE_URL}/api/hotels/room-types`,
    ROOM_TYPE: (id) => `${API_BASE_URL}/api/hotels/room-types/${id}`,
    ASSIGN_ROOM: (bookingId) => `${API_BASE_URL}/api/hotels/bookings/${bookingId}/assign-room`,
  },
  
  // Bookings
  BOOKINGS: {
    LIST: `${API_BASE_URL}/api/bookings`,
    CANCEL: (id) => `${API_BASE_URL}/api/bookings/${id}/cancel`,
    STATUS: (id) => `${API_BASE_URL}/api/bookings/${id}/status`,
  },
  
  // Admin
  ADMIN: {
    DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
    CUSTOMERS: `${API_BASE_URL}/api/admin/customers`,
    QUERIES: `${API_BASE_URL}/api/admin/queries`,
    QUERY: (id) => `${API_BASE_URL}/api/admin/queries/${id}`,
    QUERY_REPLY: (id) => `${API_BASE_URL}/api/admin/queries/${id}/reply`,
    HOTELS_ANALYTICS: `${API_BASE_URL}/api/admin/hotels/analytics`,
    HOTEL_COMMISSION: (id) => `${API_BASE_URL}/api/admin/hotels/${id}/commission`,
    TOURS_ANALYTICS: `${API_BASE_URL}/api/admin/tours/analytics`,
    TOUR_COMMISSION: (id) => `${API_BASE_URL}/api/admin/tours/${id}/commission`,
    BOOKINGS: `${API_BASE_URL}/api/admin/bookings`,
    BOOKING_CANCEL: (id) => `${API_BASE_URL}/api/admin/bookings/${id}/cancel`,
    TOUR_GUIDES: `${API_BASE_URL}/api/admin/tour-guides`,
    USERS: `${API_BASE_URL}/api/admin/users`,
    USER: (id) => `${API_BASE_URL}/api/admin/users/${id}`,
    CUSTOM_TOURS: `${API_BASE_URL}/api/admin/custom-tours`,
    ASSIGN_CUSTOM_TOUR: (id) => `${API_BASE_URL}/api/admin/custom-tours/${id}/assign`,
    CANCEL_BOOKING: (id) => `${API_BASE_URL}/api/admin/bookings/${id}/cancel`,
    HOTEL_MANAGERS: `${API_BASE_URL}/api/admin/hotel-managers`,
    CREATE_USER: `${API_BASE_URL}/api/admin/users/create`,
    PACKAGES_ANALYTICS: `${API_BASE_URL}/api/admin/packages-analytics`,
  },
  
  // Hotel Manager
  MANAGER: {
    STATS: `${API_BASE_URL}/api/manager/stats`,
    BOOKINGS: `${API_BASE_URL}/api/manager/bookings`,
    HOTEL: `${API_BASE_URL}/api/manager/hotel`,
    MY_HOTEL: `${API_BASE_URL}/api/hotels/my-hotel`,
    ROOMS: `${API_BASE_URL}/api/hotels/rooms`,
    ROOM_TYPES: `${API_BASE_URL}/api/hotels/room-types`,
    ROOM_TYPE: (id) => `${API_BASE_URL}/api/hotels/room-types/${id}`,
    PHYSICAL_ROOMS: `${API_BASE_URL}/api/hotels/rooms`,
    PHYSICAL_ROOM: (id) => `${API_BASE_URL}/api/hotels/rooms/${id}`,
  },
  
  // Tour Guide
  GUIDE: {
    STATS: `${API_BASE_URL}/api/guide/stats`,
    TOURS: `${API_BASE_URL}/api/guide/tours`,
    BOOKINGS: `${API_BASE_URL}/api/guide/bookings`,
    CUSTOM_TOURS: `${API_BASE_URL}/api/guide/custom-tours`,
    QUOTE: (id) => `${API_BASE_URL}/api/guide/custom-tours/${id}/quote`,
    LIST: `${API_BASE_URL}/api/guide/list`,
  },
  
  CUSTOM_TOURS: {
    LIST: `${API_BASE_URL}/api/custom-tours`,
    CREATE: `${API_BASE_URL}/api/custom-tours`,
    ACCEPT: (id) => `${API_BASE_URL}/api/custom-tours/${id}/accept`,
    BARGAIN: (id) => `${API_BASE_URL}/api/custom-tours/${id}/bargain`,
    CANCEL: (id) => `${API_BASE_URL}/api/custom-tours/${id}/cancel`,
  },
  
  // Other
  CHATBOT: `${API_BASE_URL}/api/chatbot`,
  RECOMMENDATION: `${API_BASE_URL}/api/recommendation`,
  RECOMMENDATIONS: `${API_BASE_URL}/api/recommendations`,
  CONTACT: `${API_BASE_URL}/api/contact`,
  QUERIES: `${API_BASE_URL}/api/queries`,
  FAVOURITES: {
    LIST: `${API_BASE_URL}/api/favourites`,
    CHECK: (id) => `${API_BASE_URL}/api/favourites/check/${id}`,
    REMOVE: (id) => `${API_BASE_URL}/api/favourites/${id}`,
  },
  REVIEWS: {
    CREATE: `${API_BASE_URL}/api/reviews`,
    LIST: `${API_BASE_URL}/api/reviews`,
  },
};

export default API;
