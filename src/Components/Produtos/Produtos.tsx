"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBox, FaBarcode, FaPalette, FaTags, FaSave } from "react-icons/fa";

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
  const [descricao, setDescricao] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Produto Cadastrado:", { tipoProduto, unidade, codigoBarras, categoria, cor, descricao });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-900 flex items-center justify-center p-6">
      {/* Background Elements - Adjusted for Scrolling Issues */}
      <motion.div
        className="fixed top-0 left-0 w-64 h-64 bg-yellow-500 opacity-10 rounded-full pointer-events-none"
        initial={{ scale: 0, rotate: 0 }}
        animate={{
          scale: [0, 1.2, 1],
          rotate: [0, 360],
          transition: { duration: 10, repeat: Infinity, repeatType: "reverse" },
        }}
      />
      <motion.div
        className="fixed bottom-0 right-0 w-96 h-96 bg-yellow-500 opacity-5 rounded-full pointer-events-none"
        initial={{ scale: 0, rotate: 0 }}
        animate={{
          scale: [0, 1.1, 1],
          rotate: [0, -360],
          transition: { duration: 12, repeat: Infinity, repeatType: "reverse" },
        }}
      />

      {/* Product Registration Container */}
      <motion.div
        className="w-full max-w-2xl bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-yellow-500/50 relative z-10 p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-6">
          <motion.h2
            className="text-4xl font-bold text-yellow-400 tracking-wider text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Cadastro de Produtos
          </motion.h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-yellow-400 mb-2">
                <FaBox className="mr-2 text-yellow-500" /> Tipo de Produto
              </label>
              <select
                value={tipoProduto}
                onChange={(e) => setTipoProduto(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/60 text-yellow-400 border border-yellow-600/30 rounded-lg"
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
              <label className="block text-yellow-400 mb-2">
                <FaBox className="mr-2 text-yellow-500" /> Unidade
              </label>
              <select
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/60 text-yellow-400 border border-yellow-600/30 rounded-lg"
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
              <label className="block text-yellow-400 mb-2">
                <FaBarcode className="mr-2 text-yellow-500" /> Código de Barras
              </label>
              <input
                type="text"
                value={codigoBarras}
                onChange={(e) => setCodigoBarras(e.target.value)}
                placeholder="Digite o código de barras"
                className="w-full px-4 py-3 bg-gray-800/60 text-yellow-400 border border-yellow-600/30 rounded-lg"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <label className="block text-yellow-400 mb-2">
                <FaTags className="mr-2 text-yellow-500" /> Categoria
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/60 text-yellow-400 border border-yellow-600/30 rounded-lg"
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

            <motion.div className="col-span-2 flex justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
              <button
                type="submit"
                className="w-full max-w-md py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
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
