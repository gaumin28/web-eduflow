import userModel from "../models/user.js";
import courseModel from "../models/course/course.js";
import mongoose from "mongoose";

const hiddenUserFields =
  "-password -refreshToken -resetPasswordToken -resetPasswordExpires -emailVerifyToken";
const allowedRoles = ["customer", "provider", "admin"];

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getSingleQueryValue = (value) => {
  return Array.isArray(value) ? value[0] : value;
};

// Tạo user mới
export const createUser = async (req, res) => {
  try {
    const { email, username, password, role } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const newUser = await userModel.create({
      email,
      username,
      password,
      role,
    });

    res.status(201).json({
      message: "Tạo user thành công",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Lấy tất cả user
export const getAllUsers = async (req, res) => {
  try {
    const page = Math.max(
      parseInt(getSingleQueryValue(req.query.page), 10) || 1,
      1,
    );
    const limit = Math.max(
      parseInt(getSingleQueryValue(req.query.limit), 10) || 10,
      1,
    );
    const skip = (page - 1) * limit;
    const search = getSingleQueryValue(req.query.search);
    const role = getSingleQueryValue(req.query.role);
    const isActive = getSingleQueryValue(req.query.isActive);
    const filter = {};

    if (search && search.trim()) {
      const searchRegex = new RegExp(escapeRegex(search.trim()), "i");
      filter.$or = [{ email: searchRegex }, { username: searchRegex }];
    }

    if (allowedRoles.includes(role)) {
      filter.role = role;
    }

    if (isActive === "true" || isActive === "false") {
      filter.isActive = isActive === "true" ? { $ne: false } : false;
    }

    const [users, total] = await Promise.all([
      userModel
        .find(filter)
        .select(hiddenUserFields)
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit),
      userModel.countDocuments(filter),
    ]);

    return res.status(200).json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user id",
      });
    }

    const user = await userModel.findById(id).select(hiddenUserFields);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user id",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "isActive must be a boolean",
      });
    }

    if (req.user?.userId?.toString() === id) {
      return res.status(400).json({
        message: "Admin cannot lock or unlock their own account",
      });
    }

    const user = await userModel
      .findByIdAndUpdate(id, { isActive }, { new: true, runValidators: true })
      .select(hiddenUserFields);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ── Wishlist ──────────────────────────────────────────────────────────────────

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = await userModel 
      .findById(userId)
      .populate({
        path: "wishlist",
        select:
          "course_title image_url price price_promotion provider_id students duration",
        populate: { path: "provider_id", select: "provider_name" },
      })
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    const data = (user.wishlist || []).map((c) => ({
      _id: c._id,
      title: c.course_title,
      thumbnail: c.image_url ?? null,
      price: c.price_promotion ?? c.price ?? 0,
      originalPrice:
        c.price_promotion !== null &&
        c.price_promotion !== undefined &&
        c.price > c.price_promotion
          ? c.price
          : null,
      provider: c.provider_id?.provider_name ?? "Unknown",
      students: c.students ?? 0,
      duration: c.duration ?? null,
      categoryId: c.category_id ?? null,
    }));

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course id" });
    }

    const course = await courseModel.findById(courseId).lean();
    if (!course || course.isActive === false) {
      return res.status(404).json({ message: "Course not found" });
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: courseId } },
      { new: true },
    );

    return res.status(200).json({
      message: "Added to wishlist",
      wishlistCount: user.wishlist.length,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course id" });
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: courseId } },
      { new: true },
    );

    return res.status(200).json({
      message: "Removed from wishlist",
      wishlistCount: user.wishlist.length,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
