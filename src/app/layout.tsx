import type { Metadata } from "next";
import { Inter, Roboto, Poppins, Montserrat } from "next/font/google";
import Link from "next/link";
import "./globals.css";

// Escolha uma fonte moderna (você pode experimentar diferentes)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

// Ou Roboto
const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
});

// Ou Poppins (muito moderna e limpa)
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

// Ou Montserrat (elegante e moderna)
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sistema de Controle de Estoque",
  description: "Sistema profissional para gestão de estoque",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} font-sans`}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              Controle de Estoque
            </Link>
            <div className="flex gap-4">
              <Link
                href="/pessoas"
                className="hover:text-gray-300 transition-colors"
              >
                Pessoas
              </Link>
              {/* Adicione mais links de navegação aqui conforme necessário */}
            </div>
          </div>
        </nav>
        <main className="container mx-auto py-6">{children}</main>
      </body>
    </html>
  );
}
