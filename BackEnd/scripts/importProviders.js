import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import providerModel from "../models/provider.js";
import providersImportData from "./providers.import.data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");

dotenv.config({ path: envPath });

const toObjectId = (value) => {
  if (!value) return null;
  return new mongoose.Types.ObjectId(String(value));
};

const toDate = (value) => {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const normalizeProvider = (item) => {
  const images = Array.isArray(item.images)
    ? item.images.filter(Boolean)
    : item.images
      ? [item.images]
      : [];

  return {
    _id: toObjectId(item._id),
    user_id: toObjectId(item.user_id),
    provider_name: item.provider_name,
    career: item.career,
    email: item.email?.toLowerCase(),
    images,
    status: item.status || "approved",
    profile: item.profile || "",
    createdAt: toDate(item.createdAt),
    updatedAt: toDate(item.updatedAt),
  };
};

async function run() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI in .env");
  }

  await mongoose.connect(mongoUri);

  try {
    const docs = providersImportData.map(normalizeProvider);

    const operations = docs.map((doc) => {
      const { _id, ...rest } = doc;

      return {
        updateOne: {
          filter: _id ? { _id } : { email: rest.email },
          update: { $set: rest },
          upsert: true,
        },
      };
    });

    const result = await providerModel.bulkWrite(operations, {
      ordered: false,
    });

    console.log(
      JSON.stringify(
        {
          message: "Imported providers to MongoDB",
          totalInput: docs.length,
          insertedCount: result.upsertedCount,
          modifiedCount: result.modifiedCount,
          matchedCount: result.matchedCount,
        },
        null,
        2,
      ),
    );
  } finally {
    await mongoose.disconnect();
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
