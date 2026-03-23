import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Nav } from "./components/nav";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Panel de reservas",
  description: "Gestión de citas y servicios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={geist.variable}>
      <body
        className={`${geist.className} min-h-screen bg-slate-50 text-slate-900 antialiased`}
      >
        <Nav />
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 md:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
