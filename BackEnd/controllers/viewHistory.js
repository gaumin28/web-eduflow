import viewHistoryModel from "../models/viewHistory.js";
import courseModel from "../models/course/course.js";

// Record a course view
export const recordView = async (req, res) => {
  try {
    const userId = req.user.userId; // provided by authMiddleware
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Thiếu courseId" });
    }

    // Upsert the view history record
    await viewHistoryModel.findOneAndUpdate(
      { user_id: userId, course_id: courseId },
      { viewedAt: Date.now() },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: "Đã lưu lịch sử xem" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get recently viewed courses for a user
export const getRecentlyViewed = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Lấy top 10 khóa học gần nhất
    const history = await viewHistoryModel
      .find({ user_id: userId })
      .sort({ viewedAt: -1 })
      .limit(10)
      .populate({
        path: "course_id",
        select: "course_title image_url price price_promotion students provider_id duration isActive",
        populate: {
          path: "provider_id",
          select: "provider_name"
        }
      });

    // Lọc bỏ những course không tồn tại hoặc không active
    const validCourses = history
      .map(item => item.course_id)
      .filter(course => course && course.isActive !== false);

    const data = validCourses.map(c => ({
      _id: c._id,
      course_title: c.course_title,
      image_url: c.image_url,
      price: c.price,
      price_promotion: c.price_promotion,
      students: c.students,
      provider: c.provider_id?.provider_name,
      duration: c.duration,
    }));

    return res.status(200).json({ message: "Thành công", data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
