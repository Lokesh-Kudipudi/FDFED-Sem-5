const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

const { User } = require("../Model/userModel");
const { Hotel } = require("../Model/hotelModel");
const { Room } = require("../Model/roomModel");
const { Tour } = require("../Model/tourModel");
const { Booking } = require("../Model/bookingModel");
const CustomTourRequest = require("../Model/CustomTourRequest");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const DEFAULT_PASSWORD = process.env.SEED_DEFAULT_PASSWORD || "12345678";
const DUMP_DIR = path.resolve(__dirname, "../seed-dump/ffsd");

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function isoDate(date) {
  return date.toISOString().split("T")[0];
}

function formatDay(date) {
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

function formatMonth(date) {
  return date.toLocaleDateString("en-US", { month: "long" });
}

function inr(value) {
  return `₹${value}`;
}

function buildTourSlots(startFrom, slotCount = 5) {
  const slots = [];
  for (let i = 0; i < slotCount; i += 1) {
    const start = addDays(startFrom, i * 21);
    const end = addDays(start, 4 + (i % 3));
    slots.push({
      startDate: isoDate(start),
      startDay: formatDay(start),
      endDate: isoDate(end),
      endDay: formatDay(end),
      status: "Available",
      discount: i % 3 === 0 ? 0.1 : 0,
    });
  }
  return slots;
}

function bookingStatusByIndex(index) {
  const statuses = ["pending", "booked", "checkedIn", "complete", "cancelled"];
  return statuses[index % statuses.length];
}

function fromExtendedJson(value) {
  if (Array.isArray(value)) {
    return value.map(fromExtendedJson);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  if (Object.keys(value).length === 1) {
    if (value.$oid) return new mongoose.Types.ObjectId(value.$oid);
    if (value.$numberInt) return Number(value.$numberInt);
    if (value.$numberLong) return Number(value.$numberLong);
    if (value.$numberDouble) return Number(value.$numberDouble);
    if (value.$numberDecimal) return Number(value.$numberDecimal);
    if (value.$date) return new Date(value.$date);
  }

  const out = {};
  for (const [key, val] of Object.entries(value)) {
    out[key] = fromExtendedJson(val);
  }
  return out;
}

function sanitizeNestedIds(value) {
  if (Array.isArray(value)) return value.map(sanitizeNestedIds);
  if (!value || typeof value !== "object") return value;
  if (value instanceof mongoose.Types.ObjectId) return value;
  if (value instanceof Date) return value;

  const out = {};
  for (const [key, val] of Object.entries(value)) {
    if (key === "__v") continue;
    if (key === "_id") continue;
    out[key] = sanitizeNestedIds(val);
  }
  return out;
}

function loadDumpCollection(collectionName) {
  const bsonPath = path.join(DUMP_DIR, `${collectionName}.bson`);
  if (!fs.existsSync(bsonPath)) {
    return [];
  }

  const rawOutput = execSync(`bsondump --quiet "${bsonPath}"`, {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 50,
  });

  const docs = [];
  for (const rawLine of rawOutput.split("\n")) {
    const line = rawLine.trim();
    if (!line || !line.startsWith("{")) continue;
    try {
      const parsed = fromExtendedJson(JSON.parse(line));
      const topLevelId = parsed && parsed._id ? parsed._id : undefined;
      const sanitized = sanitizeNestedIds(parsed);
      if (topLevelId) {
        sanitized._id = topLevelId;
      }
      docs.push(sanitized);
    } catch (error) {
      // Ignore malformed/non-document lines from bsondump output.
    }
  }
  return docs;
}

async function clearCollections() {
  await Booking.deleteMany({});
  await Room.deleteMany({});
  await Tour.deleteMany({});
  await Hotel.deleteMany({});
  await User.deleteMany({});

  // Optional collections used by UI/admin features.
  const optionalCollections = [
    "favourites",
    "reviews",
    "customtourrequests",
    "contactforms",
  ];

  for (const name of optionalCollections) {
    try {
      await mongoose.connection.collection(name).deleteMany({});
    } catch (error) {
      // Ignore when collection is missing.
    }
  }
}

async function createUsers() {
  const hash = await bcrypt.hash(DEFAULT_PASSWORD, 12);

  const baseUsers = [
    {
      fullName: "Demo Traveler",
      email: "user@gmail.com",
      role: "user",
      phone: "9000000001",
      address: "Hyderabad",
    },
    {
      fullName: "Demo Hotel Manager",
      email: "hotelmanager@gmail.com",
      role: "hotelManager",
      phone: "9000000002",
      address: "Vizag",
    },
    {
      fullName: "Demo Tour Guide",
      email: "tourguide@gmail.com",
      role: "tourGuide",
      phone: "9000000003",
      address: "Araku",
    },
    {
      fullName: "Demo Admin",
      email: "admin@gmail.com",
      role: "admin",
      phone: "9000000004",
      address: "Vijayawada",
    },
    {
      fullName: "Demo Employee",
      email: "employee@gmail.com",
      role: "employee",
      phone: "9000000005",
      address: "Tirupati",
    },
    {
      fullName: "Demo Owner",
      email: "owner@gmail.com",
      role: "owner",
      phone: "9000000006",
      address: "Warangal",
    },
  ];

  const extraHotelManagers = Array.from({ length: 4 }, (_, i) => ({
    fullName: `Hotel Manager ${i + 1}`,
    email: `hotelmanager${i + 1}@gmail.com`,
    role: "hotelManager",
    phone: `910000000${i + 1}`,
    address: `Manager Block ${i + 1}`,
  }));

  const extraTourGuides = Array.from({ length: 4 }, (_, i) => ({
    fullName: `Tour Guide ${i + 1}`,
    email: `tourguide${i + 1}@gmail.com`,
    role: "tourGuide",
    phone: `920000000${i + 1}`,
    address: `Guide Colony ${i + 1}`,
  }));

  const extraTravelers = Array.from({ length: 6 }, (_, i) => ({
    fullName: `Traveler ${i + 1}`,
    email: `user${i + 1}@gmail.com`,
    role: "user",
    phone: `930000000${i + 1}`,
    address: `Traveler Street ${i + 1}`,
  }));

  const extraEmployees = Array.from({ length: 2 }, (_, i) => ({
    fullName: `Employee ${i + 1}`,
    email: `employee${i + 1}@gmail.com`,
    role: "employee",
    phone: `940000000${i + 1}`,
    address: `Ops Wing ${i + 1}`,
  }));

  const allUsers = [
    ...baseUsers,
    ...extraHotelManagers,
    ...extraTourGuides,
    ...extraTravelers,
    ...extraEmployees,
  ].map((user) => ({
    ...user,
    passwordHash: hash,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
    bookings: [],
  }));

  const createdUsers = await User.insertMany(allUsers);

  const usersByEmail = new Map(createdUsers.map((u) => [u.email, u]));
  const hotelManagers = createdUsers.filter((u) => u.role === "hotelManager");
  const tourGuides = createdUsers.filter((u) => u.role === "tourGuide");
  const employees = createdUsers.filter((u) => u.role === "employee");
  const travelers = createdUsers.filter((u) => u.role === "user");

  return {
    usersByEmail,
    hotelManagers,
    tourGuides,
    employees,
    travelers,
  };
}

async function createHotels(hotelManagers, employees) {
  const dumpHotels = loadDumpCollection("hotels");
  if (dumpHotels.length === 0) {
    throw new Error(`No hotels found in dump: ${path.join(DUMP_DIR, "hotels.bson")}`);
  }

  const createdHotels = [];
  const hotelIdMap = new Map();
  for (let i = 0; i < dumpHotels.length; i += 1) {
    const source = dumpHotels[i];
    const manager = hotelManagers[i % hotelManagers.length];
    const assignedEmployee = employees[i % employees.length];
    const requiresVerification = i < 2;

    const hotel = await Hotel.create({
      title: source.title,
      description: source.description,
      address: source.address,
      location: source.location,
      rating: source.rating ?? 4.5,
      currency: source.currency || "INR",
      amenities: Array.isArray(source.amenities) ? source.amenities : [],
      mainImage: source.mainImage,
      images: Array.isArray(source.images) ? source.images : [],
      ownerId: manager._id,
      assignedEmployeeId: requiresVerification ? null : assignedEmployee._id,
      faq: Array.isArray(source.faq) ? source.faq : [],
      policies: Array.isArray(source.policies) ? source.policies : [],
      features: source.features && typeof source.features === "object" ? source.features : {},
      roomType: Array.isArray(source.roomType) ? source.roomType : [],
      status: requiresVerification ? "pending" : (source.status || "active"),
      commissionRate: source.commissionRate || 10,
    });

    createdHotels.push(hotel);
    hotelIdMap.set(String(source._id), hotel);
  }

  return { hotels: createdHotels, hotelIdMap };
}

async function createRooms(hotelSeedData) {
  const { hotels, hotelIdMap } = hotelSeedData;
  const dumpRooms = loadDumpCollection("rooms");
  const dumpHotels = loadDumpCollection("hotels");

  if (dumpRooms.length === 0) {
    return [];
  }

  const sourceHotelById = new Map(dumpHotels.map((h) => [String(h._id), h]));
  const targetHotelByKey = new Map(
    hotels.map((h) => [`${h.title}::${h.location}`, h])
  );

  const mappedRooms = [];
  for (const sourceRoom of dumpRooms) {
    const sourceHotelId = String(sourceRoom.hotelId);
    let targetHotel = hotelIdMap.get(sourceHotelId);
    if (!targetHotel) {
      const sourceHotel = sourceHotelById.get(sourceHotelId);
      if (sourceHotel) {
        const hotelKey = `${sourceHotel.title}::${sourceHotel.location}`;
        targetHotel = targetHotelByKey.get(hotelKey);
      }
    }
    if (!targetHotel) continue;

    const matchedType =
      targetHotel.roomType.find((t) => t.title === sourceRoom.roomType) ||
      targetHotel.roomType[0];
    if (!matchedType) continue;

    const safeStatus =
      sourceRoom.status === "maintenance"
        ? "maintenance"
        : "available";
    const parsedTypePrice = Number(
      String(matchedType.price || "").replace(/[^\d]/g, "")
    );

    mappedRooms.push({
      roomNumber: sourceRoom.roomNumber,
      hotelId: targetHotel._id,
      roomTypeId: matchedType._id,
      roomType: matchedType.title,
      floorNumber: sourceRoom.floorNumber ?? null,
      price: sourceRoom.price ?? (Number.isFinite(parsedTypePrice) && parsedTypePrice > 0 ? parsedTypePrice : null),
      status: safeStatus,
      currentBookingId: null,
    });
  }

  if (mappedRooms.length === 0) {
    return [];
  }

  return Room.insertMany(mappedRooms, { ordered: false });
}

async function createTours(tourGuides, employees) {
  const dumpTours = loadDumpCollection("tours");
  if (dumpTours.length === 0) {
    throw new Error(`No tours found in dump: ${path.join(DUMP_DIR, "tours.bson")}`);
  }

  const seedStartDate = addDays(new Date(), 10);
  const createdTours = [];

  for (let i = 0; i < dumpTours.length; i += 1) {
    const source = dumpTours[i];
    const guide = tourGuides[i % tourGuides.length];
    const assignedEmployee = employees[i % employees.length];
    const requiresVerification = i < 2;
    const slots = buildTourSlots(addDays(seedStartDate, i * 3), 5);
    const availableMonths = [...new Set(slots.map((s) => formatMonth(new Date(s.startDate))))];

    const sourcePrice = source.price && typeof source.price === "object" ? source.price : {};
    const tour = await Tour.create({
      title: source.title,
      tourGuideId: guide._id,
      assignedEmployeeId: requiresVerification ? null : assignedEmployee._id,
      tags: Array.isArray(source.tags) ? source.tags : [],
      mainImage: source.mainImage,
      rating: source.rating ?? 4.5,
      duration: source.duration || "3 Days",
      startLocation: source.startLocation || source.location || "India",
      description: source.description || `${source.title} curated package`,
      language: source.language || "English",
      price: {
        currency: sourcePrice.currency || "INR",
        amount: sourcePrice.amount || 6500,
        discount: typeof sourcePrice.discount === "number" ? sourcePrice.discount : 0,
      },
      includes: Array.isArray(source.includes) ? source.includes : [],
      destinations: Array.isArray(source.destinations) ? source.destinations : [],
      itinerary: Array.isArray(source.itinerary) ? source.itinerary : [],
      availableMonths,
      bookingDetails: slots,
      maxPeople: source.maxPeople || 20,
      commissionRate: source.commissionRate || 10,
      status: requiresVerification ? "pending" : (source.status || "active"),
    });

    createdTours.push(tour);
  }

  return createdTours;
}

function hotelBookingDetails({ roomType, start, end, status, totalPrice }) {
  const checkIn = isoDate(start);
  const checkOut = isoDate(end);
  return {
    roomTypeId: roomType._id,
    roomType: roomType.title,
    checkIn,
    checkOut,
    checkInDate: checkIn,
    checkOutDate: checkOut,
    startDate: start,
    endDate: end,
    rooms: 1,
    guests: 2,
    status,
    bookingDate: new Date(),
    price: totalPrice,
    totalPrice,
  };
}

function tourBookingDetails({ slot, status, amount, numGuests }) {
  return {
    startDate: slot.startDate,
    startDay: slot.startDay,
    endDate: slot.endDate,
    endDay: slot.endDay,
    numGuests,
    status,
    bookingDate: new Date(),
    pricePerPerson: amount,
    price: amount * numGuests,
  };
}

async function createBookings({ usersByEmail, travelers }, hotels, rooms, tours) {
  const demoUser = usersByEmail.get("user@gmail.com");
  const demoHotelManager = usersByEmail.get("hotelmanager@gmail.com");
  const demoTourGuide = usersByEmail.get("tourguide@gmail.com");

  const demoHotel = hotels.find((h) => String(h.ownerId) === String(demoHotelManager._id)) || hotels[0];
  const demoTour = tours.find((t) => String(t.tourGuideId) === String(demoTourGuide._id)) || tours[0];

  const bookingDocs = [];
  const now = new Date();

  const demoHotelRoomType = demoHotel.roomType[0];
  const demoHotelRooms = rooms.filter(
    (r) =>
      String(r.hotelId) === String(demoHotel._id) &&
      String(r.roomTypeId) === String(demoHotelRoomType._id)
  );

  const demoTourSlot = demoTour.bookingDetails[0];
  bookingDocs.push({
    userId: demoUser._id,
    type: "Hotel",
    itemId: demoHotel._id,
    assignedRoomId: demoHotelRooms[0]?._id || null,
    commissionAmount: 640,
    bookingDetails: hotelBookingDetails({
      roomType: demoHotelRoomType,
      start: addDays(now, 7),
      end: addDays(now, 10),
      status: "booked",
      totalPrice: 6400,
    }),
  });

  bookingDocs.push({
    userId: demoUser._id,
    type: "Tour",
    itemId: demoTour._id,
    commissionAmount: 820,
    bookingDetails: tourBookingDetails({
      slot: demoTourSlot,
      status: "checkedIn",
      amount: 4100,
      numGuests: 2,
    }),
  });

  for (let i = 0; i < 12; i += 1) {
    const traveler = travelers[i % travelers.length];
    const hotel = hotels[i % hotels.length];
    const tour = tours[(i + 2) % tours.length];
    const roomType = hotel.roomType[i % hotel.roomType.length];
    const relatedRoom = rooms.find(
      (room) =>
        String(room.hotelId) === String(hotel._id) &&
        String(room.roomTypeId) === String(roomType._id) &&
        room.status !== "maintenance"
    );

    const status = bookingStatusByIndex(i);
    const hotelStart = addDays(now, -25 + i * 6);
    const hotelEnd = addDays(hotelStart, 2 + (i % 3));
    const slot = tour.bookingDetails[i % tour.bookingDetails.length];
    const hotelPrice = 4300 + i * 300;
    const tourUnitPrice = 3700 + i * 250;
    const guests = 1 + (i % 3);

    bookingDocs.push({
      userId: traveler._id,
      type: "Hotel",
      itemId: hotel._id,
      assignedRoomId:
        status === "booked" || status === "checkedIn" ? relatedRoom?._id || null : null,
      commissionAmount: hotelPrice * 0.1,
      bookingDetails: hotelBookingDetails({
        roomType,
        start: hotelStart,
        end: hotelEnd,
        status,
        totalPrice: hotelPrice,
      }),
    });

    bookingDocs.push({
      userId: traveler._id,
      type: "Tour",
      itemId: tour._id,
      commissionAmount: tourUnitPrice * guests * 0.1,
      bookingDetails: tourBookingDetails({
        slot,
        status,
        amount: tourUnitPrice,
        numGuests: guests,
      }),
    });
  }

  const createdBookings = await Booking.insertMany(bookingDocs);

  const roomMapById = new Map(rooms.map((r) => [String(r._id), r]));
  const roomUpdateMap = new Map();

  for (const booking of createdBookings) {
    const roomId = booking.assignedRoomId ? String(booking.assignedRoomId) : null;
    if (!roomId) continue;

    const currentStatus = booking.bookingDetails?.status;
    if (currentStatus === "booked" || currentStatus === "checkedIn") {
      const room = roomMapById.get(roomId);
      if (room && room.status !== "maintenance") {
        roomUpdateMap.set(roomId, booking._id);
      }
    }
  }

  for (const [roomId, bookingId] of roomUpdateMap) {
    await Room.findByIdAndUpdate(roomId, {
      status: "occupied",
      currentBookingId: bookingId,
    });
  }

  const bookingIdsByUser = new Map();
  for (const booking of createdBookings) {
    const id = String(booking.userId);
    if (!bookingIdsByUser.has(id)) bookingIdsByUser.set(id, []);
    bookingIdsByUser.get(id).push(String(booking._id));
  }

  for (const [userId, bookingIds] of bookingIdsByUser) {
    await User.findByIdAndUpdate(userId, { bookings: bookingIds });
  }

  return createdBookings;
}

async function createCustomTourRequests({ usersByEmail, travelers, tourGuides }) {
  const demoUser = usersByEmail.get("user@gmail.com");
  const backupUser = travelers.find((user) => user.email !== "user@gmail.com") || demoUser;
  const demoGuide = usersByEmail.get("tourguide@gmail.com") || tourGuides[0];

  const firstTripStart = addDays(new Date(), 18);
  const secondTripStart = addDays(new Date(), 35);

  const customTourDocs = [
    {
      userId: demoUser._id,
      title: "Kerala Backwaters & Hills Custom Trip",
      places: ["Alleppey", "Munnar", "Thekkady"],
      hotelRequirements: {
        type: "mid-range",
        preferences: "Near water views and family-friendly stays",
      },
      additionalRequirements: "Need private cab transfers and vegetarian meal options.",
      budget: 45000,
      travelDates: {
        startDate: firstTripStart,
        endDate: addDays(firstTripStart, 5),
      },
      numPeople: 3,
      status: "pending",
    },
    {
      userId: backupUser._id,
      title: "Rajasthan Heritage Circuit",
      places: ["Jaipur", "Jodhpur", "Udaipur"],
      hotelRequirements: {
        type: "luxury",
        preferences: "Heritage stays preferred with airport pickup",
      },
      additionalRequirements: "Looking for curated local food and cultural experiences.",
      budget: 85000,
      travelDates: {
        startDate: secondTripStart,
        endDate: addDays(secondTripStart, 6),
      },
      numPeople: 4,
      status: "assigned",
      assignedTourGuide: demoGuide?._id,
    },
  ];

  return CustomTourRequest.insertMany(customTourDocs);
}

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in backend/.env");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  await clearCollections();
  console.log("Cleared existing collections");

  const userContext = await createUsers();
  console.log("Users seeded");

  if (userContext.hotelManagers.length < 5) {
    throw new Error("Seeding failed: at least 5 hotel managers are required.");
  }
  if (userContext.tourGuides.length < 5) {
    throw new Error("Seeding failed: at least 5 tour guides are required.");
  }

  const hotelSeedData = await createHotels(
    userContext.hotelManagers,
    userContext.employees
  );
  const { hotels } = hotelSeedData;
  const rooms = await createRooms(hotelSeedData);
  const tours = await createTours(userContext.tourGuides, userContext.employees);
  const bookings = await createBookings(userContext, hotels, rooms, tours);
  const customTours = await createCustomTourRequests(userContext);

  console.log("Seeding completed");
  console.log(
    JSON.stringify(
      {
        users: await User.countDocuments(),
        hotels: hotels.length,
        rooms: rooms.length,
        tours: tours.length,
        bookings: bookings.length,
        customTourRequests: customTours.length,
        demoAccounts: [
          "user@gmail.com",
          "hotelmanager@gmail.com",
          "tourguide@gmail.com",
          "admin@gmail.com",
          "employee@gmail.com",
          "owner@gmail.com",
        ],
        demoPassword: DEFAULT_PASSWORD,
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
