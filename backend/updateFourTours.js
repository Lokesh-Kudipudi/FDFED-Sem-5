require("dotenv").config();
const mongoose = require("mongoose");

const updates = [
  {
    title: "Mysore Palace & Culture",
    images: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800"
    ]
  },
  {
    title: "Udaipur Lake City Romance",
    images: [
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800"
    ]
  },
  {
    title: "Darjeeling Tea & Mountains",
    images: [
      "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800",
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800"
    ]
  },
  {
    title: "Rann of Kutch - White Desert",
    images: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800"
    ]
  }
];

async function updateTours() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const toursCollection = db.collection("tours");

    for (const update of updates) {
      const result = await toursCollection.updateOne(
        { title: update.title },
        { $set: { images: update.images, mainImage: update.images[0] } }
      );

      if (result.matchedCount > 0) {
        console.log(`✅ Updated: ${update.title}`);
      } else {
        console.log(`❌ Not found: ${update.title}`);
      }
    }

    await mongoose.connection.close();
    console.log("\n✨ Done!");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

updateTours();
