import mongoose from "mongoose";
import cartModel from "../models/cart.js";
import courseModel from "../models/course/course.js";
import orderModel from "../models/order.js";
import { createProgressAfterCheckout } from "../services/course/courseService.js";

const TAX_RATE = 0.1;

const toDateStart = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
};

const toDateEnd = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(23, 59, 59, 999);
  return date;
};

const getOrderShortId = (id) => `#${id.toString().slice(-6).toUpperCase()}`;

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeCartItems = (items) => {
  return items.map((item) => ({
    id: item.course.toString(),
    title: item.course_title,
    instructor: item.instructor,
    image: item.image_url,
    price: item.price,
    originalPrice: item.original_price,
    quantity: item.quantity,
  }));
};

const getDiscountTotal = (items) => {
  return items.reduce((sum, item) => {
    const originalPrice = toNumber(item.original_price ?? item.price);
    const salePrice = toNumber(item.price);
    const qty = toNumber(item.quantity, 1);
    return sum + Math.max(originalPrice - salePrice, 0) * qty;
  }, 0);
};

const getSubtotal = (items) => {
  return items.reduce((sum, item) => {
    return sum + toNumber(item.price) * toNumber(item.quantity, 1);
  }, 0);
};

const getCartSummary = (cart) => {
  const subtotal = getSubtotal(cart.items);
  const saleDiscount = getDiscountTotal(cart.items);
  const taxableAmount = Math.max(subtotal - saleDiscount, 0);
  const tax = cart.items.length > 0 ? taxableAmount * TAX_RATE : 0;
  const total = taxableAmount + tax;

  return {
    items: normalizeCartItems(cart.items),
    summary: {
      subtotal,
      saleDiscount,
      tax,
      total,
    },
  };
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(200).json({
        data: {
          items: [],
          summary: {
            subtotal: 0,
            saleDiscount: 0,
            tax: 0,
            total: 0,
          },
        },
      });
    }

    return res.status(200).json({
      data: getCartSummary(cart),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addCartItem = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { courseId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course id" });
    }

    const course = await courseModel
      .findById(courseId)
      .populate("provider_id", "provider_name")
      .lean();

    if (!course || course.isActive === false) {
      return res.status(404).json({ message: "Course not found" });
    }

    let cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      cart = await cartModel.create({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.course.toString() === courseId,
    );

    const salePrice =
      course.price_promotion === null || course.price_promotion === undefined
        ? toNumber(course.price)
        : toNumber(course.price_promotion);

    const originalPrice = toNumber(course.price, salePrice);

    const nextItem = {
      course: course._id,
      course_title: course.course_title,
      instructor: course.provider_id?.provider_name ?? "Unknown Instructor",
      image_url: course.image_url ?? "",
      price: salePrice,
      original_price: originalPrice > salePrice ? originalPrice : null,
      quantity: 1,
    };

    if (itemIndex >= 0) {
      cart.items[itemIndex] = nextItem;
    } else {
      cart.items.push(nextItem);
    }

    await cart.save();

    return res.status(200).json({
      message: "Added to cart",
      data: getCartSummary(cart),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course id" });
    }

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(200).json({
        data: {
          items: [],
          summary: {
            subtotal: 0,
            saleDiscount: 0,
            tax: 0,
            total: 0,
          },
        },
      });
    }

    cart.items = cart.items.filter(
      (item) => item.course.toString() !== courseId,
    );
    await cart.save();

    return res.status(200).json({
      message: "Removed from cart",
      data: getCartSummary(cart),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(200).json({
        message: "Cart already empty",
        data: {
          items: [],
          summary: {
            subtotal: 0,
            saleDiscount: 0,
            tax: 0,
            total: 0,
          },
        },
      });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({
      message: "Cart cleared",
      data: {
        items: [],
        summary: {
          subtotal: 0,
          saleDiscount: 0,
          tax: 0,
          total: 0,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyAllOrders = async (req, res) => {
  try {
    const userId = req.user?.userId;

    const orders = await orderModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    const result = orders.map((o) => ({
      _id: o._id,
      shortId: getOrderShortId(o._id),
      items: o.items.map((i) => i.course_title),
      subtotal: o.subtotal,
      discount: o.discount,
      tax: o.tax,
      total: o.total,
      paymentMethod: o.payment_method,
      paymentStatus: o.payment_status,
      orderStatus: o.order_status,
      createdAt: o.createdAt,
      paidAt: o.paid_at,
    }));

    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyRecentOrders = async (req, res) => {
  try {
    const userId = req.user?.userId;

    const orders = await orderModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const result = orders.map((o) => ({
      _id: o._id,
      shortId: getOrderShortId(o._id),
      itemCount: o.items.length,
      total: o.total,
      paymentStatus: o.payment_status,
      orderStatus: o.order_status,
      createdAt: o.createdAt,
      paidAt: o.paid_at,
    }));

    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyOrderById = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await orderModel
      .findOne({ _id: orderId, user: userId })
      .lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      data: {
        _id: order._id,
        shortId: getOrderShortId(order._id),
        items: order.items.map((item) => ({
          courseId: item.course,
          title: item.course_title,
          price: item.price,
          quantity: item.quantity,
          lineTotal: item.price * item.quantity,
        })),
        subtotal: order.subtotal,
        discount: order.discount,
        tax: order.tax,
        total: order.total,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        orderStatus: order.order_status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        paidAt: order.paid_at,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAdminOrders = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;
    const search = String(req.query.search || "").trim();
    const paymentStatus = String(req.query.paymentStatus || "").trim();
    const orderStatus = String(req.query.orderStatus || "").trim();
    const minPrice = Number(req.query.minPrice);
    const maxPrice = Number(req.query.maxPrice);
    const dateFrom = toDateStart(req.query.dateFrom);
    const dateTo = toDateEnd(req.query.dateTo);

    const allowedPaymentStatus = ["pending", "paid", "failed", "refunded"];
    const allowedOrderStatus = [
      "pending",
      "processing",
      "completed",
      "cancelled",
    ];
    const match = {};

    if (allowedPaymentStatus.includes(paymentStatus)) {
      match.payment_status = paymentStatus;
    }

    if (allowedOrderStatus.includes(orderStatus)) {
      match.order_status = orderStatus;
    }

    if (dateFrom || dateTo) {
      match.createdAt = {};
      if (dateFrom) match.createdAt.$gte = dateFrom;
      if (dateTo) match.createdAt.$lte = dateTo;
    }

    if (Number.isFinite(minPrice) || Number.isFinite(maxPrice)) {
      match.total = {};
      if (Number.isFinite(minPrice)) match.total.$gte = minPrice;
      if (Number.isFinite(maxPrice)) match.total.$lte = maxPrice;
    }

    const searchMatch = search
      ? {
          $or: [
            { email: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
            { shortId: { $regex: search.replace(/^#/, ""), $options: "i" } },
            {
              orderIdText: { $regex: search.replace(/^#/, ""), $options: "i" },
            },
          ],
        }
      : null;

    const dataPipeline = [
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          username: "$user.username",
          email: "$user.email",
          orderIdText: { $toString: "$_id" },
          shortId: {
            $toUpper: {
              $concat: [
                "#",
                {
                  $substrCP: [
                    { $toString: "$_id" },
                    { $subtract: [{ $strLenCP: { $toString: "$_id" } }, 6] },
                    6,
                  ],
                },
              ],
            },
          },
        },
      },
      ...(searchMatch ? [{ $match: searchMatch }] : []),
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          shortId: 1,
          customerName: { $ifNull: ["$username", "Unknown"] },
          customerEmail: { $ifNull: ["$email", ""] },
          itemCount: { $size: "$items" },
          subtotal: 1,
          discount: 1,
          tax: 1,
          total: 1,
          paymentMethod: "$payment_method",
          paymentStatus: "$payment_status",
          orderStatus: "$order_status",
          createdAt: 1,
          paidAt: "$paid_at",
        },
      },
    ];

    const countPipeline = [
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          username: "$user.username",
          email: "$user.email",
          orderIdText: { $toString: "$_id" },
          shortId: {
            $toUpper: {
              $concat: [
                "#",
                {
                  $substrCP: [
                    { $toString: "$_id" },
                    { $subtract: [{ $strLenCP: { $toString: "$_id" } }, 6] },
                    6,
                  ],
                },
              ],
            },
          },
        },
      },
      ...(searchMatch ? [{ $match: searchMatch }] : []),
      { $count: "total" },
    ];

    const [orders, countResult] = await Promise.all([
      orderModel.aggregate(dataPipeline),
      orderModel.aggregate(countPipeline),
    ]);

    const total = countResult[0]?.total || 0;

    return res.status(200).json({
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyPurchasedCourses = async (req, res) => {
  try {
    const userId = req.user?.userId;

    const orders = await orderModel
      .find({ user: userId, payment_status: "paid" })
      .lean();

    // Deduplicate courses across all paid orders
    const courseMap = new Map();
    for (const order of orders) {
      for (const item of order.items) {
        const courseId = item.course.toString();
        if (!courseMap.has(courseId)) {
          courseMap.set(courseId, {
            pricePaid: item.price,
            paidAt: order.paid_at,
          });
        }
      }
    }

    if (courseMap.size === 0) {
      return res.status(200).json({ data: [] });
    }

    const courseIds = [...courseMap.keys()];
    const courses = await courseModel
      .find({ _id: { $in: courseIds } })
      .populate("provider_id", "provider_name")
      .lean();

    const result = courses.map((c) => ({
      _id: c._id,
      title: c.course_title,
      thumbnail: c.image_url ?? null,
      provider: c.provider_id?.provider_name ?? "Unknown",
      totalLectures: c.total_lectures ?? 0,
      duration: c.duration ?? null,
      pricePaid: courseMap.get(c._id.toString())?.pricePaid ?? 0,
      paidAt: courseMap.get(c._id.toString())?.paidAt ?? null,
    }));

    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const checkout = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { payment_method = "card", coupon_discount = 0 } = req.body;

    const cart = await cartModel.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const subtotal = getSubtotal(cart.items);
    const saleDiscount = getDiscountTotal(cart.items);
    const couponDiscount = Math.max(toNumber(coupon_discount, 0), 0);
    const discount = Math.min(saleDiscount + couponDiscount, subtotal);
    const taxableAmount = Math.max(subtotal - discount, 0);
    const tax = taxableAmount * TAX_RATE;
    const total = taxableAmount + tax;

    const order = await orderModel.create({
      user: userId,
      items: cart.items.map((item) => ({
        course: item.course,
        course_title: item.course_title,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal,
      discount,
      tax,
      total,
      payment_method,
      payment_status: "paid",
      order_status: "completed",
      paid_at: new Date(),
    });

    await createProgressAfterCheckout(userId, order.items);

    cart.items = [];
    await cart.save();

    return res.status(201).json({
      message: "Checkout success",
      data: {
        orderId: order._id,
        subtotal,
        discount,
        tax,
        total,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
