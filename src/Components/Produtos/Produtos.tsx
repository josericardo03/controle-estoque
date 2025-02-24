"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBox, FaBarcode, FaPalette, FaTags, FaSave, FaUser, FaTag } from "react-icons/fa";

// Dropdown options
const tipoProdutoOptions = [
  "Matéria-Prima",
  "Produto Acabado",
  "Embalagem",
  "Equipamento",
  "Outros",
];

const unidadeOptions = ["Unidade (UN)", "Quilograma (KG)", "Litro (LT)", "Metro (MT)", "Caixa (CX)", "Pacote (PC)"];

const categoriaOptions = ["Alimentos", "Bebidas", "Eletrônicos", "Vestuário", "Informática", "Outros"];

const Produtos: React.FC = () => {
  const [tipoProduto, setTipoProduto] = useState("");
  const [unidade, setUnidade] = useState("");
  const [codigoBarras, setCodigoBarras] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cor, setCor] = useState("");
  const [cliente, setCliente] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Produto Cadastrado:", { 
      tipoProduto, 
      unidade, 
      codigoBarras, 
      categoria, 
      cor, 
      cliente, 
      descricao 
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

      {/* Product Registration Container */}
      <motion.div
        className="w-full max-w-2xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-blue-500/50 relative z-10 p-8"
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
            Cadastro de Produtos
          </motion.h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-blue-600 mb-2">
                <FaBox className="mr-2 text-blue-500 inline-block" /> Tipo de Produto
              </label>
              <select
                value={tipoProduto}
                onChange={(e) => setTipoProduto(e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione o Tipo</option>
                {tipoProdutoOptions.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label className="block text-blue-600 mb-2">
                <FaBox className="mr-2 text-blue-500 inline-block" /> Unidade
              </label>
              <select
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione a Unidade</option>
                {unidadeOptions.map((un) => (
                  <option key={un} value={un}>
                    {un}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
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

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <label className="block text-blue-600 mb-2">
                <FaTags className="mr-2 text-blue-500 inline-block" /> Categoria
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione a Categoria</option>
                {categoriaOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Novos campos: Cor e Cliente */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
              <label className="block text-blue-600 mb-2">
                <FaPalette className="mr-2 text-blue-500 inline-block" /> Cor
              </label>
              <input
                type="text"
                value={cor}
                onChange={(e) => setCor(e.target.value)}
                placeholder="Digite a cor do produto"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
              <label className="block text-blue-600 mb-2">
                <FaUser className="mr-2 text-blue-500 inline-block" /> Cliente
              </label>
              <input
                type="text"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Nome do cliente"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>

            <motion.div className="col-span-2 flex justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
              <button
                type="submit"
                className="w-full max-w-md py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
              >
                <FaSave className="mr-2" />
                Cadastrar Produto
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Produtos;