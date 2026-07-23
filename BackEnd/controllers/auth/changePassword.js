import bcrypt from "bcrypt";
import userModel from "../../models/user.js";

// Đổi mật khẩu
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // validate
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Xác nhận mật khẩu không khớp",
      });
    }

    // lấy user từ access token
    const user = await userModel.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
      });
    }

    // kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Mật khẩu hiện tại không đúng",
      });
    }

    // không cho trùng mật khẩu cũ
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        message: "Mật khẩu mới phải khác mật khẩu cũ",
      });
    }

    // hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    // logout tất cả thiết bị
    user.refreshToken = null;

    await user.save();

    return res.status(200).json({
      message: "Đổi mật khẩu thành công. Vui lòng đăng nhập lại!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
