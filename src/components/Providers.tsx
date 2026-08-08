"use client";

import { ThemeProvider } from "next-themes";
import CustomCursor from "@/components/CustomCursor";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <CustomCursor />
    </ThemeProvider>
  );
}
