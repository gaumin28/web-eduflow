import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // Các chương đã mở
    unlocked_section_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseSection",
      },
    ],

    // Các bài giảng đã mở
    unlocked_lecture_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],

    // Các bài giảng đã học xong
    completed_lecture_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],

    // các bài giảng đang học
    current_lecture_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
        default: null,
    },

    // Các quiz đã hoàn thành
    completed_quiz_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],
  },
  {
    timestamps: true,
  }
);

courseProgressSchema.index(
  {
    user_id: 1,
    course_id: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "CourseProgress",
  courseProgressSchema
);