import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Sistema de Controle de Estoque",
  description: "Sistema para gestão de estoque e produtos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen bg-gray-50">
          {/* Barra de navegação */}

          {/* Conteúdo principal */}
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
