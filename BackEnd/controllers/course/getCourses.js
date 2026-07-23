import courseModel from "../../models/course/course.js";
import categoryModel from "../../models/category.js";
// Ensure the Provider model is registered for populate
import "../../models/provider.js";
/**
 * GET /api/courses
 *
 * Query params:
 *   - q        : string   — keyword search by course_title
 *   - sort     : string   — "price_asc" | "price_desc" | "newest" (default)
 *   - category : string   — filter by cate_name (e.g. "Development")
 *   - price    : string   — "Free" | "Paid"
 *   - minPrice : number   — minimum price filter
 *   - maxPrice : number   — maximum price filter
 *   - rating   : string   — placeholder (e.g. "4"), chưa query DB
 *   - level    : string   — placeholder (e.g. "Beginner"), chưa query DB
 *   - page     : number   — trang hiện tại (default 1)
 *   - limit    : number   — số bản ghi mỗi trang (default 12)
 */
export const getCourses = async (req, res) => {
  try {
    const {
      q,
      category,
      sort,
      price,
      minPrice,
      maxPrice,
      rating, // TODO: bổ sung query khi schema có trường rating
      level, // TODO: bổ sung query khi schema có trường level
      page = 1,
      limit = 12,
    } = req.query;
    // ── Build filter object ───────────────────────────────────
    const filter = { isActive: true };
    // 0. Filter theo keyword tiêu đề khóa học
    if (q) {
      filter.course_title = { $regex: q, $options: "i" };
    }
    // 1. Filter theo category name
    //    Cần tìm _id của Category trước, rồi lọc courses theo category_id
    if (category) {
      const cat = await categoryModel.findOne({ cate_name: category });
      if (cat) {
        filter.category_id = cat._id;
      } else {
        // Nếu không tìm thấy category → trả mảng rỗng
        return res.status(200).json({
          message: "Không tìm thấy danh mục phù hợp.",
          total: 0,
          page: Number(page),
          limit: Number(limit),
          totalPages: 0,
          data: [],
        });
      }
    }
    // 2. Filter theo Price (Paid / Free)
    //    "Free" → giá thực tế (price hoặc price_promotion) = 0
    //    "Paid" → giá thực tế > 0
    if (price) {
      if (price === "Free") {
        // Khóa học miễn phí: price = 0 hoặc price_promotion = 0
        filter.$or = [{ price: 0 }, { price_promotion: 0 }];
      } else if (price === "Paid") {
        // Khóa học trả phí: price > 0 VÀ (price_promotion > 0 hoặc null)
        filter.price = { $gt: 0 };
        filter.$or = [
          { price_promotion: { $gt: 0 } },
          { price_promotion: null },
        ];
      }
    }
    // 3. Filter theo khoảng giá (Price Range: minPrice / maxPrice)
    //    Merge với filter.price hiện có (nếu Paid đã set $gt: 0)
    if (minPrice) {
      const min = Number(minPrice);
      if (!isNaN(min) && min >= 0) {
        filter.price = { ...(filter.price || {}), $gte: min };
      }
    }
    if (maxPrice) {
      const max = Number(maxPrice);
      if (!isNaN(max) && max >= 0) {
        filter.price = { ...(filter.price || {}), $lte: max };
      }
    }
    // 4. Rating – placeholder: nhận param nhưng chưa query
    if (rating) {
      // TODO: Khi schema có trường `rating`, bổ sung:
      // filter.rating = { $gte: Number(rating) };
    }
    // 5. Level – placeholder: nhận param nhưng chưa query
    if (level) {
      // TODO: Khi schema có trường `level`, bổ sung:
      // filter.level = level;
    }
    // ── Sort option ───────────────────────────────────────────
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };
    // ── Pagination ────────────────────────────────────────────
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(50, Number(limit))); // cap at 50
    const skip = (pageNum - 1) * limitNum;
    // ── Query ─────────────────────────────────────────────────
    const [courses, total] = await Promise.all([
      courseModel
        .find(filter)
        .populate({ path: "category_id", select: "cate_name" })
        .populate({ path: "provider_id", select: "provider_name" })
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      courseModel.countDocuments(filter),
    ]);
    // ── Map response ──────────────────────────────────────────
    const data = courses.map((c) => ({
      _id: c._id,
      category: c.category_id?.cate_name ?? null,
      provider: c.provider_id?.provider_name ?? null,
      course_title: c.course_title,
      image_url: c.image_url,
      price: c.price,
      price_promotion: c.price_promotion,
      students: c.students,
      duration: c.duration,
      total_lectures: c.total_lectures,
      total_sections: c.total_sections,
      feature: c.feature,
      createdAt: c.createdAt,
    }));
    return res.status(200).json({
      message: "Lấy danh sách khóa học thành công!",
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};