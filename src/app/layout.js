import "./globals.css";
import { Inter, Outfit } from "next/font/google";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "LearnStyle AI - Kişiselleştirilmiş Öğrenme",
  description: "Yapay zeka ile kişiselleştirilmiş öğrenme deneyimi. Kendi öğrenme stilinizi keşfedin ve AI destekli eğitim alın.",
  keywords: "AI öğrenme, kişiselleştirilmiş eğitim, öğrenme stili, yapay zeka, eğitim teknolojisi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} ${outfit.variable}`}>{children}</body>
    </html>
  );
}
