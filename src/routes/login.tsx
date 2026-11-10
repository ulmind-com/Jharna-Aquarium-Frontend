import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/auth/auth-card";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In | Jharna Aquarium & Nursery" },
      { name: "description", content: "Sign in to manage your orders, addresses, and wishlist." },
      { property: "og:title", content: "Sign In | Jharna Aquarium & Nursery" },
      { property: "og:description", content: "Access your Jharna Aquarium & Nursery account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <AuthCard initialMode="login" />,
});
