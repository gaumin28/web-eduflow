


export const logoutUser = async (req, res) => {
  res.clearCookie("refreshToken", {
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  return res.status(200).json({
    success: true,
    message: "Đăng xuất thành công",
  });
};