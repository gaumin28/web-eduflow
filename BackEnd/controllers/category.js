import categoryModel from "../models/category.js";
import courseModel from "../models/course/course.js";

/**
 * GET /categories (Public)
 * Lấy toàn bộ danh mục (cho FrontEnd hiển thị).
 * Chỉ trả về danh mục isActive = true.
 */
export const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({ isActive: true });
    return res.json({ message: "Success", data: categories });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET /admin/categories (Admin)
 * Danh sách danh mục có phân trang, tìm kiếm, lọc trạng thái.
 *
 * Query params:
 *   - search   : string  — tìm theo cate_name (regex)
 *   - isActive  : string  — "true" | "false"
 *   - page      : number  — trang hiện tại (default 1)
 *   - limit     : number  — số bản ghi mỗi trang (default 10)
 */
export const getAdminCategories = async (req, res) => {
  try {
    const { search, isActive, page = 1, limit = 10 } = req.query;

    const filter = {};

    // Tìm kiếm theo tên danh mục
    if (search) {
      filter.cate_name = { $regex: search, $options: "i" };
    }

    // Lọc theo trạng thái
    if (isActive === "true") filter.isActive = true;
    if (isActive === "false") filter.isActive = false;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(50, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [categories, total] = await Promise.all([
      categoryModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      categoryModel.countDocuments(filter),
    ]);

    return res.json({
      message: "Success",
      data: categories,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * POST /admin/categories (Admin)
 * Tạo danh mục mới.
 */
export const createCategory = async (req, res) => {
  try {
    const { cate_name, icon_key } = req.body;

    if (!cate_name || !icon_key) {
      return res
        .status(400)
        .json({ message: "Tên danh mục và icon là bắt buộc." });
    }

    // Kiểm tra trùng tên
    const existing = await categoryModel.findOne({
      cate_name: { $regex: `^${cate_name.trim()}$`, $options: "i" },
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Danh mục với tên này đã tồn tại." });
    }

    const category = await categoryModel.create({
      cate_name: cate_name.trim(),
      icon_key: icon_key.trim(),
    });

    return res.status(201).json({
      message: "Tạo danh mục thành công!",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /admin/categories/:id (Admin)
 * Cập nhật danh mục.
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { cate_name, icon_key } = req.body;

    if (!cate_name || !icon_key) {
      return res
        .status(400)
        .json({ message: "Tên danh mục và icon là bắt buộc." });
    }

    // Kiểm tra danh mục tồn tại
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục." });
    }

    // Kiểm tra trùng tên (trừ chính nó)
    const existing = await categoryModel.findOne({
      _id: { $ne: id },
      cate_name: { $regex: `^${cate_name.trim()}$`, $options: "i" },
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Danh mục với tên này đã tồn tại." });
    }

    category.cate_name = cate_name.trim();
    category.icon_key = icon_key.trim();
    await category.save();

    return res.json({
      message: "Cập nhật danh mục thành công!",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /admin/categories/:id (Admin)
 * Xóa danh mục — chỉ xóa nếu không có khóa học nào đang dùng.
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục." });
    }

    // Kiểm tra có khóa học nào dùng danh mục này không
    const courseCount = await courseModel.countDocuments({ category_id: id });
    if (courseCount > 0) {
      return res.status(400).json({
        message: `Không thể xóa! Danh mục này đang được sử dụng bởi ${courseCount} khóa học.`,
      });
    }

    await categoryModel.findByIdAndDelete(id);

    return res.json({ message: "Xóa danh mục thành công!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * PATCH /admin/categories/:id/status (Admin)
 * Toggle trạng thái isActive.
 */
export const updateCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res
        .status(400)
        .json({ message: "isActive phải là kiểu boolean." });
    }

    const category = await categoryModel.findByIdAndUpdate(
      id,
      { isActive },
      { new: true },
    );

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục." });
    }

    return res.json({
      message: `Danh mục đã ${isActive ? "kích hoạt" : "vô hiệu hóa"} thành công!`,
      data: category,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
