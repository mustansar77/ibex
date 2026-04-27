import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "IBEX Institute - Excellence in Education | Bahawalpur",
  description:
    "IBEX Institute Bahawalpur — Punjab's leading preparatory institute for Entry Tests and Evening Coaching. Achieve your academic goals with expert faculty and proven results.",
  keywords: "IBEX Institute, Bahawalpur, Entry Test Preparation, Evening Coaching, Punjab, Pakistan, MDCAT, ECAT, NTS",
  openGraph: {
    title: "IBEX Institute - Excellence in Education",
    description: "Leading preparatory institute in Bahawalpur, Punjab for Entry Tests and Evening Coaching.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
