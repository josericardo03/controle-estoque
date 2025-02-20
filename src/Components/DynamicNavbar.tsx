"use client";

import React, { useState } from 'react';
import { 
  Package, 
  BarChart2, 
  Users, 
  Settings,
  Plus,
  List,
  BarChart,
  TrendingUp
} from 'lucide-react';

// Define types for navbar sections
type NavSection = 'inventory' | 'reports' | 'users' | 'settings';

// Define component mapping
const componentMap = {
  inventory: InventoryComponent,
  reports: ReportsComponent,
  users: UsersComponent,
  settings: SettingsComponent
};

export default function DynamicNavbar({ 
  activeSection, 
  isCollapsed 
}: { 
  activeSection: NavSection, 
  isCollapsed: boolean 
}) {
  const [activeSubsection, setActiveSubsection] = useState<string | null>(null);

  const renderSubsections = () => {
    switch (activeSection) {
      case 'inventory':
        return (
          <div className="flex space-x-4 p-3 bg-neutral-800 border-b border-yellow-400/20">
            <button 
              onClick={() => setActiveSubsection('add')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 
              ${activeSubsection === 'add' 
                ? 'bg-yellow-400 text-black' 
                : 'text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300'}`}
            >
              <Plus size={18} />
              Adicionar Produto
            </button>
            <button 
              onClick={() => setActiveSubsection('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 
              ${activeSubsection === 'list' 
                ? 'bg-yellow-400 text-black' 
                : 'text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300'}`}
            >
              <List size={18} />
              Listar Produtos
            </button>
          </div>
        );
      case 'reports':
        return (
          <div className="flex space-x-4 p-3 bg-neutral-800  border-b border-yellow-400/20">
            <button 
              onClick={() => setActiveSubsection('stock')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 
              ${activeSubsection === 'stock' 
                ? 'bg-yellow-400 text-black' 
                : 'text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300'}`}
            >
              <BarChart size={18} />
              Relatório de Estoque
            </button>
            <button 
              onClick={() => setActiveSubsection('sales')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 
              ${activeSubsection === 'sales' 
                ? 'bg-yellow-400 text-black' 
                : 'text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300'}`}
            >
              <TrendingUp size={18} />
              Relatório de Vendas
            </button>
          </div>
        );
      case 'users':
        return (
          <div className="flex space-x-4 p-3 bg-neutral-800  border-b border-yellow-400/20">
            <button 
              onClick={() => setActiveSubsection('create')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 
              ${activeSubsection === 'create' 
                ? 'bg-yellow-400 text-black' 
                : 'text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300'}`}
            >
              <Plus size={18} />
              Criar Usuário
            </button>
            <button 
              onClick={() => setActiveSubsection('manage')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 
              ${activeSubsection === 'manage' 
                ? 'bg-yellow-400 text-black' 
                : 'text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300'}`}
            >
              <List size={18} />
              Gerenciar Usuários
            </button>
          </div>
        );
      case 'settings':
        return (
          <div className="flex space-x-4 p-3 bg-neutral-800  border-b border-yellow-400/20">
            <button 
              onClick={() => setActiveSubsection('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 
              ${activeSubsection === 'profile' 
                ? 'bg-yellow-400 text-black' 
                : 'text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300'}`}
            >
              <Users size={18} />
              Perfil
            </button>
            <button 
              onClick={() => setActiveSubsection('system')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 
              ${activeSubsection === 'system' 
                ? 'bg-yellow-400 text-black' 
                : 'text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300'}`}
            >
              <Settings size={18} />
              Configurações do Sistema
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const ActiveComponent = componentMap[activeSection];

  return (
    <div className="w-screen h-screen">
      {renderSubsections()}
      <div className="p-4 bg-black/90 text-yellow-400 h-[calc(100vh-60px)] overflow-auto">
        {activeSubsection ? (
          <ActiveComponent subsection={activeSubsection} />
        ) : (
          <div className="text-center text-yellow-400/70">
            Selecione uma subseção para visualizar detalhes
          </div>
        )}
      </div>
    </div>
  );
}

// Placeholder components
function InventoryComponent({ subsection }: { subsection: string }) {
  return (
    <div className="bg-black/90 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">
        Inventário - {subsection === 'add' ? 'Adicionar Produto' : 'Listar Produtos'}
      </h2>
      <div className="text-yellow-400/80">
        Conteúdo do componente de inventário para: {subsection}
      </div>
    </div>
  );
}

function ReportsComponent({ subsection }: { subsection: string }) {
  return (
    <div className="bg-black/90 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">
        Relatórios - {subsection === 'stock' ? 'Estoque' : 'Vendas'}
      </h2>
      <div className="text-yellow-400/80">
        Conteúdo do componente de relatórios para: {subsection}
      </div>
    </div>
  );
}

function UsersComponent({ subsection }: { subsection: string }) {
  return (
    <div className="bg-black/90 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">
        Usuários - {subsection === 'create' ? 'Criar Usuário' : 'Gerenciar Usuários'}
      </h2>
      <div className="text-yellow-400/80">
        Conteúdo do componente de usuários para: {subsection}
      </div>
    </div>
  );
}

function SettingsComponent({ subsection }: { subsection: string }) {
  return (
    <div className="bg-black/90 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">
        Configurações - {subsection === 'profile' ? 'Perfil' : 'Sistema'}
      </h2>
      <div className="text-yellow-400/80">
        Conteúdo do componente de configurações para: {subsection}
      </div>
    </div>
  );
}