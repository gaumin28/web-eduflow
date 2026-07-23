import providerModel from "../../models/provider.js";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../../models/user.js";

// Hàm helper upload file từ memory buffer lên Cloudinary
const uploadToCloudinary = async (file) => {
  const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const fileName = file.originalname.split(".")[0];
  
  const result = await cloudinary.uploader.upload(dataUrl, {
    public_id: fileName,
    resource_type: "auto",
  });
  return result.secure_url; // Trả về link ảnh dạng https
};


export const createOrUpdateProviderService = async (userId, data, files) => {
  const existed = await providerModel.findOne({ user_id: userId });

  // Chặn nếu trạng thái là pending hoặc approved
  if (existed && ["pending", "approved"].includes(existed.status)) {
    const msg = existed.status === "pending" 
      ? "Yêu cầu trước đó của bạn đang được xét duyệt, vui lòng đợi!" 
      : "Bạn đã là đối tác của hệ thống rồi.";
    throw Object.assign(new Error(msg), { statusCode: 400 });
  }

  // Gom logic xử lý ảnh (Dùng cho cả Tạo mới & Cập nhật)
  const avatarUrl = files?.avatar?.[0] 
    ? await uploadToCloudinary(files.avatar[0]) 
    : (existed?.avatar || "");

  const newImages = files?.images?.length 
    ? await Promise.all(files.images.map(uploadToCloudinary)) 
    : [];
  
  const keptImages = data.retained_images 
    ? (Array.isArray(data.retained_images) ? data.retained_images : [data.retained_images]) 
    : [];

  // Chuẩn bị Object dữ liệu chuẩn
  const providerData = {
    ...data,
    avatar: avatarUrl,
    images: existed ? [...keptImages, ...newImages] : newImages,
    experience_years: Number(data.experience_years) || 0,
    status: "pending",
    rejection_reason: null
  };

  // Thực thi Lưu DB (Update nếu đã có / Create nếu mới tinh)
  if (existed) {
    Object.assign(existed, providerData);
    await existed.save();
    return { isNew: false, data: existed };
  }

  const newProvider = await providerModel.create({ user_id: userId, ...providerData });
  return { isNew: true, data: newProvider };
};




// 

export const updateProviderStatusService = async (providerId, status, adminId) => {
  // Tìm hồ sơ đối tác để lấy được user_id liên kết
  const provider = await providerModel.findById(providerId);
  if (!provider) {
    throw Object.assign(new Error("Không tìm thấy hồ sơ đối tác."), { statusCode: 404 });
  }

  // Cập nhật các trường cho hồ sơ Provider
  provider.status = status;
  provider.approved_by = adminId;

  // Xử lý phân nhánh logic theo Trạng thái duyệt
  if (status === "approved") {    
    // CẬP NHẬT ROLE USER: Đổi thành đối tác
    await userModel.findByIdAndUpdate(provider.user_id, { role: "provider" }); 
  } 
  
  await provider.save();
  return provider;
};