import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Maintenance Scheduling",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
