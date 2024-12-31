"use client";

import { cleanUpPath } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function DynamicTitle() {
  const pathname = usePathname();
  const [title, setTitle] = useState("Dashboard");

  useEffect(() => {
    if (pathname) {
      setTitle(cleanUpPath(pathname));
    }
  }, [pathname]);

  return title;
}
