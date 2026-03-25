import { PropsWithChildren } from "react";
import ThemeProvider from "./theme-provider";
import { TooltipProvider } from "../ui/tooltip";
import QueryProvider from "./query-provider.";
import AppLayout from "../layouts/app-layout";

export default function RootProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryProvider>
        <TooltipProvider>
          <AppLayout>{children}</AppLayout>
        </TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
