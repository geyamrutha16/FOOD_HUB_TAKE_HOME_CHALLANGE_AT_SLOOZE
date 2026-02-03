import mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import { getDatabaseUrl } from "../src/config/database";

// Enums
enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  MEMBER = "MEMBER",
}

enum Country {
  INDIA = "INDIA",
  AMERICA = "AMERICA",
}

// Schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  country: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const restaurantSchema = new mongoose.Schema({
  name: String,
  country: String,
  createdAt: { type: Date, default: Date.now },
});

const menuItemSchema = new mongoose.Schema({
  restaurantId: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Restaurant = mongoose.model("Restaurant", restaurantSchema);
const MenuItem = mongoose.model("MenuItem", menuItemSchema);

async function seed() {
  try {
    await mongoose.connect(getDatabaseUrl());
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    console.log("Cleared existing data");

    // Seed users
    const users = await User.insertMany([
      {
        name: "Nick Fury",
        email: "nick.fury@example.com",
        password: await bcrypt.hash("password", 10),
        role: Role.ADMIN,
        country: null, // Admin has global access
      },
      {
        name: "Captain Marvel",
        email: "captain.marvel@example.com",
        password: await bcrypt.hash("password", 10),
        role: Role.MANAGER,
        country: Country.INDIA,
      },
      {
        name: "Captain America",
        email: "captain.america@example.com",
        password: await bcrypt.hash("password", 10),
        role: Role.MANAGER,
        country: Country.AMERICA,
      },
      {
        name: "Thanos",
        email: "thanos@example.com",
        password: await bcrypt.hash("password", 10),
        role: Role.MEMBER,
        country: Country.INDIA,
      },
      {
        name: "Thor",
        email: "thor@example.com",
        password: await bcrypt.hash("password", 10),
        role: Role.MEMBER,
        country: Country.INDIA,
      },
      {
        name: "Travis",
        email: "travis@example.com",
        password: await bcrypt.hash("password", 10),
        role: Role.MEMBER,
        country: Country.AMERICA,
      },
    ]);
    console.log(`Seeded ${users.length} users`);

    // Seed restaurants
    const indiaR1 = await Restaurant.create({
      name: "Tasty India",
      country: Country.INDIA,
    });
    const indiaR2 = await Restaurant.create({
      name: "Curry House",
      country: Country.INDIA,
    });
    const indiaR3 = await Restaurant.create({
      name: "Spice Corner",
      country: Country.INDIA,
    });
    const indiaR4 = await Restaurant.create({
      name: "Masala Magic",
      country: Country.INDIA,
    });

    const usaR1 = await Restaurant.create({
      name: "Burger Haven",
      country: Country.AMERICA,
    });
    const usaR2 = await Restaurant.create({
      name: "Pasta Place",
      country: Country.AMERICA,
    });
    const usaR3 = await Restaurant.create({
      name: "Taco Town",
      country: Country.AMERICA,
    });
    const usaR4 = await Restaurant.create({
      name: "Sushi Corner",
      country: Country.AMERICA,
    });

    const restaurants = [
      indiaR1,
      indiaR2,
      indiaR3,
      indiaR4,
      usaR1,
      usaR2,
      usaR3,
      usaR4,
    ];
    console.log(`Seeded ${restaurants.length} restaurants`);

    // Seed menu items
    const restaurantData = [
      { id: indiaR1._id, prefix: "Tasty" },
      { id: indiaR2._id, prefix: "Curry" },
      { id: indiaR3._id, prefix: "Spice" },
      { id: indiaR4._id, prefix: "Masala" },
      { id: usaR1._id, prefix: "Burger" },
      { id: usaR2._id, prefix: "Pasta" },
      { id: usaR3._id, prefix: "Taco" },
      { id: usaR4._id, prefix: "Sushi" },
    ];

    let menuItemCount = 0;
    for (const { id, prefix } of restaurantData) {
      for (let i = 1; i <= 5; i++) {
        await MenuItem.create({
          restaurantId: id,
          name: `${prefix} Item ${i}`,
          price: i * 2 + 1.5,
          imageUrl: `https://th.bing.com/th/id/R.f22f8d9bf2bc8f0c2e3dd8b755230747?rik=Ih10oKxnBJi1jQ&riu=http%3a%2f%2fshopsuki.ph%2fcdn%2fshop%2fcollections%2fClassic_Burger_1024x.jpg%3fv%3d1644488722&ehk=yubuq2PbH5zuYM2DTBefKiqV5al2UV44mlMdP1dBPpo%3d&risl=&pid=ImgRaw&r=0`,
        });
        menuItemCount++;
      }
    }
    console.log(`Seeded ${menuItemCount} menu items`);

    console.log("✅ Seed completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
