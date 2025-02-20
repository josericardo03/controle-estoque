"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Package,
  BarChart2,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Box,
} from "lucide-react";
import DynamicNavbar from "./DynamicNavbar";

// Definição do tipo NavSection
type NavSection = 'inventory' | 'reports' | 'users' | 'settings';

const Sidebar = () => {
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSection | null>(null);

  const handleSectionClick = (section: NavSection) => {
    // Se a seção clicada for a mesma que já está ativa, desativa
    setActiveSection(activeSection === section ? null : section);
    
    // Para o inventário, também controla o dropdown
    if (section === 'inventory') {
      setIsInventoryOpen(!isInventoryOpen);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`h-screen bg-neutral-800 fixed left-0 top-0 text-yellow-400 transition-all duration-300 
        ${isCollapsed ? "w-20" : "w-64"} border-r border-yellow-400/20 z-10`}
      >
        {/* Botão de Colapso */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-8 bg-black border border-yellow-400 rounded-full p-1.5 hover:bg-yellow-400 hover:text-black transition-colors"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Área do Logo */}
        <div className="h-20 flex items-center justify-center border-b border-yellow-400/20">
          <div
            className={`transition-all duration-300 ${
              isCollapsed ? "text-2xl" : "text-2xl font-bold"
            }`}
          >
            {isCollapsed ? <Box size={28} /> : "LOGO"}
          </div>
        </div>

        {/* Menu de Navegação */}
        <nav className="p-4">
          <ul className="space-y-4">
            {/* Item de Inventário */}
            <li>
              <button
                onClick={() => handleSectionClick('inventory')}
                className={`w-full flex items-center justify-between p-2.5 hover:bg-yellow-400/10 rounded-lg transition-colors
                ${activeSection === 'inventory' && !isCollapsed ? "bg-yellow-400/10" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <Package size={20} className="min-w-[20px]" />
                  {!isCollapsed && <span>Inventário</span>}
                </div>
                {!isCollapsed && (
                  <ChevronDown
                    size={18}
                    className={`transform transition-transform ${
                      isInventoryOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Submenu do Dropdown */}
              {isInventoryOpen && !isCollapsed && (
                <ul className="mt-2 ml-7 space-y-2">
                  <li>
                    <Link
                      href="/produtos"
                      className="flex items-center gap-2 p-2 hover:bg-yellow-400/10 rounded-lg transition-colors text-yellow-400/80 hover:text-yellow-400"
                    >
                      Produtos
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categorias"
                      className="flex items-center gap-2 p-2 hover:bg-yellow-400/10 rounded-lg transition-colors text-yellow-400/80 hover:text-yellow-400"
                    >
                      Categorias
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Outros itens do menu */}
            <li>
              <button
                onClick={() => handleSectionClick('reports')}
                className="w-full flex items-center gap-3 p-2.5 hover:bg-yellow-400/10 rounded-lg transition-colors"
              >
                <BarChart2 size={20} className="min-w-[20px]" />
                {!isCollapsed && <span>Relatórios</span>}
              </button>
            </li>

            <li>
              <button
                onClick={() => handleSectionClick('users')}
                className="w-full flex items-center gap-3 p-2.5 hover:bg-yellow-400/10 rounded-lg transition-colors"
              >
                <Users size={20} className="min-w-[20px]" />
                {!isCollapsed && <span>Usuários</span>}
              </button>
            </li>

            <li>
              <button
                onClick={() => handleSectionClick('settings')}
                className="w-full flex items-center gap-3 p-2.5 hover:bg-yellow-400/10 rounded-lg transition-colors"
              >
                <Settings size={20} className="min-w-[20px]" />
                {!isCollapsed && <span>Configurações</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Dynamic Navbar */}
      {activeSection && (
        <div className={`fixed top-0 right-0 transition-all duration-300 
          ${isCollapsed ? "left-20" : "left-64"}`}>
          <DynamicNavbar 
            activeSection={activeSection} 
            isCollapsed={isCollapsed} 
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;