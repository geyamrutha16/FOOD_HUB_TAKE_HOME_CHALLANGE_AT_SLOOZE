import "dotenv/config";

export const getDatabaseUrl = (): string => {
  if (!process.env.MONGO_URI) {
    throw new Error("❌ MONGO_URI is not defined in environment variables");
  }

  console.log("✅ Database URL loaded");
  console.log("Database URL:", process.env.MONGO_URI);
  return process.env.MONGO_URI;
};
