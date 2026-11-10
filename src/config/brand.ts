export const brand = {
  brandName: "Jharna Aquarium & Nursery",
  logo: null as string | null,
  favicon: "/favicon.ico",
  primaryColor: "#1F6B4F",
  supportEmail: "",
  supportPhone: "",
} as const;

/** Shop names seeded before the rebrand — treat any of these as unset so the
 *  current brandName is shown until Store Settings is updated. */
const LEGACY_SHOP_NAMES = ["Plant Nursery", "MyGarden", "My Garden"];

export function displayName(shopName: string | undefined): string {
  const name = shopName?.trim();
  return !name || LEGACY_SHOP_NAMES.includes(name) ? brand.brandName : name;
}
