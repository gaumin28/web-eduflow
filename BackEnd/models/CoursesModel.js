import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    provider_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    course_title: { type: String, required: true },
    price: { type: Number, required: true },
    price_promotion: { type: Number, default: null },
    image_url: String,
    video_url: String,
    description: String,
    total_sections: Number,
    total_lectures: Number,
    students: { type: Number, default: 0 },
    duration: { type: String, default: null },
    feature: { type: Boolean, default: false },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);
const courseModel = mongoose.model("Course", courseSchema);

export default courseModel;
