import "./globals.css";

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
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
