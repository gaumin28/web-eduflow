import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseSection",
      required: true,
      unique: true // Mỗi section chỉ có 1 quiz
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const quizModel = mongoose.model("Quiz", quizSchema);

export default quizModel;