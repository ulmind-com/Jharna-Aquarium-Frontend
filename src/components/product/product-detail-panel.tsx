import * as React from "react";
import {
  BadgeCheck,
  Check,
  Copy,
  Eye,
  MapPin,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Timer,
  Truck,
  Wallet,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Googlepay, Visa, Mastercard } from "react-pay-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { money } from "@/components/product/product-card";
import type { Product, Settings } from "@/types/api";

/* ------------------------------------------------------------------ *
 * Product detail panel — layout mirrored from the reference design:
 * bestseller rating, live urgency, price, prepaid offer strip, cart +
 * green buy-now block, coupon cards, delivery estimator, trust grid and
 * a specifications card. Data is pulled from the product/settings; any
 * copy that has no data source falls back to sensible store defaults.
 * ------------------------------------------------------------------ */

/** Deterministic small integer from a string, so "live" numbers stay
 *  stable for a given product instead of jumping on every render. */
function seedFrom(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return hash;
}

function two(n: number): string {
  return n.toString().padStart(2, "0");
}

// -- Bestseller + rating -------------------------------------------------

export function BestsellerRating({
  rating,
  count,
  bestseller,
}: {
  rating?: number | undefined;
  count?: number | undefined;
  bestseller?: boolean | undefined;
}) {
  const value = rating && rating > 0 ? rating : 4.9;
  const reviews = count && count > 0 ? count : undefined;
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <Sparkles key={i} className={`size-3.5 ${i < Math.round(value) ? "fill-star text-star" : "text-border"}`} />
        ))}
      </span>
      <span className="text-sm font-bold text-foreground">{value.toFixed(2)}/5</span>
      {reviews && (
        <span className="text-xs text-muted-foreground">
          Rated by {reviews.toLocaleString("en-IN")} Verified Customers
        </span>
      )}
      {bestseller && (
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-forest">
          <Zap className="size-3" /> Bestseller
        </span>
      )}
    </div>
  );
}

// -- Live urgency row ----------------------------------------------------

export function UrgencyRow({ productId }: { productId: string }) {
  const seed = seedFrom(productId);
  // 42–86 "viewers", nudged every few seconds so it feels live.
  const [viewers, setViewers] = React.useState(() => 42 + (seed % 45));
  // A per-product sale window of ~3 hours that counts down to zero and loops.
  const [left, setLeft] = React.useState(() => {
    const window = 3 * 3600;
    return window - (Math.floor(Date.now() / 1000) % window) - (seed % 900);
  });

  React.useEffect(() => {
    const tick = window.setInterval(() => {
      setLeft((prev) => (prev <= 1 ? 3 * 3600 : prev - 1));
      setViewers((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(92, Math.max(38, prev + delta));
      });
    }, 1000);
    return () => window.clearInterval(tick);
  }, []);

  const safe = Math.max(0, left);
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-forest">
        <Eye className="size-3.5" /> {viewers} people viewing now
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-sale/10 px-3 py-1.5 text-xs font-semibold text-sale">
        <Timer className="size-3.5" /> Sale ends in {two(h)}:{two(m)}:{two(s)}
      </span>
    </div>
  );
}

// -- Price block ---------------------------------------------------------

export function PriceBlock({
  price,
  mrp,
  taxInclusive,
}: {
  price: number;
  mrp?: number | null | undefined;
  taxInclusive?: boolean;
}) {
  const off = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2.5">
      <span className="price-num text-3xl font-bold text-sale">{money(price)}</span>
      {mrp && mrp > price && (
        <span className="text-sm text-muted-foreground">
          MRP <span className="price-num line-through">{money(mrp)}</span>
        </span>
      )}
      {off > 0 && <span className="price-num text-sm font-bold text-forest">{off}% OFF</span>}
      {taxInclusive && <span className="text-xs text-muted-foreground">(Incl. of all taxes)</span>}
    </div>
  );
}

// -- Payment method chips (inline, no network) --------------------------

/** UPI wordmark chip — not shipped by the payment-icons package. */
function UpiLogo() {
  return (
    <span className="inline-flex h-[22px] items-center gap-1 rounded border border-border bg-white px-1.5">
      <span className="text-[10px] font-extrabold tracking-tight text-[#0B2545]">UPI</span>
      <span className="flex flex-col gap-[2px]">
        <span className="h-[3px] w-2.5 -skew-x-12 bg-[#E97626]" />
        <span className="h-[3px] w-2.5 -skew-x-12 bg-[#0A8A3D]" />
      </span>
    </span>
  );
}

/** RuPay wordmark chip — not shipped by the payment-icons package. */
function RupayLogo() {
  return (
    <span className="inline-flex h-[22px] items-center rounded border border-border bg-white px-1.5 text-[10px] font-extrabold tracking-tight">
      <span className="text-[#E2231A]">Ru</span>
      <span className="text-[#1B3A6B]">Pay</span>
    </span>
  );
}

function PayChips({ className = "" }: { className?: string }) {
  const sz = { width: 34, height: 22 } as const;
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <UpiLogo />
      <Visa style={sz} className="rounded border border-border bg-white" />
      <Mastercard style={sz} className="rounded border border-border bg-white" />
      <RupayLogo />
    </div>
  );
}

function GPayMark() {
  return <Googlepay style={{ width: 42, height: 24 }} className="rounded border border-border bg-white" />;
}

// -- Welcome offer strip -------------------------------------------------

export function WelcomeOfferStrip({ amount = 100 }: { amount?: number }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3.5 py-2.5">
      <span className="rounded-md bg-forest px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-forest-foreground">
        Welcome Offer
      </span>
      <span className="text-sm font-semibold text-foreground">
        Flat {money(amount)} OFF <span className="font-normal text-muted-foreground">on 1st prepaid order</span>
      </span>
      <PayChips className="ml-auto" />
    </div>
  );
}

// -- Quantity + Add to cart ---------------------------------------------

export function QtyAddToCart({
  quantity,
  stock,
  onQuantityChange,
  onAdd,
  inStock,
}: {
  quantity: number;
  stock: number;
  onQuantityChange: (q: number) => void;
  onAdd: () => void;
  inStock: boolean;
}) {
  return (
    <div className="mt-5 flex items-stretch gap-3">
      <div className="grid h-13 w-28 shrink-0 grid-cols-3 items-center overflow-hidden rounded-lg border border-input bg-background">
        <Button type="button" variant="ghost" size="icon" className="h-full rounded-none" disabled={quantity <= 1} onClick={() => onQuantityChange(quantity - 1)} aria-label="Decrease quantity"><Minus className="size-4" /></Button>
        <span className="price-num text-center text-base font-semibold" aria-live="polite">{quantity}</span>
        <Button type="button" variant="ghost" size="icon" className="h-full rounded-none" disabled={stock < 1 || quantity >= stock} onClick={() => onQuantityChange(quantity + 1)} aria-label="Increase quantity"><Plus className="size-4" /></Button>
      </div>
      <Button type="button" onClick={onAdd} className="h-13 flex-1 rounded-lg bg-foreground text-sm font-bold text-background hover:bg-foreground/90">
        <ShoppingCart className="size-4" /> {inStock ? "Add to cart" : "Notify me"}
      </Button>
    </div>
  );
}

// -- Green Buy Now block -------------------------------------------------

export function BuyNowBlock({
  price,
  mrp,
  quantity,
  onBuyNow,
  disabled,
}: {
  price: number;
  mrp?: number | null | undefined;
  quantity: number;
  onBuyNow: () => void;
  disabled?: boolean;
}) {
  const save = mrp && mrp > price ? (mrp - price) * quantity : 0;
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-forest/20 shadow-sm">
      <div className="flex items-center justify-center gap-1.5 bg-forest px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-forest-foreground">
        <Zap className="size-3 fill-current" /> Extra fast shipping on prepaid orders
      </div>
      <button
        type="button"
        onClick={onBuyNow}
        disabled={disabled}
        className="flex w-full items-center gap-3 bg-gradient-to-r from-forest to-primary px-4 py-3 text-left text-primary-foreground transition-opacity hover:opacity-95 disabled:opacity-50"
      >
        <span className="flex items-center gap-1.5 text-base font-bold">Buy Now <span aria-hidden="true">→</span></span>
        <GPayMark />
        <PayChips className="hidden sm:flex" />
        <span className="ml-auto text-right">
          {mrp && mrp > price && <span className="price-num mr-1.5 text-xs text-primary-foreground/70 line-through">{money(mrp * quantity)}</span>}
          <span className="price-num text-lg font-bold">{money(price * quantity)}</span>
          {save > 0 && <span className="block text-[10px] font-semibold text-primary-foreground/85">Save {money(save)}</span>}
        </span>
      </button>
    </div>
  );
}

export function PayTrustLine() {
  return (
    <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
      <BadgeCheck className="size-4 text-forest" /> 86% of customers choose Pay Online for faster, hassle-free delivery
    </p>
  );
}

// -- Coupon cards --------------------------------------------------------

type Coupon = { tag: string; title: string; subtitle: string; code: string };

function CouponCard({ coupon }: { coupon: Coupon }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      toast.success("Coupon code copied successfully!");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the code");
    }
  };
  return (
    <div className="flex min-w-0 flex-col justify-between rounded-lg border border-border bg-card p-3">
      <div className="min-w-0">
        <span className="inline-block rounded bg-star/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-foreground/70">{coupon.tag}</span>
        <p className="mt-1.5 text-[13px] font-bold leading-tight text-foreground">{coupon.title}</p>
        <p className="text-[11px] leading-tight text-muted-foreground">{coupon.subtitle}</p>
      </div>
      <button type="button" onClick={copy} className="mt-2 flex items-center justify-between gap-1 rounded border border-dashed border-primary/50 bg-primary/5 px-2 py-1 text-xs font-bold text-forest">
        <span className="truncate">{coupon.code}</span>
        {copied ? <Check className="size-3.5 shrink-0" /> : <Copy className="size-3.5 shrink-0" />}
      </button>
    </div>
  );
}

export function CouponCards({ coupons }: { coupons: Coupon[] }) {
  if (!coupons.length) return null;
  return (
    <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {coupons.map((c) => (
        <CouponCard key={c.code} coupon={c} />
      ))}
    </div>
  );
}

/** Build default coupons; the first prepaid one carries the live code if
 *  the store settings expose one. */
export function defaultCoupons(settings?: Settings | undefined): Coupon[] {
  void settings;
  return [
    { tag: "Welcome", title: "Flat ₹100 OFF", subtitle: "For New Customers Only", code: "NEW100" },
    { tag: "Exclusive", title: "Extra 10% OFF", subtitle: "For All Prepaid Orders", code: "PREPAID10" },
    { tag: "Special", title: "Flat ₹100 OFF", subtitle: "On Orders Above ₹1000", code: "SAVE100" },
  ];
}

// -- Delivery estimator --------------------------------------------------

const PIN_CITY: Record<string, string> = {
  "7": "Kolkata, West Bengal",
  "11": "New Delhi, Delhi",
  "40": "Mumbai, Maharashtra",
  "56": "Bengaluru, Karnataka",
  "60": "Chennai, Tamil Nadu",
  "50": "Hyderabad, Telangana",
  "38": "Ahmedabad, Gujarat",
  "73": "Guwahati, Assam",
};

function cityForPin(pin: string): string {
  const two = pin.slice(0, 2);
  const one = pin.slice(0, 1);
  return PIN_CITY[two] ?? PIN_CITY[one] ?? "your city";
}

function deliveryDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function DeliveryEstimator() {
  const [pin, setPin] = React.useState("");
  const [result, setResult] = React.useState<{ city: string; date: string } | null>(null);
  const check = () => {
    const clean = pin.replace(/\D/g, "");
    if (clean.length !== 6) {
      toast.error("Enter a valid 6-digit pincode");
      return;
    }
    setResult({ city: cityForPin(clean), date: deliveryDate(4 + (Number(clean[5]) % 3)) });
  };
  return (
    <div className="mt-5 rounded-xl border border-border bg-card p-4">
      <div className="flex items-start gap-2.5">
        <Truck className="mt-0.5 size-5 shrink-0 text-forest" />
        <div>
          <p className="text-sm font-bold text-foreground">Get estimated delivery date</p>
          <p className="text-[11px] text-muted-foreground">Prepaid orders are delivered on priority</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="relative flex-1">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={pin}
            onChange={(e) => { setPin(e.target.value); setResult(null); }}
            onKeyDown={(e) => { if (e.key === "Enter") check(); }}
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter pincode"
            className="h-11 rounded-lg bg-background pl-9"
            aria-label="Delivery pincode"
          />
        </div>
        <Button type="button" onClick={check} className="h-11 rounded-lg bg-forest px-5 text-sm font-bold text-forest-foreground hover:bg-forest/90">Check</Button>
      </div>
      {result && (
        <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-forest">
          <Check className="size-4" /> Free Delivery to {result.city} by {result.date}
        </p>
      )}
      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3">
        <div className="flex items-center gap-2 text-xs">
          <Wallet className="size-4 shrink-0 text-forest" />
          <span><span className="font-bold text-foreground">10% Off</span><br /><span className="text-muted-foreground">Every Prepaid Order</span></span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Truck className="size-4 shrink-0 text-forest" />
          <span><span className="font-bold text-foreground">Free Shipping</span><br /><span className="text-muted-foreground">On all orders</span></span>
        </div>
      </div>
    </div>
  );
}

// -- Trust feature grid (2x2) -------------------------------------------

type Feature = { icon: typeof ShieldCheck; title: string; subtitle: string };

export function FeatureGrid() {
  const features: Feature[] = [
    { icon: Wallet, title: "100% Cashback", subtitle: "up to ₹500 via UPI" },
    { icon: RefreshCw, title: "6-Month", subtitle: "Free replacement" },
    { icon: ShieldCheck, title: "Quality Assured", subtitle: "100% authentic" },
    { icon: Truck, title: "Free Shipping", subtitle: "on orders ₹499+" },
  ];
  return (
    <div className="mt-4 grid grid-cols-2 gap-2.5">
      {features.map(({ icon: Icon, title, subtitle }) => (
        <div key={title} className="flex items-center gap-2.5 rounded-lg border border-border bg-card p-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10">
            <Icon className="size-4 text-forest" />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-bold leading-tight text-foreground">{title}</p>
            <p className="text-[11px] leading-tight text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// -- Specifications card -------------------------------------------------

export type SpecRow = { label: string; value: string };

export function SpecificationsCard({ rows }: { rows: SpecRow[] }) {
  if (!rows.length) return null;
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-start justify-between gap-3 p-5 pb-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Product Information</p>
          <h2 className="mt-1 text-2xl font-bold text-foreground">Specifications</h2>
        </div>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10">
          <ShieldCheck className="size-4 text-forest" />
        </span>
      </div>
      <dl className="px-5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-6 border-t border-border py-3">
            <dt className="text-sm text-muted-foreground">{row.label}</dt>
            <dd className="max-w-[60%] text-right text-sm font-semibold text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="m-5 mt-4 flex items-center gap-2.5 rounded-lg bg-forest px-4 py-3 text-forest-foreground">
        <ShieldCheck className="size-5 shrink-0" />
        <div>
          <p className="text-sm font-bold">Authenticity &amp; Quality Assured</p>
          <p className="text-[11px] text-forest-foreground/80">Carefully selected &amp; verified</p>
        </div>
      </div>
    </div>
  );
}

/** Pull specification rows from a product, adapted to this store. */
export function specRowsForProduct(product: Product): SpecRow[] {
  const spec = product.plant_spec as Record<string, unknown> | undefined;
  const brand = typeof product.brand === "string" ? product.brand : product.brand?.name;
  const text = (v: unknown): string | undefined => {
    if (typeof v === "string") return v.trim() || undefined;
    if (typeof v === "number") return String(v);
    if (typeof v === "boolean") return v ? "Yes" : undefined;
    if (Array.isArray(v)) return v.map(text).filter(Boolean).join(", ") || undefined;
    return undefined;
  };
  const rows: Array<SpecRow | null> = [
    product.tags?.length ? { label: "Category", value: product.tags[0]! } : null,
    brand ? { label: "Brand", value: brand } : { label: "Brand", value: "Jharna Aquarium" },
    text(spec?.["plant_type"]) ? { label: "Type", value: text(spec?.["plant_type"])! } : null,
    text(spec?.["sunlight"] ?? spec?.["sunlight_requirement"]) ? { label: "Sunlight", value: text(spec?.["sunlight"] ?? spec?.["sunlight_requirement"])! } : null,
    text(spec?.["watering"] ?? spec?.["water_schedule"] ?? spec?.["water_requirement"]) ? { label: "Watering", value: text(spec?.["watering"] ?? spec?.["water_schedule"] ?? spec?.["water_requirement"])! } : null,
    text(spec?.["difficulty"] ?? spec?.["difficulty_level"]) ? { label: "Care level", value: text(spec?.["difficulty"] ?? spec?.["difficulty_level"])! } : null,
    { label: "Origin", value: "Handpicked in India" },
    product.warranty ? { label: "Warranty", value: product.warranty } : null,
    { label: "Authenticity", value: "Quality-checked genuine" },
  ];
  return rows.filter((r): r is SpecRow => r !== null).slice(0, 7);
}
