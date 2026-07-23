import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

import userModel from "../models/user.js";
import providerModel from "../models/provider.js";
import categoryModel from "../models/category.js";
import courseModel from "../models/course/course.js";

dotenv.config();

const DEFAULT_USER_EMAIL = "instructor.seed@eduflow.local";
const DEFAULT_USERNAME = "instructor.seed";
const DEFAULT_PROVIDER_NAME = "EduFlow Demo Instructor";
const DEFAULT_PASSWORD = "Password123!";

const CATEGORY_SEEDS = [
  { cate_name: "Web Development", icon_key: "web" },
  { cate_name: "Data Science", icon_key: "data" },
  { cate_name: "Mobile Development", icon_key: "mobile" },
  { cate_name: "Language Learning", icon_key: "language" },
  { cate_name: "Game Development", icon_key: "game" },
];

const TITLES = [
  "Complete {topic} Masterclass",
  "{topic} Fundamentals for Beginners",
  "Advanced {topic} Bootcamp",
  "Practical {topic} Projects",
  "{topic} from Zero to Hero",
  "Professional {topic} Workflow",
];

const TOPICS = {
  web: ["React", "Node.js", "TypeScript", "Next.js", "MongoDB"],
  data: ["Python", "SQL", "Machine Learning", "Data Analysis"],
  mobile: ["Flutter", "React Native", "SwiftUI", "Android"],
  language: ["English", "Japanese", "Korean", "Chinese"],
  game: ["Unity", "Game Design", "3D Modeling", "Unreal Engine"],
};

const getRandomItem = (items) =>
  items[Math.floor(Math.random() * items.length)];

const buildCourseTitle = (categoryName) => {
  const key = categoryName.toLowerCase();
  const topicGroup = Object.entries(TOPICS).find(([group]) =>
    key.includes(group),
  )?.[1] ?? [categoryName];
  return getRandomItem(TITLES).replace("{topic}", getRandomItem(topicGroup));
};

const buildCourseDoc = (providerId, category, index) => {
  const price = 149000 + index * 50000;
  const pricePromotion = index % 3 === 0 ? Math.floor(price * 0.8) : null;

  return {
    category_id: category._id,
    provider_id: providerId,
    course_title: `${buildCourseTitle(category.cate_name)} #${index}`,
    price,
    price_promotion: pricePromotion,
    image_url: `https://picsum.photos/seed/eduflow-course-${providerId}-${index}/900/600`,
    video_url: null,
    description: `Demo course for ${category.cate_name.toLowerCase()} created by the instructor seeder.`,
    total_sections: 4 + (index % 4),
    total_lectures: 16 + index * 2,
    students: 120 + index * 35,
    duration: `${8 + index}h`,
    feature: index <= 3,
    isActive: true,
  };
};

export async function ensureSeedReferenceData() {
  const existingCategories = await categoryModel.find();

  if (existingCategories.length === 0) {
    return categoryModel.insertMany(CATEGORY_SEEDS);
  }

  return existingCategories;
}

export async function ensureDemoProvider() {
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  let user = await userModel.findOne({ email: DEFAULT_USER_EMAIL });
  if (!user) {
    user = await userModel.create({
      email: DEFAULT_USER_EMAIL,
      username: DEFAULT_USERNAME,
      password: hashedPassword,
      role: "provider",
      isActive: true,
    });
  }

  let provider = await providerModel.findOne({ user_id: user._id });
  if (!provider) {
    provider = await providerModel.create({
      user_id: user._id,
      provider_name: DEFAULT_PROVIDER_NAME,
      career: "Senior Full-Stack Instructor",
      email: DEFAULT_USER_EMAIL,
      images: [],
      status: "approved",
    });
  }

  return { user, provider };
}

export async function seedCoursesForProvider({
  providerId,
  count = 6,
  replaceExisting = false,
}) {
  const provider = await providerModel.findById(providerId);

  if (!provider) {
    throw new Error("Provider not found");
  }

  const categories = await categoryModel.find();
  if (categories.length === 0) {
    throw new Error("No categories available to seed courses");
  }

  if (replaceExisting) {
    await courseModel.deleteMany({ provider_id: providerId });
  }

  const payload = Array.from({ length: count }, (_, index) => {
    const category = categories[index % categories.length];
    return buildCourseDoc(providerId, category, index + 1);
  });

  const createdCourses = await courseModel.insertMany(payload);

  return {
    provider: {
      _id: provider._id,
      provider_name: provider.provider_name,
      email: provider.email,
    },
    total: createdCourses.length,
    data: createdCourses,
  };
}

async function run() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI in environment");
  }

  await mongoose.connect(mongoUri);

  try {
    await ensureSeedReferenceData();
    const { provider } = await ensureDemoProvider();
    const result = await seedCoursesForProvider({
      providerId: provider._id,
      count: 6,
      replaceExisting: true,
    });

    console.log(
      JSON.stringify(
        {
          message: "Seeded instructor course data",
          provider: result.provider,
          total: result.total,
        },
        null,
        2,
      ),
    );
  } finally {
    await mongoose.disconnect();
  }
}

const isDirectRun =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectRun) {
  run().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
