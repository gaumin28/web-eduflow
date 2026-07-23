import mongoose from "mongoose";

const viewHistorySchema = new mongoose.Schema(
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
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Ensure a user has only one record per course to easily track the latest view
viewHistorySchema.index({ user_id: 1, course_id: 1 }, { unique: true });

const viewHistoryModel = mongoose.model("ViewHistory", viewHistorySchema);
export default viewHistoryModel;
