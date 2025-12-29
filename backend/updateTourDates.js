require("dotenv").config();
const mongoose = require("mongoose");

async function updateTourDates() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const toursCollection = db.collection("tours");

    const tours = await toursCollection.find({}).toArray();
    console.log(`Found ${tours.length} tours. Checking dates...`);

    let updatedCount = 0;

    for (const tour of tours) {
      if (!tour.bookingDetails || !Array.isArray(tour.bookingDetails)) continue;

      let hasChanges = false;
      const newBookingDetails = tour.bookingDetails.map(booking => {
        const startDate = new Date(booking.startDate);
        const endDate = new Date(booking.endDate);
        
        // Check if date is in 2025
        if (startDate.getFullYear() === 2025) {
            startDate.setFullYear(2026);
            hasChanges = true;
        }
        
        if (endDate.getFullYear() === 2025) {
            endDate.setFullYear(2026);
             hasChanges = true;
        }

        return {
            ...booking,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        };
      });

      if (hasChanges) {
        await toursCollection.updateOne(
            { _id: tour._id },
            { $set: { bookingDetails: newBookingDetails } }
        );
        updatedCount++;
        console.log(`✅ Updated dates for: ${tour.title}`);
      }
    }

    console.log(`\n✨ Update Complete! Modified ${updatedCount} tours.`);
    await mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

updateTourDates();
