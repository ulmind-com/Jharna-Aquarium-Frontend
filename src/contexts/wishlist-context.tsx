import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { queryKeys, wishlistApi } from "@/api/services";
import { useAuth } from "@/contexts/auth-context";
import { normalizeApiError } from "@/lib/api";
import type { Product, ProductSize, Wishlist } from "@/types/api";

const WISHLIST_STORAGE_KEY = "plant-nursery-wishlist";
const WISHLIST_QTY_STORAGE_KEY = "plant-nursery-wishlist-qtys";

export interface WishlistEntry {
  product: Product;
  qty: number;
  addedAt: string;
}

export interface WishlistPricing {
  variant: ProductSize | undefined;
  price: number;
  mrp: number;
  stock: number;
  image: string | undefined;
  discount: number;
}

/** Shared pricing & display selector matching ProductCard's first sellable variant. */
export function wishlistProductPricing(product: Product): WishlistPricing {
  const sizes = product.sizes ?? [];
  const variant = sizes.find((size) => size.stock > 0) ?? sizes[0];
  const price = variant?.price ?? product.price ?? 0;
  const rawMrp = variant?.mrp ?? product.mrp;
  const mrp = rawMrp && rawMrp > price ? rawMrp : price;
  const stock = sizes.length ? (variant?.stock ?? 0) : (product.stock ?? 0);
  const images = (variant?.images?.length ? variant.images : product.images) || [];
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  return { variant, price, mrp, stock, image: images[0], discount };
}

export const formatWishlistInr = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

interface WishlistContextValue {
  entries: WishlistEntry[];
  ids: Set<string>;
  productCount: number;
  totalCount: number;
  totalPrice: number;
  totalMrp: number;
  totalSavings: number;
  isLoading: boolean;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<boolean>;
  addToWishlist: (product: Product, qty?: number) => Promise<void>;
  updateWishlistQty: (productId: string, qty: number) => void;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  replaceProductSnapshots: (freshProducts: Product[]) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function readStoredEntries(): WishlistEntry[] {
  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is WishlistEntry =>
        Boolean(item && typeof item === "object" && "product" in item && item.product?.id),
    );
  } catch {
    window.localStorage.removeItem(WISHLIST_STORAGE_KEY);
    return [];
  }
}

function readStoredQtys(): Record<string, number> {
  try {
    const raw = window.localStorage.getItem(WISHLIST_QTY_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as Record<string, number>) : {};
  } catch {
    window.localStorage.removeItem(WISHLIST_QTY_STORAGE_KEY);
    return {};
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [guestEntries, setGuestEntries] = useState<WishlistEntry[]>([]);
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});
  const [hydrated, setHydrated] = useState(false);
  const syncedUserRef = useRef<string | null>(null);

  useEffect(() => {
    setGuestEntries(readStoredEntries());
    setQtyMap(readStoredQtys());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(guestEntries));
    }
  }, [guestEntries, hydrated]);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(WISHLIST_QTY_STORAGE_KEY, JSON.stringify(qtyMap));
    }
  }, [qtyMap, hydrated]);

  const wishlistQuery = useQuery({
    queryKey: queryKeys.wishlist,
    queryFn: wishlistApi.list,
    enabled: isAuthenticated,
    staleTime: 60_000,
  });

  // Merge any guest-saved products into the customer's account on sign-in.
  useEffect(() => {
    if (!hydrated || !isAuthenticated || !user?.id) {
      if (!isAuthenticated) syncedUserRef.current = null;
      return;
    }
    if (syncedUserRef.current === user.id) return;
    syncedUserRef.current = user.id;

    if (guestEntries.length === 0) return;
    const guestIds = guestEntries.map((entry) => entry.product.id);
    const guestQtys: Record<string, number> = {};
    for (const entry of guestEntries) {
      if (entry.qty > 1) guestQtys[entry.product.id] = entry.qty;
    }

    void wishlistApi
      .sync(guestIds)
      .then((synced) => {
        queryClient.setQueryData<Wishlist>(queryKeys.wishlist, synced);
        if (Object.keys(guestQtys).length > 0) {
          setQtyMap((prev) => ({ ...guestQtys, ...prev }));
        }
        setGuestEntries([]);
      })
      .catch(() => {
        // Keep guest items intact if sync hits a transient network error.
      });
  }, [hydrated, isAuthenticated, user?.id, guestEntries, queryClient]);

  const entries: WishlistEntry[] = useMemo(() => {
    if (isAuthenticated) {
      const products = wishlistQuery.data?.products ?? [];
      return products.map((product) => ({
        product,
        qty: Math.max(1, qtyMap[product.id] ?? 1),
        addedAt: "",
      }));
    }
    return guestEntries;
  }, [isAuthenticated, wishlistQuery.data?.products, qtyMap, guestEntries]);

  const ids = useMemo(() => new Set(entries.map((entry) => entry.product.id)), [entries]);

  const isWishlisted = useCallback((productId: string) => ids.has(productId), [ids]);

  const openWishlistToastAction = useMemo(
    () => ({
      label: "View Wishlist",
      onClick: () => {
        void navigate({ to: "/wishlist" });
      },
    }),
    [navigate],
  );

  const addToWishlist = useCallback(
    async (product: Product, qty = 1) => {
      const normalizedQty = Math.max(1, Math.min(qty, 99));
      if (!isAuthenticated) {
        setGuestEntries((current) => {
          const existing = current.find((item) => item.product.id === product.id);
          if (existing) {
            return current.map((item) =>
              item.product.id === product.id
                ? { ...item, product, qty: Math.max(1, item.qty) }
                : item,
            );
          }
          return [
            {
              product: {
                ...product,
                wishlist_count: Math.max(product.wishlist_count ?? 0, 1),
              },
              qty: normalizedQty,
              addedAt: new Date().toISOString(),
            },
            ...current,
          ];
        });
        toast.success(`Added "${product.title}" to wishlist`, {
          action: openWishlistToastAction,
        });
        return;
      }

      const previous = queryClient.getQueryData<Wishlist>(queryKeys.wishlist);
      queryClient.setQueryData<Wishlist>(queryKeys.wishlist, (current) => {
        const currentProducts = current?.products ?? [];
        const currentIds = current?.ids ?? currentProducts.map((p) => p.id);
        if (currentIds.includes(product.id)) return current;
        return {
          ...current,
          ids: [product.id, ...currentIds],
          products: [
            { ...product, wishlist_count: (product.wishlist_count ?? 0) + 1 },
            ...currentProducts,
          ],
        };
      });
      if (normalizedQty > 1) {
        setQtyMap((prev) => ({ ...prev, [product.id]: normalizedQty }));
      }
      try {
        await wishlistApi.add(product.id);
        void queryClient.invalidateQueries({ queryKey: queryKeys.wishlist });
        void queryClient.invalidateQueries({ queryKey: queryKeys.product(product.id) });
        toast.success(`Added "${product.title}" to wishlist`, {
          action: openWishlistToastAction,
        });
      } catch (err) {
        queryClient.setQueryData(queryKeys.wishlist, previous);
        toast.error(normalizeApiError(err).message);
      }
    },
    [isAuthenticated, queryClient, openWishlistToastAction],
  );

  const removeFromWishlist = useCallback(
    async (productId: string, title?: string) => {
      if (!isAuthenticated) {
        setGuestEntries((current) => current.filter((item) => item.product.id !== productId));
        if (title) toast.success(`Removed "${title}" from wishlist`);
        return;
      }

      const previous = queryClient.getQueryData<Wishlist>(queryKeys.wishlist);
      queryClient.setQueryData<Wishlist>(queryKeys.wishlist, (current) => {
        const nextProducts = (current?.products ?? []).filter((p) => p.id !== productId);
        return {
          ...current,
          ids: (current?.ids ?? []).filter((id) => id !== productId),
          products: nextProducts,
        };
      });
      setQtyMap((prev) => {
        if (!(productId in prev)) return prev;
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
      try {
        await wishlistApi.remove(productId);
        void queryClient.invalidateQueries({ queryKey: queryKeys.wishlist });
        void queryClient.invalidateQueries({ queryKey: queryKeys.product(productId) });
        if (title) toast.success(`Removed "${title}" from wishlist`);
      } catch (err) {
        queryClient.setQueryData(queryKeys.wishlist, previous);
        toast.error(normalizeApiError(err).message);
      }
    },
    [isAuthenticated, queryClient],
  );

  const toggleWishlist = useCallback(
    async (product: Product): Promise<boolean> => {
      if (ids.has(product.id)) {
        await removeFromWishlist(product.id, product.title);
        return false;
      }
      await addToWishlist(product);
      return true;
    },
    [ids, addToWishlist, removeFromWishlist],
  );

  const updateWishlistQty = useCallback(
    (productId: string, nextQty: number) => {
      const clamped = Math.max(1, Math.min(nextQty, 99));
      if (!isAuthenticated) {
        setGuestEntries((current) =>
          current.map((entry) => {
            if (entry.product.id !== productId) return entry;
            const { stock } = wishlistProductPricing(entry.product);
            const cap = stock > 0 ? Math.min(stock, 99) : 99;
            return { ...entry, qty: Math.max(1, Math.min(clamped, cap)) };
          }),
        );
        return;
      }
      setQtyMap((prev) => ({ ...prev, [productId]: clamped }));
    },
    [isAuthenticated],
  );

  const clearWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setGuestEntries([]);
      toast.success("Wishlist cleared");
      return;
    }
    const existingIds = [...ids];
    const previous = queryClient.getQueryData<Wishlist>(queryKeys.wishlist);
    queryClient.setQueryData<Wishlist>(queryKeys.wishlist, { ids: [], products: [] });
    setQtyMap({});
    try {
      await Promise.all(existingIds.map((id) => wishlistApi.remove(id)));
      void queryClient.invalidateQueries({ queryKey: queryKeys.wishlist });
      toast.success("Wishlist cleared");
    } catch (err) {
      queryClient.setQueryData(queryKeys.wishlist, previous);
      toast.error(normalizeApiError(err).message);
    }
  }, [isAuthenticated, ids, queryClient]);

  const replaceProductSnapshots = useCallback((freshProducts: Product[]) => {
    if (freshProducts.length === 0) return;
    const byId = new Map(freshProducts.map((p) => [p.id, p]));
    setGuestEntries((current) => {
      let changed = false;
      const next = current.map((entry) => {
        const fresh = byId.get(entry.product.id);
        if (!fresh) return entry;
        changed = true;
        return { ...entry, product: fresh };
      });
      return changed ? next : current;
    });
  }, []);

  const totals = useMemo(() => {
    let totalCount = 0;
    let totalPrice = 0;
    let totalMrp = 0;
    for (const entry of entries) {
      const { price, mrp } = wishlistProductPricing(entry.product);
      totalCount += entry.qty;
      totalPrice += price * entry.qty;
      totalMrp += mrp * entry.qty;
    }
    return {
      productCount: entries.length,
      totalCount,
      totalPrice,
      totalMrp,
      totalSavings: Math.max(0, totalMrp - totalPrice),
    };
  }, [entries]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      entries,
      ids,
      productCount: totals.productCount,
      totalCount: totals.totalCount,
      totalPrice: totals.totalPrice,
      totalMrp: totals.totalMrp,
      totalSavings: totals.totalSavings,
      isLoading: isAuthenticated && wishlistQuery.isLoading,
      isWishlisted,
      toggleWishlist,
      addToWishlist,
      updateWishlistQty,
      removeFromWishlist: (productId: string) => removeFromWishlist(productId),
      clearWishlist,
      replaceProductSnapshots,
    }),
    [
      entries,
      ids,
      totals,
      isAuthenticated,
      wishlistQuery.isLoading,
      isWishlisted,
      toggleWishlist,
      addToWishlist,
      updateWishlistQty,
      removeFromWishlist,
      clearWishlist,
      replaceProductSnapshots,
    ],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
}

