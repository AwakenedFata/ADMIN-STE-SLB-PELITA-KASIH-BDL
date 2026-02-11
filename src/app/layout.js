import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "SLB Admin Panel",
  description: "Admin Panel for SLB Pelita Kasih Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        className={`${inter.variable} antialiased bg-slate-50 text-slate-900`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
