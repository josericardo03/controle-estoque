

"use client";

import { useState } from "react";
import { 
  FaBox, 
  FaUsers, 
  FaSignOutAlt, 
  FaChevronLeft, 
  FaChevronRight,
  FaMoneyBillWave,
  FaShoppingCart
} from "react-icons/fa";

// Import components
import Clientes from "@/Components/Clientes/Clientes";
import ContasPagar from "@/Components/Pagar/ContasPagar";
import Produtos from "@/Components/Produtos/Produtos";
import Caixa from "@/Components/Caixa/Caixa";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeRoute, setActiveRoute] = useState('clientes');
  const [isCaixaDropdownOpen, setIsCaixaDropdownOpen] = useState(false);

  const userName = "João Silva";
  const userInitial = userName.charAt(0).toUpperCase();

  const menuItems = [
    { 
      name: 'Caixa', 
      icon: FaShoppingCart, 
      route: 'caixa',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Caixa 1', route: 'caixa1' },
        { name: 'Caixa 2', route: 'caixa2' }
      ]
    },
    { name: 'Clientes', icon: FaUsers, route: 'clientes' },
    { name: 'Contas a Pagar', icon: FaMoneyBillWave, route: 'contaspagar' },
    { name: 'Produtos', icon: FaBox, route: 'produtos' },
  ];

  const handleRouteClick = (route: string) => {
    setActiveRoute(route);
    if (route === 'caixa') {
      setIsCaixaDropdownOpen(!isCaixaDropdownOpen);
    }
  };

  // Render active component based on route
  const renderActiveComponent = () => {
    switch (activeRoute) {
      case 'clientes':
        return <Clientes />;
      case 'contaspagar':
        return <ContasPagar />;
      case 'produtos':
        return <Produtos />;
      case 'caixa':
      case 'caixa1':
      case 'caixa2':
        return <Caixa />;
      default:
        return <Clientes />;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`h-screen bg-white fixed left-0 top-0 text-blue-600 transition-all duration-300 
        ${isCollapsed ? "w-20" : "w-64"} border-r border-blue-200 z-10 shadow-lg`}
      >
        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-8 bg-blue-500 text-white rounded-full p-1.5 hover:bg-blue-600 transition-colors"
        >
          {isCollapsed ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
        </button>

        {/* User Info */}
        <div className="h-24 flex items-center justify-center border-b border-blue-200 p-4">
          <div className="flex items-center space-x-3">
            {/* Google-style Avatar */}
            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl">
              {userInitial}
            </div>
            
            {!isCollapsed && (
              <div>
                <h3 className="text-lg font-bold text-blue-800">{userName}</h3>
                <p className="text-sm text-blue-500">Administrador</p>
              </div>
            )}
          </div>
        </div>

        {/* Rest of the code remains the same */}
        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.route}>
                <div 
                  onClick={() => handleRouteClick(item.route)}
                  className={`
                    flex items-center justify-between p-3 rounded-lg cursor-pointer
                    transition-colors 
                    ${activeRoute === item.route ? 'bg-blue-100' : 'hover:bg-blue-50'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="text-blue-500" size={20} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </div>
                  
                  {/* Dropdown for Caixa */}
                  {item.route === 'caixa' && !isCollapsed && item.hasDropdown && (
                    <span 
                      className={`transform transition-transform ${
                        isCaixaDropdownOpen ? 'rotate-180' : ''
                      }`}
                    >
                      {isCaixaDropdownOpen ? '▲' : '▼'}
                    </span>
                  )}
                </div>

                {/* Caixa Dropdown */}
                {item.route === 'caixa' && !isCollapsed && isCaixaDropdownOpen && (
                  <ul className="ml-8 space-y-2 mt-2">
                    {item.dropdownItems?.map((subItem) => (
                      <li 
                        key={subItem.route}
                        className={`
                          p-2 rounded-lg cursor-pointer
                          ${activeRoute === subItem.route ? 'bg-blue-100' : 'hover:bg-blue-50'}
                        `}
                        onClick={() => setActiveRoute(subItem.route)}
                      >
                        {subItem.name}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-200">
          <button 
            className="w-full flex items-center justify-center gap-3 p-3 
            bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaSignOutAlt />
            {!isCollapsed && 'Sair'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div 
        className={`
          transition-all duration-300 
          ${isCollapsed ? 'ml-20' : 'ml-64'} 
          flex-grow bg-blue-50 h-screen overflow-auto
        `}
      >
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default Sidebar;