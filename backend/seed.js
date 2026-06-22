import "dotenv/config";
import connectDB from "./src/config/db.js";
import User from "./src/models/User.js";

// This seed only populates the USERS cluster (accounts).
// Property listings live in their own cluster and are left untouched.
const seed = async () => {
  try {
    connectDB();

    await User.deleteMany();

    // Shared dev password so any seeded account can log in for testing.
    const DEFAULT_PASSWORD = "Password123!";

    const agencies = await User.create([
      {
        firstName: "Liron",
        lastName: "Gold",
        email: "liron.gold@ta-realty.co.il",
        phone: "+972-54-123-4567",
        role: "Agency",
        password: DEFAULT_PASSWORD,
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
        password: DEFAULT_PASSWORD,
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
        password: DEFAULT_PASSWORD,
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
        password: DEFAULT_PASSWORD,
      },
      {
        firstName: "Amit",
        lastName: "Levi",
        email: "amit.levi@example.com",
        phone: "+972-54-333-4444",
        role: "Buyer",
        password: DEFAULT_PASSWORD,
      },
      {
        firstName: "Shira",
        lastName: "Kaplan",
        email: "shira.kaplan@example.com",
        phone: "+972-50-555-6666",
        role: "Buyer",
        password: DEFAULT_PASSWORD,
      },
    ]);

    // 4 admin accounts (basic, for the project only).
    const admins = await User.create([
      {
        firstName: "Omri",
        lastName: "Admin",
        email: "admin1@realestate.local",
        role: "Admin",
        password: "admin123",
      },
      {
        firstName: "Dan",
        lastName: "Admin",
        email: "admin2@realestate.local",
        role: "Admin",
        password: "admin123",
      },
      {
        firstName: "Tal",
        lastName: "Admin",
        email: "admin3@realestate.local",
        role: "Admin",
        password: "admin123",
      },
      {
        firstName: "Daniel",
        lastName: "Admin",
        email: "admin4@realestate.local",
        role: "Admin",
        password: "admin123",
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

    console.log("User seed created successfully (USERS cluster):");
    console.log(`- Agencies: ${agencies.length}`);
    console.log(`- Buyers: ${buyers.length}`);
    console.log(`- Admins: ${admins.length}`);
    console.log("Property listings were left untouched.");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seed();
