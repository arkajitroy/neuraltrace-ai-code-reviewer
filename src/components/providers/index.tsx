import { PropsWithChildren } from "react";
import ThemeProvider from "./theme-provider";
import { TooltipProvider } from "../ui/tooltip";

export default function RootProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
