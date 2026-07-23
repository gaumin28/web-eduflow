const authorizeRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Bạn cần đăng nhập để thực hiện chức năng này!",
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        message: "Bạn không có quyền thực hiện chức năng này!",
      });
    }

    next();
  };
};

export default authorizeRole;
