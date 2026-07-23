import multer from "multer";

// Lưu trữ tệp tạm thời trong bộ nhớ RAM
const storage = multer.memoryStorage();

// Cấu hình nhận diện các trường file gửi từ Frontend
export const uploadProviderFiles = multer({ storage }).fields([
  { name: "avatar", maxCount: 1 },       // Trường avatar nhận tối đa 1 file
  { name: "images", maxCount: 8 }        // Trường images nhận tối đa 8 file chứng chỉ
]);