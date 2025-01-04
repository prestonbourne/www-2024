import * as React from "react"
import { AppThemeProvider } from "@/components/providers/theme";

import { ViewTransitions } from "next-view-transitions";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ViewTransitions>
      <AppThemeProvider>{children}</AppThemeProvider>
    </ViewTransitions>
  );
};
