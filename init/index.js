require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const mongoUrl = process.env.ATLASDB_URL || process.env.MONGO_URL;

if (!mongoUrl) throw new Error("Set ATLASDB_URL (or MONGO_URL) before seeding.");
if (process.env.CONFIRM_SEED !== "true") {
  throw new Error("Seeding deletes all listings. Set CONFIRM_SEED=true to continue.");
}

async function seed() {
  await mongoose.connect(mongoUrl);
  const username = process.env.SEED_ADMIN_USERNAME || "demo-admin";
  const email = process.env.SEED_ADMIN_EMAIL || "demo@example.com";
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password) throw new Error("Set SEED_ADMIN_PASSWORD before seeding.");

  let owner = await User.findOne({ username });
  if (!owner) owner = await User.register(new User({ username, email }), password);

  await Listing.deleteMany({});
  const listings = initData.data.map((listing) => ({
    ...listing,
    owner: owner._id,
  }));
  await Listing.insertMany(listings);
  console.log(`Seeded ${listings.length} listings for ${username}.`);
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
