
import notificationModel from "../models/NotificationModel.js";

// Admin

// API LẤY THÔNG BÁO CHO ADMIN
// Endpoint: GET /api/admin/notifications
export const getAdminNotifications = async (req, res) => {
  try {
    // Admin CHỈ xem các thông báo có type liên quan đến hệ thống/đăng ký đối tác
    // Hoặc những thông báo không chỉ định receiver đích danh (receiver: null hoặc trống)
    const notifications = await notificationModel.find({
      $or: [
        { type: "registration" },
        { receiver: { $exists: false } },
        { receiver: null }
      ]
    })
    .populate("sender", "username email avatar role")
    .sort({ createdAt: -1 });

    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Đánh dấu đọc tất cả
export const markAllAsRead = async (req, res) => {
  try {
    await notificationModel.updateMany({ isRead: false }, { $set: { isRead: true } });
    return res.status(200).json({ message: "Đã đọc tất cả" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Đánh dấu đọc từng thông báo một
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params; 

    const updatedNotification = await notificationModel.findByIdAndUpdate(
      id,
      { $set: { isRead: true } },
      { new: true } // Trả về data sau khi đã update thành công
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: "Không tìm thấy thông báo này" });
    }

    return res.status(200).json({ message: "Đã đánh dấu đã đọc thông báo", data: updatedNotification });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Customer

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.userId; // Lấy từ token đã qua authMiddleware

    // CHỈ lấy thông báo mà người nhận (receiver) chính là UserId này
    const notifications = await notificationModel.find({ receiver: userId })
      .populate("sender", "username email avatar role")
      .sort({ createdAt: -1 }); // Thông báo mới nhất lên đầu

    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Đánh dấu đọc tất cả
export const markAllAsReadUser = async (req, res) => {
  try {
    await notificationModel.updateMany({ receiver: req.user.userId, isRead: false }, { $set: { isRead: true } });
    return res.status(200).json({ message: "Đã đọc tất cả" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Đánh dấu đọc từng thông báo một
export const markNotificationAsReadUser = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedNotification = await notificationModel.findByIdAndUpdate(
      id,
      { $set: { isRead: true } },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: "Không tìm thấy thông báo này" });
    }

    return res.status(200).json({ message: "Đã đánh dấu đọc", data: updatedNotification });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};