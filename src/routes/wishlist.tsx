import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Heart, Minus, Plus, ShoppingBag, ShoppingCart, Sparkles, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { productsApi } from "@/api/services";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import {
  formatWishlistInr,
  useWishlist,
  wishlistProductPricing,
} from "@/contexts/wishlist-context";
import { EmptyState, PageSkeleton } from "@/components/shared/page-state";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist | Jharna Aquarium & Nursery" },
      {
        name: "description",
        content: "Your saved plants, fish, aquariums, pet care and garden favourites with live totals.",
      },
      { property: "og:title", content: "Wishlist | Jharna Aquarium & Nursery" },
      { property: "og:description", content: "Your saved Jharna Aquarium & Nursery favourites." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const { addItem, openCart } = useCart();
  const {
    entries,
    productCount,
    totalCount,
    totalPrice,
    totalMrp,
    totalSavings,
    isLoading,
    updateWishlistQty,
    removeFromWishlist,
    clearWishlist,
    replaceProductSnapshots,
  } = useWishlist();

  // Keep guest-stored product snapshots aligned with current backend price/stock/counts.
  const refreshedKeyRef = useRef("");
  useEffect(() => {
    if (isAuthenticated || entries.length === 0) return;
    const key = entries.map((e) => e.product.id).sort().join(",");
    if (!key || refreshedKeyRef.current === key) return;
    refreshedKeyRef.current = key;

    void Promise.allSettled(entries.map((entry) => productsApi.get(entry.product.id))).then(
      (results) => {
        const fresh = results
          .filter((res): res is PromiseFulfilledResult<Awaited<ReturnType<typeof productsApi.get>>> => res.status === "fulfilled")
          .map((res) => res.value);
        if (fresh.length > 0) replaceProductSnapshots(fresh);
      },
    );
  }, [isAuthenticated, entries, replaceProductSnapshots]);

  if (isLoading) return <PageSkeleton />;

  const inStockEntries = entries.filter(
    (entry) => wishlistProductPricing(entry.product).stock > 0,
  );
  const inStockItemCount = inStockEntries.reduce((sum, entry) => sum + entry.qty, 0);

  const addSingleToCart = (entry: (typeof entries)[number]) => {
    const { variant, price, mrp, stock, image } = wishlistProductPricing(entry.product);
    if (stock < 1) {
      toast.error(`${entry.product.title} is currently out of stock`);
      return;
    }
    const qtyToAdd = Math.min(entry.qty, stock);
    addItem(
      {
        product_id: entry.product.id,
        title: entry.product.title,
        ...(image ? { image } : {}),
        qty: qtyToAdd,
        ...(variant?.name ? { size_variant: variant.name } : {}),
        ...(variant?.pot_type ? { pot_type: variant.pot_type } : {}),
        unit_price: price,
        ...(mrp > price ? { mrp } : {}),
        stock,
        ...(variant?.sku ? { sku: variant.sku } : {}),
      },
      { openDrawer: false },
    );
    toast.success(`Added ${qtyToAdd} × ${entry.product.title} to cart`, {
      action: { label: "View cart", onClick: openCart },
    });
  };

  const addAllToCart = () => {
    if (inStockEntries.length === 0) {
      toast.error("No in-stock wishlist items to add");
      return;
    }
    let addedUnits = 0;
    for (const entry of inStockEntries) {
      const { variant, price, mrp, stock, image } = wishlistProductPricing(entry.product);
      const qtyToAdd = Math.min(entry.qty, stock);
      if (qtyToAdd <= 0) continue;
      addedUnits += qtyToAdd;
      addItem(
        {
          product_id: entry.product.id,
          title: entry.product.title,
          ...(image ? { image } : {}),
          qty: qtyToAdd,
          ...(variant?.name ? { size_variant: variant.name } : {}),
          ...(variant?.pot_type ? { pot_type: variant.pot_type } : {}),
          unit_price: price,
          ...(mrp > price ? { mrp } : {}),
          stock,
          ...(variant?.sku ? { sku: variant.sku } : {}),
        },
        { openDrawer: false },
      );
    }
    openCart();
    toast.success(`Added ${addedUnits} item${addedUnits === 1 ? "" : "s"} from wishlist to cart`);
  };

  return (
    <div className="bg-storefront-wash min-h-[70vh] pb-24 lg:pb-0">
      <div className="mx-auto max-w-[1480px] px-4 py-8 pb-12 sm:px-6 lg:px-10 lg:py-12">
        {/* Header + live Count / In Total banner */}
        <div className="flex flex-col gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600">
              <Heart className="size-3.5 fill-rose-500 text-rose-500" />
              Saved Favourites
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl font-extrabold text-forest sm:text-4xl">
                Your Wishlist
              </h1>
              <span
                data-testid="wishlist-page-count-pill"
                className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-200"
              >
                {totalCount} {totalCount === 1 ? "item" : "items"}
                {productCount !== totalCount && (
                  <span className="font-medium text-rose-600/80">
                    ({productCount} products)
                  </span>
                )}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {entries.length > 0
                ? "Track your saved items, adjust desired counts, and move favourites straight to your cart."
                : "Save plants, aquariums, birds, pet food, pots and garden essentials to compare and buy anytime."}
            </p>
          </div>

          <div
            data-testid="wishlist-header-total-card"
            className="flex items-center justify-between gap-5 rounded-2xl border border-forest/15 bg-card px-5 py-3.5 shadow-xs sm:justify-end"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                In Wishlist
              </p>
              <p className="price-num text-lg font-extrabold text-foreground">
                {totalCount} {totalCount === 1 ? "item" : "items"}
              </p>
            </div>
            <div className="h-9 w-px bg-border" aria-hidden />
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                In Total
              </p>
              <p className="price-num font-display text-xl font-extrabold text-forest sm:text-2xl">
                {formatWishlistInr(totalPrice)}
              </p>
            </div>
          </div>
        </div>

        {/* Non-blocking account sync prompt for guests */}
        {!isAuthenticated && entries.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary-tint/70 px-4 py-3 text-sm">
            <p className="flex items-center gap-2 text-forest">
              <Sparkles className="size-4 shrink-0 text-primary" />
              <span>
                Saved on this device. Sign in anytime to sync your wishlist across all devices.
              </span>
            </p>
            <Button asChild size="sm" variant="outline" className="rounded-full bg-background">
              <Link to="/login">Sign in to sync</Link>
            </Button>
          </div>
        )}

        {entries.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No saved products yet"
              description="Tap the heart icon on any product to add it here, track its count, and see your total."
              action={
                <Button asChild className="rounded-full px-6">
                  <Link to="/plants" search={{}}>
                    Explore products
                  </Link>
                </Button>
              }
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Left column: Wishlisted product cards */}
            <div className="space-y-4">
              {entries.map((entry) => {
                const { product, qty } = entry;
                const { variant, price, mrp, stock, image, discount } =
                  wishlistProductPricing(product);
                const lineTotal = price * qty;
                const popularityCount = product.wishlist_count ?? 0;

                return (
                  <article
                    key={product.id}
                    data-testid={`wishlist-item-${product.id}`}
                    className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-xs transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:p-5"
                  >
                    <Link
                      to="/product/$id"
                      params={{ id: product.id }}
                      className="relative size-28 shrink-0 overflow-hidden rounded-xl bg-primary-tint sm:size-32"
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={product.title}
                          loading="lazy"
                          className="size-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <span className="flex size-full items-center justify-center px-2 text-center text-xs text-muted-foreground">
                          No image
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-forest px-2 py-0.5 text-[10px] font-bold text-forest-foreground">
                          {discount}% OFF
                        </span>
                      )}
                      {stock < 1 && (
                        <span className="absolute inset-x-0 bottom-0 bg-foreground/80 py-1 text-center text-[10px] font-semibold text-background">
                          Out of stock
                        </span>
                      )}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            to="/product/$id"
                            params={{ id: product.id }}
                            className="line-clamp-2 font-display text-base font-bold text-forest transition-colors hover:text-primary sm:text-lg"
                          >
                            {product.title}
                          </Link>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            {variant?.name && <span>Variant: {variant.name}</span>}
                            {Boolean(product.rating) && (
                              <span className="inline-flex items-center gap-1 font-medium text-foreground">
                                <Star className="size-3.5 fill-star text-star" />
                                {(product.rating ?? 0).toFixed(1)}
                              </span>
                            )}
                            {popularityCount > 0 && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600">
                                <Heart className="size-3 fill-rose-500 text-rose-500" />
                                {popularityCount} wishlisted
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => void removeFromWishlist(product.id)}
                          aria-label={`Remove ${product.title} from wishlist`}
                          title="Remove from wishlist"
                          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 transition-colors hover:bg-rose-100 cursor-pointer"
                        >
                          <Heart className="size-4 fill-rose-500 text-rose-500" />
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
                        <div className="flex items-baseline gap-2">
                          <span className="price-num text-lg font-extrabold text-forest">
                            {formatWishlistInr(price)}
                          </span>
                          {mrp > price && (
                            <span className="price-num text-xs font-medium text-sale line-through">
                              {formatWishlistInr(mrp)}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">each</span>
                        </div>
                        <div className="text-right text-sm">
                          <span className="text-muted-foreground">Item Total: </span>
                          <strong className="price-num font-bold text-foreground">
                            {formatWishlistInr(lineTotal)}
                          </strong>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2.5">
                        {/* Per-product count stepper */}
                        <div className="inline-flex h-9 items-center rounded-full border border-border bg-background px-1">
                          <button
                            type="button"
                            onClick={() => updateWishlistQty(product.id, qty - 1)}
                            disabled={qty <= 1}
                            aria-label={`Decrease count for ${product.title}`}
                            className="flex size-7 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary disabled:opacity-40 cursor-pointer"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span
                            data-testid={`wishlist-qty-${product.id}`}
                            className="price-num min-w-8 text-center text-xs font-bold"
                          >
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateWishlistQty(product.id, qty + 1)}
                            disabled={stock > 0 ? qty >= Math.min(stock, 99) : qty >= 99}
                            aria-label={`Increase count for ${product.title}`}
                            className="flex size-7 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary disabled:opacity-40 cursor-pointer"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>

                        <Button
                          type="button"
                          size="sm"
                          disabled={stock < 1}
                          onClick={() => addSingleToCart(entry)}
                          className="h-9 rounded-full bg-forest px-4 text-xs font-semibold text-forest-foreground hover:bg-forest/90"
                        >
                          <ShoppingCart className="size-3.5" />
                          {stock > 0 ? "Add to Cart" : "Out of stock"}
                        </Button>

                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => void removeFromWishlist(product.id)}
                          className="ml-auto h-9 rounded-full px-3 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Right column: Sticky Wishlist Summary with Count & In Total */}
            <aside
              data-testid="wishlist-summary-sidebar"
              className="h-fit rounded-2xl border border-forest/15 bg-card p-6 shadow-sm lg:sticky lg:top-24"
            >
              <h2 className="font-display text-xl font-extrabold text-forest">
                Wishlist Summary
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Live count &amp; total value of your saved items
              </p>

              {/* Itemized mini summary list */}
              <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto border-y border-border/70 py-3 text-xs">
                {entries.map((entry) => {
                  const { price } = wishlistProductPricing(entry.product);
                  return (
                    <li
                      key={entry.product.id}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="truncate text-foreground/85">
                        {entry.product.title}{" "}
                        <span className="font-semibold text-muted-foreground">
                          × {entry.qty}
                        </span>
                      </span>
                      <span className="price-num shrink-0 font-semibold text-foreground">
                        {formatWishlistInr(price * entry.qty)}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Products Wishlisted</dt>
                  <dd className="price-num font-bold text-foreground">{productCount}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Total Items Count</dt>
                  <dd className="price-num font-bold text-foreground">
                    {totalCount} {totalCount === 1 ? "item" : "items"}
                  </dd>
                </div>
                {totalSavings > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Total MRP</dt>
                      <dd className="price-num text-muted-foreground line-through">
                        {formatWishlistInr(totalMrp)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Total Discount Savings</dt>
                      <dd className="price-num font-bold text-emerald-700">
                        -{formatWishlistInr(totalSavings)}
                      </dd>
                    </div>
                  </>
                )}
              </dl>

              <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
                <span className="text-base font-bold text-foreground">In Total</span>
                <span
                  data-testid="wishlist-in-total-price"
                  className="price-num font-display text-2xl font-extrabold text-forest"
                >
                  {formatWishlistInr(totalPrice)}
                </span>
              </div>

              <div className="mt-6 space-y-2.5">
                <Button
                  type="button"
                  size="lg"
                  disabled={inStockEntries.length === 0}
                  onClick={addAllToCart}
                  className="h-11 w-full rounded-full bg-forest font-semibold text-forest-foreground hover:bg-forest/90"
                >
                  <ShoppingBag className="size-4" />
                  Add all to cart ({inStockItemCount})
                </Button>
                <Button asChild variant="outline" className="h-10 w-full rounded-full">
                  <Link to="/plants" search={{}}>
                    Continue shopping
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => void clearWishlist()}
                  className="w-full rounded-full text-xs text-muted-foreground hover:text-destructive"
                >
                  Clear wishlist
                </Button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
