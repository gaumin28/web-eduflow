import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  cate_name: {
    type: String,
    required: true,
  },
  icon_key: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
});
const categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;
