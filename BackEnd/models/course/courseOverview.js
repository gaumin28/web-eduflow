import mongoose from "mongoose";

const overviewSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  overview_name: { type: String, required: true }
});
    const courseOverviewModel = mongoose.model("CourseOverview", overviewSchema);
    
export default courseOverviewModel;