# Backend API Routes Documentation

This document provides a comprehensive overview of all the API routes defined in the `backend/routes` directory. All routes correctly implement `@swagger` blocks which automatically generate the OpenAPI specifications.

## 1. Authentication Routes (`authRouter.js`)

**Swagger Documentation Implemented:** Yes

| Method | Path | Request Body | Sample Response |
|---|---|---|---|
| POST | `/login` | `{ email, password }` | `{ status: "success", token: "..." }` |
| POST | `/register` | `{ fullName, email, password, phone }` | `{ status: "success", user: {...} }` |
| POST | `/register/hotel-manager` | *User Details* | `{ status: "success" }` |
| POST | `/register/tour-guide` | *User Details* | `{ status: "success" }` |
| POST | `/register/owner` | `{ inviteCode, ... }` | `{ status: "success" }` |
| GET | `/logout` | *None* | `{ status: "success" }` |
| GET | `/me` | *None* | `{ user: {...} }` |
| POST | `/password` | `{ oldPassword, newPassword }` | `{ status: "success" }` |
| DELETE | `/account` | *None* | `{ status: "success" }` |
| POST | `/forgot-password` | `{ email }` | `{ status: "success", message: "OTP sent" }` |
| POST | `/verify-otp` | `{ email, otp }` | `{ status: "success" }` |
| POST | `/reset-password` | `{ token, newPassword }` | `{ status: "success" }` |

## 2. Admin Routes (`adminRouter.js`)

**Swagger Documentation Implemented:** Yes

| Method | Path | Request Body | Sample Response |
|---|---|---|---|
| GET | `/dashboard` | *None* | `{ status: "success", data: {...} }` |
| GET | `/customers` | *None* | `{ status: "success", data: [...] }` |
| GET | `/queries` | *None* | `{ status: "success", data: [...] }` |
| DELETE | `/queries/:id` | *None* | `{ status: "success" }` |
| POST | `/queries/:id/reply` | `{ replyMessage }` | `{ status: "success" }` |
| GET | `/hotels/analytics` | *None* | `{ status: "success", data: {...} }` |
| GET | `/verifications` | *None* | `{ status: "success", data: { hotels: [], tours: [] } }` |
| PUT | `/hotels/:id/commission` | `{ commissionRate }` | `{ status: "success", data: {...} }` |
| PATCH | `/hotels/:id/status` | `{ status: "active/inactive/pending" }` | `{ status: "success", data: {...} }` |
| GET | `/tours/analytics` | *None* | `{ status: "success", data: {...} }` |
| PUT | `/tours/:id/commission` | `{ commissionRate }` | `{ status: "success", data: {...} }` |
| PATCH | `/tours/:id/status` | `{ status: "active/inactive/pending" }` | `{ status: "success", data: {...} }` |
| GET | `/bookings` | *None* | `{ status: "success", data: [...] }` |
| POST | `/bookings/:bookingId/cancel` | *None* | `{ status: "success" }` |
| GET | `/tour-guides` | *None* | `{ status: "success", data: [...] }` |
| POST | `/users` | `{ userData }` | `{ status: "success" }` |
| DELETE | `/users/:userId` | *None* | `{ status: "success" }` |
| GET | `/custom-tours` | *None* | `{ status: "success", data: [...] }` |
| POST | `/custom-tours/:id/assign` | `{ guideId }` | `{ status: "success" }` |
| GET | `/hotel-managers` | *None* | `{ status: "success", data: [...] }` |
| GET | `/employees` | *None* | `{ status: "success", data: [...] }` |
| PATCH | `/assign/hotel/:hotelId` | `{ employeeId }` | `{ status: "success" }` |
| PATCH | `/assign/tour/:tourId` | `{ employeeId }` | `{ status: "success" }` |
| GET | `/reports/commissions/hotels` | *None* | `{ status: "success", data: [...] }` |
| GET | `/reports/commissions/tours` | *None* | `{ status: "success", data: [...] }` |

## 3. Bookings Routes (`bookingsRouter.js`)

**Swagger Documentation Implemented:** Yes

| Method | Path | Request Body | Sample Response |
|---|---|---|---|
| GET | `/` | *None* | `{ status: "success", data: [...] }` |
| POST | `/:bookingId/cancel` | *None* | `{ status: "success" }` |
| POST | `/:bookingId/status` | `{ status }` | `{ status: "success" }` |

## 4. Tours Routes (`toursRouter.js`)

**Swagger Documentation Implemented:** Yes

| Method | Path | Request Body | Sample Response |
|---|---|---|---|
| GET | `/` | *None* | `{ status: "success", data: [...] }` |
| POST | `/` | `FormData { name, price, mainImage... }` | `{ status: "success", data: {...} }` |
| GET | `/destinations` | *None* | `{ status: "success", data: [...] }` |
| POST | `/book` | `{ startDate, endDate, tourId }` | `{ status: "success", message: "..." }` |
| GET | `/:id` | *None* | `{ status: "success", tour: {...} }` |
| PUT | `/:id` | `FormData { ...updatedDetails }` | `{ status: "success", data: {...} }` |

## 5. Hotels Routes (`hotelsRouter.js`)

**Swagger Documentation Implemented:** Yes

| Method | Path | Request Body | Sample Response |
|---|---|---|---|
| GET | `/` | *None* | `{ status: "success", data: [...] }` |
| POST | `/rooms` | `FormData { type, price, ... }` | `{ status: "success", data: {...} }` |
| GET | `/rooms` | *None* | `{ status: "success", data: [...] }` |
| PUT | `/rooms/:id` | `FormData { ...updatedDetails }` | `{ status: "success", data: {...} }` |
| DELETE | `/rooms/:id` | *None* | `{ status: "success" }` |
| POST | `/bookings/:bookingId/assign-room`| `{ roomId }` | `{ status: "success" }` |
| GET | `/:id` | *None* | `{ status: "success", hotel: {...} }` |
| POST | `/:id/book` | `{ startDate, endDate, ... }` | `{ status: "success" }` |
| GET | `/:id/availability` | *None* | `{ status: "success", available: true/false }` |

## 6. Users Routes (`usersRouter.js`)

**Swagger Documentation Implemented:** Yes

| Method | Path | Request Body | Sample Response |
|---|---|---|---|
| GET | `/tour-guides` | *None* | `{ status: "success", data: [...] }` |
| POST | `/profile` | `FormData { photo, ... }` | `{ status: "success" }` |
| POST | `/photo` | `FormData { photo }` | `{ status: "success", photoUrl: "..." }` |

## 7. Favourites Routes (`favouriteRouter.js`)

**Swagger Documentation Implemented:** Yes

| Method | Path | Request Body | Sample Response |
|---|---|---|---|
| POST | `/` | `{ tourId }` | `{ status: "success" }` |
| DELETE | `/:tourId` | *None* | `{ status: "success" }` |
| GET | `/` | *None* | `{ status: "success", data: [...] }` |
| GET | `/check/:tourId` | *None* | `{ status: "success", isFavourite: true/false }` |

## 8. Owner Routes (`ownerRouter.js`)

**Swagger Documentation Implemented:** Yes

| Method | Path | Request Body | Sample Response |
|---|---|---|---|
| GET | `/analytics/overview` | *None* | `{ status: "success", data: {...} }` |
| GET | `/analytics/hotels` | *None* | `{ status: "success", data: [...] }` |
| GET | `/analytics/tours` | *None* | `{ status: "success", data: [...] }` |
| GET | `/analytics/performance` | *None* | `{ status: "success", data: {...} }` |
| GET | `/analytics/bookings` | *None* | `{ status: "success", data: [...] }` |
| GET | `/analytics/people` | *None* | `{ status: "success", data: {...} }` |

## 9. Custom Tours Routes (`customTourRouter.js`)

**Swagger Documentation Implemented:** Yes

| Method | Path | Request Body | Sample Response |
|---|---|---|---|
| POST | `/` | `{ destination, budget, days... }` | `{ status: "success" }` |
| GET | `/` | *None* | `{ status: "success", data: [...] }` |
| POST | `/:id/bargain` | `{ proposedPrice }` | `{ status: "success" }` |
| POST | `/:id/accept` | *None* | `{ status: "success" }` |

## 10. Manager Routes (`managerRouter.js`)

**Swagger Documentation Implemented:** Yes

| Method | Path | Request Body | Sample Response |
|---|---|---|---|
| GET | `/stats` | *None* | `{ status: "success", data: {...} }` |
| GET | `/bookings` | *None* | `{ status: "success", data: [...] }` |
| GET | `/hotels` | *None* | `{ status: "success", data: [...] }` |
| GET | `/hotel` | *None* | `{ status: "success", data: {...} }` |
| PUT | `/hotel` | `FormData { name, description... }`| `{ status: "success" }` |
| DELETE | `/hotel` | *None* | `{ status: "success" }` |

## 11. Guide Routes (`guideRouter.js`)

**Swagger Documentation Implemented:** Yes

| Method | Path | Request Body | Sample Response |
|---|---|---|---|
| GET | `/stats` | *None* | `{ status: "success", data: {...} }` |
| GET | `/tours` | *None* | `{ status: "success", data: [...] }` |
| GET | `/bookings` | *None* | `{ status: "success", data: [...] }` |
| GET | `/custom-tours` | *None* | `{ status: "success", data: [...] }` |
| POST | `/custom-tours/:id/quote`| `{ price, notes }` | `{ status: "success" }` |
| PUT | `/custom-tours/:id/quote` | `{ updatedPrice }` | `{ status: "success" }` |

## 12. Employee Routes (`employeeRouter.js`)

**Swagger Documentation Implemented:** Yes

| Method | Path | Request Body | Sample Response |
|---|---|---|---|
| GET | `/stats` | *None* | `{ status: "success", data: {...} }` |
| GET | `/hotels` | *None* | `{ status: "success", data: [...] }` |
| GET | `/tours` | *None* | `{ status: "success", data: [...] }` |
| GET | `/bookings` | *None* | `{ status: "success", data: [...] }` |

## 13. Review Routes (`reviewRouter.js`)

**Swagger Documentation Implemented:** Yes

| Method | Path | Request Body | Sample Response |
|---|---|---|---|
| POST | `/` | `{ rating, comment, tourId/hotelId }` | `{ status: "success" }` |