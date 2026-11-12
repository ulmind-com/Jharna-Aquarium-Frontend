import type { MouseEvent } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/contexts/wishlist-context";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/api";

interface WishlistHeartButtonProps {
  product: Product;
  variant?: "icon-float" | "icon-outline" | "pill";
  className?: string;
}

/**
 * Shared Wishlist toggle button used across product cards and product detail pages.
 * Safely prevents parent card navigation when clicked and shows live active heart state.
 */
export function WishlistHeartButton({
  product,
  variant = "icon-float",
  className,
}: WishlistHeartButtonProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const saved = isWishlisted(product.id);

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    void toggleWishlist(product);
  };

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
        data-wishlist-toggle={product.id}
        className={cn(
          "inline-flex h-11 items-center justify-center gap-2 rounded-md border px-4 text-xs font-bold transition-all duration-200 cursor-pointer",
          saved
            ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
            : "border-input bg-background text-foreground hover:border-rose-300 hover:text-rose-600",
          className,
        )}
      >
        <Heart
          className={cn(
            "size-4 transition-transform duration-200",
            saved ? "scale-110 fill-rose-500 text-rose-500" : "",
          )}
        />
        <span>{saved ? "Saved in Wishlist" : "Add to Wishlist"}</span>
      </button>
    );
  }

  if (variant === "icon-outline") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
        data-wishlist-toggle={product.id}
        className={cn(
          "inline-flex size-11 shrink-0 items-center justify-center rounded-md border transition-all duration-200 cursor-pointer",
          saved
            ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
            : "border-input bg-background text-foreground hover:border-rose-300 hover:text-rose-600",
          className,
        )}
      >
        <Heart
          className={cn(
            "size-5 transition-transform duration-200",
            saved ? "scale-110 fill-rose-500 text-rose-500" : "",
          )}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
      title={saved ? "Remove from wishlist" : "Add to wishlist"}
      data-wishlist-toggle={product.id}
      className={cn(
        "flex size-9 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-all duration-200 cursor-pointer active:scale-95",
        saved
          ? "bg-rose-50/95 text-rose-600 ring-1 ring-rose-200 opacity-100 translate-y-0"
          : "bg-white/95 text-forest hover:bg-rose-50 hover:text-rose-600",
        className,
      )}
    >
      <Heart
        className={cn(
          "size-4 transition-transform duration-200",
          saved ? "scale-110 fill-rose-500 text-rose-500" : "",
        )}
      />
    </button>
  );
}

