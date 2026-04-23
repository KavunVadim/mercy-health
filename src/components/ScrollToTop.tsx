"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Відключаємо автоматичне відновлення скролу браузером
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Миттєвий скрол на самий верх
    window.scrollTo(0, 0);
    
    // Додаткова перевірка через короткий час для впевненості
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
