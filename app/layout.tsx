import { FileExplorerSidebarServer } from "@/components/file-explorer-sidebar-server";
import {
  AuthAwareSidebar,
  AuthAwareSidebarTrigger,
} from "@/components/auth-aware-sidebar";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { appMetadata } from "@/lib/app-config";

import "./globals.css";

export const metadata = appMetadata;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider>
          <TooltipProvider>
            <SidebarProvider>
              <AuthAwareSidebar>
                <FileExplorerSidebarServer />
              </AuthAwareSidebar>
              <div className="min-w-0 flex-1">
                <Navbar />
                <AuthAwareSidebarTrigger />
                {children}
              </div>
              <Toaster />
            </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
