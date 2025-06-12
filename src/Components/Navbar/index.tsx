"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiHome,
  FiUsers,
  FiBox,
  FiDollarSign,
  FiSettings,
} from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Se estiver na página de login, não renderiza a navbar
  if (pathname === "/login") {
    return null;
  }

  const handleLogout = () => {
    // Remove o token de autenticação
    localStorage.removeItem("auth_token");
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  const menuItems = [
    { href: "/", label: "Início", icon: FiHome },
    { href: "/usuarios", label: "Usuários", icon: FiUsers },
    { href: "/produtos", label: "Produtos", icon: FiBox },
    { href: "/negociacoes", label: "Negociações", icon: FiDollarSign },
    { href: "/configuracoes", label: "Configurações", icon: FiSettings },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Nome */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-white text-xl font-bold">
              Controle de Estoque
            </span>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${
                      pathname === item.href
                        ? "bg-blue-900 text-white"
                        : "text-white hover:bg-blue-700"
                    } px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200`}
                  >
                    <Icon className="mr-2" />
                    {item.label}
                  </Link>
                );
              })}

              {/* Botão de Logout Desktop */}
              <button
                onClick={handleLogout}
                className="text-white hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200"
              >
                <FiLogOut className="mr-2" />
                Sair
              </button>
            </div>
          </div>

          {/* Botão Menu Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
            >
              {isOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? "bg-blue-900 text-white"
                      : "text-white hover:bg-blue-700"
                  } block px-3 py-2 rounded-md text-base font-medium flex items-center transition-colors duration-200`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="mr-2" />
                  {item.label}
                </Link>
              );
            })}

            {/* Botão de Logout Mobile */}
            <button
              onClick={handleLogout}
              className="w-full text-left text-white hover:bg-red-600 block px-3 py-2 rounded-md text-base font-medium flex items-center transition-colors duration-200"
            >
              <FiLogOut className="mr-2" />
              Sair
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
