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
          <nav className="bg-white shadow">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <Link href="/" className="text-blue-600 font-bold text-xl">
                      Controle de Estoque
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link
                      href="/produtos"
                      className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Produtos
                    </Link>
                    <Link
                      href="/configuracoes"
                      className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Configurações
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Conteúdo principal */}
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
