import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { RoleProvider } from "@/context/role-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FlowDesk — Work, together",
    template: "%s · FlowDesk",
  },
  description:
    "FlowDesk is the project management, collaboration, analytics, and automation workspace for modern teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning is required by next-themes, which sets the
    // theme class on <html> before React hydrates.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider>
          <RoleProvider>
            {children}
            {/* App-wide toast host. Follows the active theme. */}
            <Toaster position="bottom-right" theme="system" richColors closeButton />
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
