"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaTag, 
  FaBarcode, 
  FaUser, 
  FaSave 
} from "react-icons/fa";

// Componente Item
const Item: React.FC = () => {
  const [tipoItem, setTipoItem] = useState<'unitario' | 'varios'>('unitario');
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [custo, setCusto] = useState("");
  const [cor, setCor] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [codigoBarras, setCodigoBarras] = useState("");
  const [codigoFabricante, setCodigoFabricante] = useState("");
  const [vincularCliente, setVincularCliente] = useState(false);
  const [buscaCliente, setBuscaCliente] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState<string[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<string>("");
  const [mostrarClientes, setMostrarClientes] = useState(false); // Estado para controlar a exibição do dropdown

  // Simulação de dados (substituir por chamadas de API reais)
  useEffect(() => {
    // Simulação de clientes
    setClientesFiltrados(["João Silva", "Maria Souza", "Carlos Oliveira"]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Item Cadastrado:", {
      tipoItem,
      nome,
      valor,
      descricao,
      custo,
      cor,
      quantidade,
      codigoBarras,
      codigoFabricante,
      clienteSelecionado,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center p-6">
      {/* Background Elements */}
      <motion.div
        className="fixed top-0 left-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full pointer-events-none"
        initial={{ scale: 0, rotate: 0 }}
        animate={{
          scale: [0, 1.2, 1],
          rotate: [0, 360],
          transition: { duration: 10, repeat: Infinity, repeatType: "reverse" },
        }}
      />
      <motion.div
        className="fixed bottom-0 right-0 w-96 h-96 bg-blue-500 opacity-5 rounded-full pointer-events-none"
        initial={{ scale: 0, rotate: 0 }}
        animate={{
          scale: [0, 1.1, 1],
          rotate: [0, -360],
          transition: { duration: 12, repeat: Infinity, repeatType: "reverse" },
        }}
      />

      {/* Item Registration Container */}
      <motion.div
        className="w-full max-w-3xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-blue-500/50 relative z-10 p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-6">
          <motion.h2
            className="text-4xl font-bold text-blue-600 tracking-wider text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Cadastro de Itens
          </motion.h2>

          {/* Seleção de Tipo de Item */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setTipoItem('unitario')}
              className={`px-4 py-2 rounded-lg transition duration-300 ${tipoItem === 'unitario' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white'}`}
            >
              Item Unitário
            </button>
            <button
              onClick={() => setTipoItem('varios')}
              className={`px-4 py-2 rounded-lg transition duration-300 ${tipoItem === 'varios' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white'}`}
            >
              Vários Itens
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            {/* Nome */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-blue-600 mb-2">
                <FaTag className="mr-2 text-blue-500 inline-block" /> Nome
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome do item"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </motion.div>

            {/* Valor */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label className="block text-blue-600 mb-2">
                <FaTag className="mr-2 text-blue-500 inline-block" /> Valor
              </label>
              <input
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Digite o valor do item"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </motion.div>

            {/* Descrição */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <label className="block text-blue-600 mb-2">
                <FaTag className="mr-2 text-blue-500 inline-block" /> Descrição
              </label>
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Digite a descrição do item"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>

            {/* Custo */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <label className="block text-blue-600 mb-2">
                <FaTag className="mr-2 text-blue-500 inline-block" /> Custo
              </label>
              <input
                type="number"
                value={custo}
                onChange={(e) => setCusto(e.target.value)}
                placeholder="Digite o custo do item"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </motion.div>

            {/* Cor */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
              <label className="block text-blue-600 mb-2">
                <FaTag className="mr-2 text-blue-500 inline-block" /> Cor
              </label>
              <select
                value={cor}
                onChange={(e) => setCor(e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione a Cor</option>
                <option value="vermelho">Vermelho</option>
                <option value="azul">Azul</option>
                <option value="verde">Verde</option>
              </select>
            </motion.div>

            {/* Quantidade */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
              <label className="block text-blue-600 mb-2">
                <FaTag className="mr-2 text-blue-500 inline-block" /> Quantidade
              </label>
              <input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                placeholder="Digite a quantidade"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </motion.div>

            {/* Código de Barras */}
            {tipoItem === 'unitario' && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <label className="block text-blue-600 mb-2">
                  <FaBarcode className="mr-2 text-blue-500 inline-block" /> Código de Barras
                </label>
                <input
                  type="text"
                  value={codigoBarras}
                  onChange={(e) => setCodigoBarras(e.target.value)}
                  placeholder="Digite o código de barras"
                  className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>
            )}

            {/* Código Fabricante */}
            {tipoItem === 'unitario' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <label className="block text-blue-600 mb-2">
                  <FaUser className="mr-2 text-blue-500 inline-block" /> Código Fabricante
                </label>
                <input
                  type="text"
                  value={codigoFabricante}
                  onChange={(e) => setCodigoFabricante(e.target.value)}
                  placeholder="Digite o código do fabricante"
                  className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>
            )}

            {/* Vincular Cliente (apenas para Item Unitário) */}
            {tipoItem === 'unitario' && (
              <motion.div className="col-span-2 flex items-center mt-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
                <input
                  type="checkbox"
                  checked={vincularCliente}
                  onChange={() => setVincularCliente(!vincularCliente)}
                  className="mr-2"
                />
                <label className="text-blue-600">Vincular esse produto a um cliente?</label>
              </motion.div>
            )}

            {/* Campo de Busca de Cliente (apenas para Item Unitário) */}
            {tipoItem === 'unitario' && vincularCliente && (
              <motion.div className="col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <label className="block text-blue-600 mb-2">
                  <FaUser className="mr-2 text-blue-500 inline-block" /> Buscar Cliente
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={buscaCliente}
                    onChange={(e) => setBuscaCliente(e.target.value)}
                    placeholder="Digite o nome do cliente"
                    className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarClientes(!mostrarClientes)} // Alterna a exibição do dropdown
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white rounded-lg px-2"
                  >
                    {mostrarClientes ? "Ocultar" : "Mostrar"}
                  </button>
                  {mostrarClientes && clientesFiltrados.length > 0 && (
                    <ul className="border border-blue-200 rounded-lg mt-1 max-h-40 overflow-y-auto absolute z-10 bg-white">
                      {clientesFiltrados.map(cliente => (
                        <li
                          key={cliente}
                          onClick={() => {
                            setClienteSelecionado(cliente);
                            setBuscaCliente(cliente);
                            setClientesFiltrados([]);
                            setMostrarClientes(false); // Ocultar opções após selecionar
                          }}
                          className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                        >
                          {cliente}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div className="col-span-2 flex justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
              <button
                type="submit"
                className="w-full max-w-md py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
              >
                <FaSave className="mr-2" />
                Cadastrar Item
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Item;