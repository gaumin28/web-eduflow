/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  addCartItem,
  clearCartApi,
  getCart,
  removeCartItem,
} from "../services/cartService";

const STORAGE_KEY = "cartItems";
const CartContext = createContext(null);
const MONGO_OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

export const useCart = () => useContext(CartContext);

function parsePrice(rawPrice) {
  if (typeof rawPrice === "number") {
    return Number.isFinite(rawPrice) ? rawPrice : 0;
  }

  if (typeof rawPrice !== "string") return 0;

  const normalized = rawPrice.trim();
  if (!normalized) return 0;

  if (normalized.includes("đ") || normalized.includes("₫")) {
    const digits = normalized.replace(/\D/g, "");
    return digits ? Number(digits) : 0;
  }

  const withoutCurrency = normalized.replace(/[^0-9.,-]/g, "");
  if (!withoutCurrency) return 0;

  if (withoutCurrency.includes(",") && withoutCurrency.includes(".")) {
    const value = Number(withoutCurrency.replace(/,/g, ""));
    return Number.isFinite(value) ? value : 0;
  }

  const value = Number(withoutCurrency.replace(/,/g, "."));
  return Number.isFinite(value) ? value : 0;
}

function normalizeCartItem(course) {
  const priceNumber = parsePrice(course.price_promotion ?? course.price ?? 0);
  const originalPriceNumber = parsePrice(course.price ?? priceNumber);

  return {
    id: String(course._id ?? course.id),
    title: course.course_title ?? course.title ?? "Untitled Course",
    instructor: course.provider ?? course.instructor ?? "Unknown Instructor",
    duration: course.duration ?? "Self-paced",
    rating: course.rating ?? "0.0",
    reviews: Number(course.reviews ?? 0),
    price: Number.isFinite(priceNumber) ? priceNumber : 0,
    originalPrice:
      originalPriceNumber > priceNumber ? originalPriceNumber : null,
    tag: course.tag ?? null,
    image: course.image_url ?? course.image ?? "",
  };
}

function getStoredCartItems() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeApiCartItem(item) {
  const priceNumber = parsePrice(item.price ?? 0);
  const originalPriceNumber = parsePrice(item.originalPrice ?? priceNumber);

  return {
    id: String(item.id),
    title: item.title ?? "Untitled Course",
    instructor: item.instructor ?? "Unknown Instructor",
    duration: item.duration ?? "Self-paced",
    rating: item.rating ?? "0.0",
    reviews: Number(item.reviews ?? 0),
    price: priceNumber,
    originalPrice:
      originalPriceNumber > priceNumber ? originalPriceNumber : null,
    tag: item.tag ?? null,
    image: item.image ?? "",
  };
}

function isMongoObjectId(value) {
  return MONGO_OBJECT_ID_REGEX.test(String(value));
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(getStoredCartItems);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    getCart()
      .then(({ data }) => {
        if (cancelled) return;
        const items = Array.isArray(data?.data?.items) ? data.data.items : [];
        setCartItems(items.map(normalizeApiCartItem));
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const addToCart = async (course) => {
    const item = normalizeCartItem(course);

    if (user && isMongoObjectId(item.id)) {
      try {
        const { data } = await addCartItem(item.id);
        const items = Array.isArray(data?.data?.items) ? data.data.items : [];
        setCartItems(items.map(normalizeApiCartItem));
        return;
      } catch (error) {
        console.error(error);
      }
    }

    setCartItems((prev) => {
      if (prev.some((existing) => existing.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = async (itemId) => {
    if (user && isMongoObjectId(itemId)) {
      try {
        const { data } = await removeCartItem(itemId);
        const items = Array.isArray(data?.data?.items) ? data.data.items : [];
        setCartItems(items.map(normalizeApiCartItem));
        return;
      } catch (error) {
        console.error(error);
      }
    }

    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = async () => {
    if (user) {
      try {
        await clearCartApi();
      } catch (error) {
        console.error(error);
      }
    }

    setCartItems([]);
  };

  const itemCount = cartItems.length;

  const value = { cartItems, itemCount, addToCart, removeFromCart, clearCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
