const mongoose = require("mongoose");
const User = require("../models/user");
require("dotenv").config();

async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);

  const admin = new User({
    username: "admin",
    email: "admin@gmail.com",
    isAdmin: true
  });

  await User.register(admin, "admin123");

  console.log("✅ Admin created");
  mongoose.connection.close();
}

main();
