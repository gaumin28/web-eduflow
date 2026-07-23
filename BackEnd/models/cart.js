import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    course_title: {
      type: String,
      required: true,
    },
    instructor: {
      type: String,
      default: "Unknown Instructor",
    },
    image_url: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    original_price: {
      type: Number,
      default: null,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const cartModel = mongoose.model("Cart", cartSchema);

export default cartModel;
