import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export const metadata = {
  title: "DSA Visualizer",
  description: "Interactive visualizations to help you master Data Structures and Algorithms",
};

import ThemeToggle from "@/components/ThemeToggle";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${rubik.variable} antialiased`}>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
