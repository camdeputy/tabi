import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { GlobalSidebar } from "@/components/GlobalSidebar"
import '@/app/globals.css'

export const metadata: Metadata = {
  title: "Tabi",
  description: "A fitness tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body className="bg-background font-sans antialiased">
          <div className="relative flex flex-col">
            <SidebarProvider>
              <GlobalSidebar />
              <div className="flex-1">
                <SidebarTrigger />
                {children}
              </div>
            </SidebarProvider>
          </div>
        </body>
      </html>
  );
}