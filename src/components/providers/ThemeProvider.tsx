"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme.store";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const darkMode = useThemeStore(
    (state) => state.darkMode
  );

  useEffect(() => {
    document.body.classList.toggle(
      "dark",
      darkMode
    );
  }, [darkMode]);

  return <>{children}</>;
}