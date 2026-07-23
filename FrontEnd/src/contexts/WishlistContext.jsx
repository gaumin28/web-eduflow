/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlistService";

const WishlistContext = createContext(null);
export const useWishlist = () => useContext(WishlistContext);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isCustomer = !!user && user.role === "customer";
  const wishlistQueryKey = ["wishlist", user?._id || "guest"];

  const {
    data: wishlistIdList = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: wishlistQueryKey,
    enabled: isCustomer,
    queryFn: async () => {
      const res = await getWishlist();
      return (res.data.data || []).map((c) => String(c._id));
    },
  });

  const wishlistIds = useMemo(() => new Set(wishlistIdList), [wishlistIdList]);
  const loading = isCustomer ? isLoading || isFetching : false;

  const isWishlisted = (courseId) => wishlistIds.has(String(courseId));

  const toggleWishlist = async (courseId) => {
    if (!isCustomer) return;
    const id = String(courseId);
    const wasAdded = wishlistIds.has(id);
    const prev = queryClient.getQueryData(wishlistQueryKey) || [];

    // Optimistic update
    queryClient.setQueryData(wishlistQueryKey, (old = []) => {
      if (wasAdded) return old.filter((item) => item !== id);
      return [...old, id];
    });

    try {
      if (wasAdded) {
        await removeFromWishlist(id);
      } else {
        await addToWishlist(id);
      }
    } catch {
      // Rollback on error
      queryClient.setQueryData(wishlistQueryKey, prev);
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistIds, isWishlisted, toggleWishlist, loading }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
