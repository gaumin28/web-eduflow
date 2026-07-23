import userModel from "../models/user.js";
import providerModel from "../models/provider.js";
import courseModel from "../models/course/course.js";
import categoryModel from "../models/category.js";
import orderModel from "../models/order.js";

export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalCustomers,
      totalProviders,
      totalAdmins,
      approvedProviders,
      pendingProviders,
      totalCourses,
      activeCourses,
      totalCategories,
      totalOrders,
      paidOrders,
      revenueResult,
      monthlyRevenueResult,
      studentsResult,
    ] = await Promise.all([
      userModel.countDocuments(),
      userModel.countDocuments({ role: "customer" }),
      userModel.countDocuments({ role: "provider" }),
      userModel.countDocuments({ role: "admin" }),
      providerModel.countDocuments({ status: "approved" }),
      providerModel.countDocuments({ status: "pending" }),
      courseModel.countDocuments(),
      courseModel.countDocuments({ isActive: true }),
      categoryModel.countDocuments(),
      orderModel.countDocuments(),
      orderModel.countDocuments({ payment_status: "paid" }),
      orderModel.aggregate([
        { $match: { payment_status: "paid" } },
        { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
      ]),
      orderModel.aggregate([
        { $match: { payment_status: "paid", paid_at: { $gte: firstDayOfMonth } } },
        { $group: { _id: null, currentMonthRevenue: { $sum: "$total" } } },
      ]),
      courseModel.aggregate([
        { $group: { _id: null, totalStudents: { $sum: "$students" } } },
      ]),
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    const currentMonthRevenue = monthlyRevenueResult[0]?.currentMonthRevenue || 0;
    const totalStudents = studentsResult[0]?.totalStudents || 0;

    return res.status(200).json({
      message: "Success",
      data: {
        totalUsers,
        totalCustomers,
        totalProviders,
        totalAdmins,
        approvedProviders,
        pendingProviders,
        totalCourses,
        activeCourses,
        totalCategories,
        totalOrders,
        paidOrders,
        totalRevenue,
        currentMonthRevenue,
        totalStudents,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getRevenueChart = async (req, res) => {
  try {
    const now = new Date();
    // Get date 6 months ago (first day of that month)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const monthlyStats = await orderModel.aggregate([
      { 
        $match: { 
          payment_status: "paid",
          paid_at: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$paid_at" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format data to ensure all 6 months are present, even if 0
    const formattedData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('en-US', { month: 'short' }); // e.g. "Feb"
      
      const found = monthlyStats.find((s) => s._id === monthStr);
      formattedData.push({
        month: monthStr,
        label,
        revenue: found ? found.revenue : 0,
        orders: found ? found.orders : 0,
      });
    }

    return res.status(200).json({
      message: "Success",
      data: formattedData,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDashboardTables = async (req, res) => {
  try {
    const [topCourses, topProvidersData, pendingProviders] = await Promise.all([
      // Top 5 courses by students
      courseModel
        .find()
        .sort({ students: -1 })
        .limit(5)
        .populate("provider_id", "provider_name")
        .select("course_title students price provider_id"),

      // Top 5 providers by total students
      courseModel.aggregate([
        {
          $group: {
            _id: "$provider_id",
            totalCourses: { $sum: 1 },
            totalStudents: { $sum: "$students" },
          },
        },
        { $sort: { totalStudents: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "providers",
            localField: "_id",
            foreignField: "_id",
            as: "providerDetails",
          },
        },
        { $unwind: "$providerDetails" },
        {
          $project: {
            _id: 1,
            totalCourses: 1,
            totalStudents: 1,
            provider_name: "$providerDetails.provider_name",
          },
        },
      ]),

      // 5 pending providers
      providerModel
        .find({ status: "pending" })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("provider_name email career createdAt"),
    ]);

    return res.status(200).json({
      message: "Success",
      data: {
        topCourses: topCourses.map((c) => ({
          _id: c._id,
          course_title: c.course_title,
          students: c.students,
          price: c.price,
          provider_name: c.provider_id?.provider_name || "Unknown",
        })),
        topProviders: topProvidersData,
        pendingProviders,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
