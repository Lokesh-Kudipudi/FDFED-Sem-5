require("dotenv").config();
const mongoose = require("mongoose");

const tourImageUpdates = [
  {
    title: "Mysore palace & Culture",
    images: [
      "https://imgs.search.brave.com/cxS5SZMeFsY47T-7ziK8RT6qNyeJx0mIvpRPPFManRk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/c2h1dHRlcnN0b2Nr/LmNvbS9pbWFnZS1w/aG90by9teXNvcmUt/cGFsYWNlLWluZGlh/LTI2MG53LTEyMjMy/MjY0My5qcGc",
      "https://imgs.search.brave.com/41SGCXJl9Nj4F9iaAb9HK2cYPgVAIJSLJSI21vWlAeU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ieG15/c3VydS5jb20vd3At/Y29udGVudC91cGxv/YWRzLzIwMjIvMDEv/YnhteXN1cnUtcGFs/YWNlLmpwZw"
    ]
  },
  {
    title: "Udaipur Lake City and Romance",
    images: [
      "https://imgs.search.brave.com/eUO2x9b-7fY629K9rplZZ5kmZooGRNJP-Rp90deQV5k/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9sYWtl/LXBpY2hvbGEtY2l0/eS1wYWxhY2UtdWRh/aXB1ci1pbmRpYS1r/bm93bi1hcy1sYWtl/cy1hcGFydC1pdHMt/aGlzdG9yeS1jdWx0/dXJlLXNjZW5pYy1s/b2NhdGlvbnMtMzUy/NzcyMzIuanBn",
      "https://imgs.search.brave.com/lAWVEBHJFtRNH2fvOKdAPWCoIWNqv5XMwUCp32Z1Fq4/rs:fit:500:0:1:0/g:ce/aHR0cDovL3d3dy5r/YWxpdHJhdmVsLm5l/dC9ibG9nL3dwLWNv/bnRlbnQvdXBsb2Fk/cy91ZGFpcHVyLWNp/dHktcGFsYWNlLWFj/cm9zcy1waWNob2xp/LWxha2UtaW5kaWEu/anBn"
    ]
  },
  {
    title: "Darjeeling tea & mountains",
    images: [
      "https://imgs.search.brave.com/F_JWHzBCX-svt4_zNcznuCIi3Z59ykFqk7r_1VL59BI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNTAz/OTA5MTE3L3Bob3Rv/L2ZlbWFsZS1sYWJv/ci13b3JrZXJzLWhh/cnZlc3RpbmctdGVh/LW9uLWEtaGlsbHNp/ZGUuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPWRpZHRlc2Yx/d3dMaWdBNkdtOGxn/VjlBQkE4ekJ5N2NH/Z0xTU1M5UmNwbGM9",
      "https://imgs.search.brave.com/9ZADV0pGp3E-qHdSXpaAko64gfboMiftPbkWDyT0S-s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/ZnRkLnRyYXZlbC91/cGxvYWQvYXR0cmFj/dGlvbl9pbWFnZS90/aHVtYnMvMjAxMi0x/MS0xMC0wOC0xMy00/NWRhcmplZWxpbmct/dGVhLWdhcmRlbi5q/cGc"
    ]
  },
  {
    title: "Rann of Kutch",
    images: [
      "https://imgs.search.brave.com/TZRnf7VRbokdNAr8idUbtB2J0xSlJeOd-IhABukXp80/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzhkLzVk/L2YwLzhkNWRmMDg3/OWEyNDFjMGQxOTdk/MThkZWY0OWQ2MDVm/LmpwZw",
      "https://imgs.search.brave.com/LC0vcSKZPOM9vGDIeVEIAj4cZGYCAQBjg_lTVsjx9jM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ndW1s/ZXQuYXNzZXR0eXBl/LmNvbS9vdXRsb29r/dHJhdmVsbGVyL2lt/cG9ydC9vdXRsb29r/dHJhdmVsbGVyL3B1/YmxpYy91cGxvYWRz/L2FydGljbGVzL2V4/cGxvcmUvVGhlX1Jh/bm5fb2ZfS3V0Y2hf/R3VqYXJhdF9JbmRp/YS5qcGc"
    ]
  },
  {
    title: "Jim Corbett Tiger Safari",
    images: [
      "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=800",
      "https://images.unsplash.com/photo-1564507592333-c60657eead43?w=800"
    ]
  },
  {
    title: "Meghalaya - Abode of Clouds",
    images: [
      "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800",
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800"
    ]
  },
  {
    title: "Pondicherry French Colony",
    images: [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800"
    ]
  },
  {
    title: "Sundarbans Mangrove Safari",
    images: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800"
    ]
  },
  {
    title: "Golden Temple & Amritsar",
    images: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
      "https://images.unsplash.com/photo-1564507592333-c60657eead43?w=800"
    ]
  },
  {
    title: "Coorg Coffee Plantations",
    images: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800",
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800"
    ]
  },
  {
    title: "Jaisalmer Desert Safari",
    images: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800"
    ]
  },
  {
    title: "Khajuraho Temples & Erotica",
    images: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800"
    ]
  },
  {
    title: "Kaziranga Rhino Safari",
    images: [
      "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=800",
      "https://images.unsplash.com/photo-1564507592333-c60657eead43?w=800"
    ]
  },
  {
    title: "Ooty - Queen of Hill Stations",
    images: [
      "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800",
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800"
    ]
  },
  {
    title: "Ajanta & Ellora Caves",
    images: [
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800",
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800"
    ]
  },
  {
    title: "Mahabalipuram Temple Tour",
    images: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800"
    ]
  },
  {
    title: "Shimla Colonial Charm",
    images: [
      "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800",
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800"
    ]
  },
  {
    title: "Sikkim & Nathula Pass",
    images: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800"
    ]
  },
  {
    title: "Konark Sun Temple & Odisha",
    images: [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800"
    ]
  },
  {
    title: "Gokarna Beach Trek",
    images: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800"
    ]
  },
  {
    title: "Spiti Valley Expedition",
    images: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800"
    ]
  },
  {
    title: "Nainital Lake District",
    images: [
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800",
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800"
    ]
  },
  {
    title: "Valley of Flowers Trek",
    images: [
      "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800",
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800"
    ]
  },
  {
    title: "Gir National Park Lions",
    images: [
      "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=800",
      "https://images.unsplash.com/photo-1564507592333-c60657eead43?w=800"
    ]
  },
  {
    title: "Puri Jagannath Yatra",
    images: [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800"
    ]
  },
  {
    title: "Munnar Tea Gardens",
    images: [
      "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800",
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800"
    ]
  },
  {
    title: "Lakshadweep Coral Reefs",
    images: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800"
    ]
  },
  {
    title: "Jodhpur Blue City",
    images: [
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800"
    ]
  }
];

async function updateTourImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const toursCollection = db.collection("tours");

    let updatedCount = 0;
    let notFoundCount = 0;

    for (const update of tourImageUpdates) {
      const result = await toursCollection.updateOne(
        { title: update.title },
        { 
          $set: { 
            images: update.images,
            mainImage: update.images[0]
          } 
        }
      );

      if (result.matchedCount > 0) {
        console.log(`✅ Updated: ${update.title}`);
        updatedCount++;
      } else {
        console.log(`❌ Not found: ${update.title}`);
        notFoundCount++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Updated: ${updatedCount} tours`);
    console.log(`❌ Not found: ${notFoundCount} tours`);
    console.log(`📝 Total processed: ${tourImageUpdates.length} tours`);

    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
  } catch (error) {
    console.error("Error updating tour images:", error);
    process.exit(1);
  }
}

updateTourImages();
