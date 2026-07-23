import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    }, 
    receiver: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
    }, 
    title: { 
        type: String, 
        required: true 
    }, 
    content: { 
        type: String, 
        required: true 
    }, 
    type: { 
        type: String, 
        enum: ["registration", "system", "payment", "approved", "rejected"], 
        default: "registration" 
    }, 
    isRead: { type: Boolean, default: false }, 
    link: String, // 🟢 Đã xóa bỏ dòng type: String bị trùng lặp
  },
  { timestamps: true } 
);

const notificationModel = mongoose.model("Notification", notificationSchema);

export default notificationModel;