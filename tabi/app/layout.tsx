import type { Metadata } from "next";
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
        <body className="">
          <div className="">
            {children}
          </div>
        </body>
      </html>
  );
}