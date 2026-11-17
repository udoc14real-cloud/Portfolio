"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initFx } from "@/lib/fx";

/** Starts all page motion, and restarts it on every route change. */
export default function FxBoot() {
  const pathname = usePathname();
  useEffect(() => {
    let cleanup = () => {};
    const id = requestAnimationFrame(() => {
      cleanup = initFx();
    });
    return () => {
      cancelAnimationFrame(id);
      cleanup();
    };
  }, [pathname]);
  return null;
}
