import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import User from "./src/models/User.js";
import Property from "./src/models/Property.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([User.deleteMany(), Property.deleteMany()]);

    const agencies = await User.create([
      {
        firstName: "Liron",
        lastName: "Gold",
        email: "liron.gold@ta-realty.co.il",
        phone: "+972-54-123-4567",
        role: "Agency",
        agencyName: "Tel Aviv Realty Group",
        licenseNumber: "TA-1138",
        officeAddress: "Rothschild Blvd 20, Tel Aviv",
      },
      {
        firstName: "Maya",
        lastName: "Ben-Ami",
        email: "maya@hayarkonhomes.co.il",
        phone: "+972-52-987-6543",
        role: "Agency",
        agencyName: "HaYarkon Homes",
        licenseNumber: "TA-2045",
        officeAddress: "Yarkon Street 12, Tel Aviv",
      },
      {
        firstName: "Noam",
        lastName: "Sharabi",
        email: "noam@nevetzedek.agency",
        phone: "+972-54-321-9876",
        role: "Agency",
        agencyName: "Neve Tzedek Agency",
        licenseNumber: "TA-3301",
        officeAddress: "Shabazi Street 8, Tel Aviv",
      },
    ]);

    const buyers = await User.create([
      {
        firstName: "Noa",
        lastName: "Cohen",
        email: "noa.cohen@example.com",
        phone: "+972-52-111-2222",
        role: "Buyer",
      },
      {
        firstName: "Amit",
        lastName: "Levi",
        email: "amit.levi@example.com",
        phone: "+972-54-333-4444",
        role: "Buyer",
      },
      {
        firstName: "Shira",
        lastName: "Kaplan",
        email: "shira.kaplan@example.com",
        phone: "+972-50-555-6666",
        role: "Buyer",
      },
    ]);

    const properties = await Property.create([
      {
        img: "https://example.com/images/florentin-loft.jpg",
        price: 5100000,
        street: "Lilienblum 25",
        city: "Tel Aviv",
        type: "Apartment",
        rooms: 3,
        floor: 4,
        size: 82,
        tags: ["Balcony", "Renovated", "Central"],
        listingType: "premium",
        videoUrl: "https://example.com/videos/florentin-loft.mp4",
        info1: "Modern apartment with open kitchen in Florentin.",
        listedBy: agencies[0]._id,
      },
      {
        img: "https://example.com/images/neve-tzedek-penthouse.jpg",
        price: 12450000,
        street: "Shabazi 3",
        city: "Tel Aviv",
        type: "Penthouse",
        rooms: 5,
        floor: 8,
        size: 170,
        tags: ["Roof Deck", "Sea View", "Bright"],
        listingType: "premium",
        videoUrl: "https://example.com/videos/neve-tzedek-penthouse.mp4",
        info1: "Luxury penthouse close to the Neve Tzedek promenade.",
        listedBy: agencies[2]._id,
      },
      {
        img: "https://example.com/images/old-jaffa-house.jpg",
        price: 7800000,
        street: "HaMetsuda 14",
        city: "Tel Aviv",
        type: "House",
        rooms: 4,
        floor: 2,
        size: 135,
        tags: ["Garden", "Patio", "Historic"],
        listingType: "standard",
        info1: "Spacious house in Old Jaffa with private garden.",
        listedBy: agencies[1]._id,
      },
      {
        img: "https://example.com/images/azure-beach-apartment.jpg",
        price: 3650000,
        street: "Bograshov 47",
        city: "Tel Aviv",
        type: "Apartment",
        rooms: 2,
        floor: 5,
        size: 58,
        tags: ["Beachfront", "Air Conditioning", "Quiet"],
        listingType: "standard",
        info1: "Cozy beachside apartment in the heart of Tel Aviv.",
        listedBy: agencies[0]._id,
      },
      {
        img: "https://example.com/images/gordon-villas.jpg",
        price: 8950000,
        street: "Gordon 98",
        city: "Tel Aviv",
        type: "Apartment",
        rooms: 4,
        floor: 7,
        size: 120,
        tags: ["Renovated", "Elevator", "Parking"],
        listingType: "standard",
        info1: "Large apartment near Gordon Beach and shopping.",
        listedBy: agencies[1]._id,
      },
    ]);

    buyers[0].following.push(agencies[0]._id, agencies[2]._id);
    buyers[1].following.push(agencies[1]._id);
    agencies[0].followers.push(buyers[0]._id);
    agencies[1].followers.push(buyers[1]._id);
    agencies[2].followers.push(buyers[0]._id);

    await Promise.all([
      buyers[0].save(),
      buyers[1].save(),
      agencies[0].save(),
      agencies[1].save(),
      agencies[2].save(),
    ]);

    console.log("Seed data created successfully:");
    console.log(`- Agencies: ${agencies.length}`);
    console.log(`- Buyers: ${buyers.length}`);
    console.log(`- Properties: ${properties.length}`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seed();
