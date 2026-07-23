import providerModel from "../models/provider.js";
import courseModel from "../models/course/course.js";
import categoryModel from "../models/category.js";
import { seedCoursesForProvider } from "./coursesOfProviderSeed.js";
import { createOrUpdateProviderService, updateProviderStatusService } from "../services/provider/providerService.js";
import notificationModel from "../models/NotificationModel.js";
import userModel from "../models/user.js";


const DEFAULT_TITLES = [
  "Complete {topic} Masterclass",
  "{topic} Fundamentals for Beginners",
  "Advanced {topic} Bootcamp",
  "Practical {topic} Projects",
  "{topic} from Zero to Hero",
  "Professional {topic} Workflow",
];

const DEFAULT_TOPICS = {
  development: ["React", "Node.js", "TypeScript", "Next.js", "MongoDB"],
  design: ["UI Design", "Figma", "Design Systems", "UX Research"],
  data: ["Python", "Data Analysis", "Machine Learning", "SQL"],
  mobile: ["Flutter", "React Native", "SwiftUI", "Android"],
  language: ["English", "Japanese", "Korean", "Chinese"],
  game: ["Unity", "Game Design", "3D Modeling", "Unreal Engine"],
};

const getRandomItem = (items) =>
  items[Math.floor(Math.random() * items.length)];

const buildCourseTitle = (categoryName) => {
  const key = categoryName.toLowerCase();
  const topics = Object.entries(DEFAULT_TOPICS).find(([group]) =>
    key.includes(group),
  )?.[1] ?? [categoryName];
  const topic = getRandomItem(topics);
  const template = getRandomItem(DEFAULT_TITLES);
  return template.replace("{topic}", topic);
};

const buildSeedCourse = (providerId, category, index) => {
  const basePrice = 149000 + index * 50000;
  const pricePromotion = index % 3 === 0 ? Math.floor(basePrice * 0.8) : null;

  return {
    category_id: category._id,
    provider_id: providerId,
    course_title: buildCourseTitle(category.cate_name),
    price: basePrice,
    price_promotion: pricePromotion,
    image_url: `https://picsum.photos/seed/eduflow-${providerId}-${index}/900/600`,
    video_url: null,
    description: `A practical ${category.cate_name.toLowerCase()} course created for instructor demo data.`,
    total_sections: 4 + (index % 4),
    total_lectures: 16 + index * 2,
    students: 120 + index * 35,
    duration: `${8 + index}h`,
    feature: index < 3,
    isActive: true,
  };
};

export const getProviders = async (req, res) => {
  try {
    const providers = await providerModel.find();
    return res.json({ message: "success", data: providers });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getProviderCourses = async (req, res) => {
  try {
    const { providerId } = req.params;

    const courses = await courseModel
      .find({ provider_id: providerId })
      .populate({ path: "category_id", select: "cate_name" })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Lấy danh sách khóa học giảng viên thành công",
      total: courses.length,
      data: courses,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAdminRequestProvidersDetail = async (req, res) => {
  try {
    const { providerId } = req.params;

    const provider = await providerModel
      .findById(providerId)
      .lean(); 

    if (!provider) {
      return res.status(404).json({
        message: "Không tìm thấy chi tiết yêu cầu đăng ký của người dùng này",
      });
    }

    return res.status(200).json({
      message: "Lấy chi tiết yêu cầu đối tác thành công",
      data: provider,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Mã yêu cầu (ID) không đúng định dạng",
      });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const seedProviderCourses = async (req, res) => {
  try {
    const { providerId } = req.params;
    const requestedCount = Number.parseInt(req.body?.count, 10);
    const count =
      Number.isFinite(requestedCount) && requestedCount > 0
        ? requestedCount
        : 6;

    const result = await seedCoursesForProvider({
      providerId,
      count,
      replaceExisting: false,
    });

    return res.status(201).json({
      message: "Generated instructor course data successfully",
      ...result,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};






export const createProvider = async (req, res) => {
  try {
    const { isNew, data } = await createOrUpdateProviderService(req.user.userId, req.body, req.files);
    
    const newNotification = await notificationModel.create({
      sender: req.user.userId, 
      title: "Hồ sơ đăng ký mới",
      content: `Có một yêu cầu đăng ký làm đối tác mới đang chờ bạn duyệt.`,
      type: "registration",
      link: `/admin/providers-requests`,
    });

    // Đi kèm thông tin người gửi (avatar, tên) để hiển thị lên chuông
    const populatedNoti = await newNotification.populate("sender", "name email avatar");

    // Bắn Real-time phát một qua Socket đến Admin
    if (req.io) {
      req.io.to("admin-room").emit("new_notification", populatedNoti); 
    }

    return res.status(isNew ? 201 : 200).json({
      message: "Gửi đăng ký thành công, vui lòng chờ admin duyệt",
      data
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};


// Lấy thông tin yêu cầu trở thành giảng viên của người dùng 

export const getAdminRequestProviders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    
    const pageNum = !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    const limitNum = !isNaN(parsedLimit) && parsedLimit > 0 ? Math.min(50, parsedLimit) : 10;
    const skip = (pageNum - 1) * limitNum;

    // 2. QUERY DỮ LIỆU
    const [providers, total] = await Promise.all([
      providerModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
        
      providerModel.countDocuments(filter),
    ]);

    return res.status(200).json({
      message: "Lấy danh sách yêu cầu đối tác thành công",
      data: providers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.max(1, Math.ceil(total / limitNum)),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Duyệt hồ sơ ng dùng đăng ký trở thành nhà cung cấp

export const updateProviderStatus = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { status } = req.body; 
    const adminId = req.user.userId; 

    if (!["approved"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái phê duyệt không hợp lệ!" });
    }

    const updatedProvider = await updateProviderStatusService(
      providerId, 
      status, 
      adminId
    );

    // TẠO THÔNG BÁO DUYỆT THÀNH CÔNG
    const newNotification = await notificationModel.create({
      sender: adminId,
      receiver: updatedProvider.user_id, 
      title: "Hồ sơ đăng ký đối tác đã được duyệt",
      content: `Chúc mừng bạn! Hồ sơ đăng ký làm đối tác [${updatedProvider.provider_name}] đã được phê duyệt thành công.`,
      type: "approved",
      link: "/user/register-provider" 
    });

    // Bắn Real-time phát một qua Socket đến riêng Học viên đó
    if (req.io && updatedProvider.user_id) {
      req.io.to(updatedProvider.user_id.toString()).emit("new_notification", newNotification); 
    }

    return res.status(200).json({
      message: `Đã duyệt hồ sơ ${updatedProvider.provider_name}!`,
      data: updatedProvider,
    });

  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Từ chối hồ sơ

export const rejectProviderRequest = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { rejection_reason } = req.body;  

    if (!rejection_reason || rejection_reason.trim() === "") {
      return res.status(400).json({ 
        message: "Vui lòng nhập lý do từ chối hồ sơ!" 
      });
    }

    const updatedProvider = await providerModel.findByIdAndUpdate(
      providerId,
      { 
        status: "rejected",             
        rejection_reason: rejection_reason,  
        approved_by: req.user.userId     
      },
      { new: true }
    );

    if (!updatedProvider) {
      return res.status(404).json({ message: "Không tìm thấy hồ sơ đối tác." });
    }

    // THÔNG BÁO TỪ CHỐI KÈM LÝ DO
    const newNotification = await notificationModel.create({
      sender: req.user.userId, 
      receiver: updatedProvider.user_id,  
      title: "Yêu cầu đăng ký đối tác bị từ chối",
      content: `Rất tiếc, hồ sơ đối tác của bạn đã bị từ chối. Lý do: ${rejection_reason}`,
      type: "rejected",
      link: "/user/register-provider" 
    });

    // Bắn Real-time phát một qua Socket đến riêng Học viên đó
    if (req.io && updatedProvider.user_id) {
      req.io.to(updatedProvider.user_id.toString()).emit("new_notification", newNotification); 
    }

    return res.status(200).json({
      message: "Đã từ chối yêu cầu của đối tác thành công!",
      data: updatedProvider,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


//  Lấy hồ sơ đăng ký của người dùng

export const getMyProviderRequest = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Tìm hồ sơ đăng ký mới nhất của user này
    const providerRequest = await providerModel.findOne({ user_id: userId });

    // Trả về data (có thể là Object hồ sơ hoặc null nếu chưa từng đăng ký)
    return res.status(200).json({
      success: true,
      data: providerRequest, 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};