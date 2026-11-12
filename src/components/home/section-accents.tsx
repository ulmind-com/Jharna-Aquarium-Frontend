/** Animated plant & aquarium Lottie accents echoing Jharna Aquarium & Nursery's
 *  dual botanical + aquatic identity with zero background frame. */

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useState } from "react";

export const LOTTIE_ACCENTS = {
  aquarium: {
    src: "/lottie/aquarium-fish.json",
  },
  hangingPlant: {
    src: "/lottie/hanging-plant.json",
  },
  pottedPlant: {
    src: "/lottie/potted-plant.json",
    // Keep pot & base foliage visible from the first painted frame instead of popping from 0%
    segment: [55, 105] as [number, number],
    mode: "bounce" as const,
    speed: 0.55,
  },
} as const;

export function DecorativeLottie({
  src,
  className = "",
  mirror = false,
  segment,
  mode = "forward",
  speed = 1,
}: {
  src: string;
  className?: string;
  mirror?: boolean;
  segment?: [number, number];
  mode?: "forward" | "reverse" | "bounce" | "reverse-bounce";
  speed?: number;
}) {
  const [mounted, setMounted] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (failed) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none overflow-hidden ${mirror ? "-scale-x-100" : ""} ${className}`}
    >
      {mounted && (
        <DotLottieReact
          src={src}
          loop
          autoplay
          mode={mode}
          speed={speed}
          {...(segment ? { segment } : {})}
          backgroundColor="transparent"
          className="size-full"
          dotLottieRefCallback={(player) => {
            player?.addEventListener("loadError", () => setFailed(true));
          }}
        />
      )}
    </div>
  );
}

export function DualTitleAccents(_props?: { variant?: "light" | "dark" }) {
  return (
    <span className="inline-flex items-center gap-2.5 align-middle" aria-hidden="true">
      <DecorativeLottie
        {...LOTTIE_ACCENTS.pottedPlant}
        className="aspect-[1050/2149] w-7 sm:w-8"
      />
      <DecorativeLottie
        {...LOTTIE_ACCENTS.aquarium}
        className="size-11 sm:size-12"
      />
    </span>
  );
}

