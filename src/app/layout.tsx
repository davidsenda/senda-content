import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Brújula — Marca Personal",
  description: "Tu brújula de marca personal. Trabajar mejor para vivir mejor.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-senda-beige min-h-screen">
        <Sidebar />
        <main className="lg:ml-60 pt-14 lg:pt-0 min-h-screen">
          <div className="max-w-6xl mx-auto p-6 lg:p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
