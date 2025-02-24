import type { Metadata } from "next";
import { Inter, Roboto, Poppins, Montserrat } from "next/font/google";
import Sidebar from "@/Components/Sidebar/Sidebar";
import "./globals.css";

// Escolha uma fonte moderna (você pode experimentar diferentes)
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700']
});

// Ou Roboto
const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['300', '400', '500', '700']
});

// Ou Poppins (muito moderna e limpa)
const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700']
});

// Ou Montserrat (elegante e moderna)
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700']
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
      <body 
        className={`${poppins.variable} font-sans`}
      >
        
        {children}
      </body>
    </html>
  );
}