import mongoose from "mongoose";

const courseRequestSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  request_name: { type: String, required: true }
});
    const courseRequestModel = mongoose.model("CourseRequest", courseRequestSchema);
    
export default courseRequestModel;