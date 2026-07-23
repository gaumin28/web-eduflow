import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  section_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseSection",
    required: true
  },
  title: String,
  duration: String,
  preview: {
    type: Boolean,
    default: false
  },
  vid_lectures_url: {
    type: String,
    default: null
  },
  order: {
    type: Number,
    required: true,
  },
}
,
{
  timestamps: true,
}
);

    const lectureModel = mongoose.model("Lecture", lectureSchema);
    
export default lectureModel;