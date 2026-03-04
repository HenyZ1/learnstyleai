import "./globals.css";

export const metadata = {
  title: "LearnStyle AI - Kişiselleştirilmiş Öğrenme",
  description: "Yapay zeka ile kişiselleştirilmiş öğrenme deneyimi. Kendi öğrenme stilinizi keşfedin ve AI destekli eğitim alın.",
  keywords: "AI öğrenme, kişiselleştirilmiş eğitim, öğrenme stili, yapay zeka, eğitim teknolojisi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
