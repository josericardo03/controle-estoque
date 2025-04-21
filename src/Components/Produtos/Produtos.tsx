"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaBox,
  FaBarcode,
  FaPalette,
  FaTags,
  FaSave,
  FaUser,
  FaTag,
  FaDollarSign,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const unidadeOptions = ["UN", "KG", "LT", "MT", "CX", "PC"];

const categoriaOptions = [
  "Alimentos",
  "Bebidas",
  "Eletrônicos",
  "Vestuário",
  "Informática",
  "Outros",
];

const Produtos: React.FC = () => {
  const [nome, setNome] = useState("");
  const [unidade, setUnidade] = useState("");
  const [codigo, setCodigo] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidadeEstoque, setQuantidadeEstoque] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validações básicas
    if (!nome || !descricao || !preco || !codigo) {
      toast.error("Preencha todos os campos obrigatórios");
      setLoading(false);
      return;
    }

    const produto = {
      nome,
      descricao,
      preco: Number(preco),
      codigo,
      quantidadeEstoque: quantidadeEstoque ? Number(quantidadeEstoque) : 0,
      unidadeMedida: unidade || "UN",
      ...(categoriaId && { categoria: { id: categoriaId } }),
    };

    try {
      const response = await fetch("http://localhost:8080/api/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar produto");
      }

      const data = await response.json();
      console.log("Produto cadastrado:", data);
      toast.success("Produto cadastrado com sucesso!");

      // Limpar formulário
      setNome("");
      setDescricao("");
      setPreco("");
      setQuantidadeEstoque("");
      setCodigo("");
      setUnidade("");
      setCategoriaId("");
    } catch (error: any) {
      console.error("Erro:", error);
      toast.error(error.message || "Erro ao cadastrar produto");
    } finally {
      setLoading(false);
    }
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
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-blue-600 mb-2">
                <FaTag className="mr-2 text-blue-500 inline-block" /> Nome do
                Produto
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome do produto"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
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

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-blue-600 mb-2">
                <FaBarcode className="mr-2 text-blue-500 inline-block" /> Código
              </label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Digite o código do produto"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-blue-600 mb-2">
                <FaDollarSign className="mr-2 text-blue-500 inline-block" />{" "}
                Preço
              </label>
              <input
                type="number"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="Digite o preço"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-blue-600 mb-2">
                <FaBox className="mr-2 text-blue-500 inline-block" /> Quantidade
                em Estoque
              </label>
              <input
                type="number"
                value={quantidadeEstoque}
                onChange={(e) => setQuantidadeEstoque(e.target.value)}
                placeholder="Digite a quantidade"
                min="0"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-blue-600 mb-2">
                <FaTags className="mr-2 text-blue-500 inline-block" /> Categoria
                (Opcional)
              </label>
              <select
                value={categoriaId}
                onChange={(e) =>
                  setCategoriaId(e.target.value ? Number(e.target.value) : "")
                }
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma Categoria</option>
                {categoriaOptions.map((cat, index) => (
                  <option key={index + 1} value={index + 1}>
                    {cat}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="col-span-2"
            >
              <label className="block text-blue-600 mb-2">
                <FaTag className="mr-2 text-blue-500 inline-block" /> Descrição
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Digite a descrição do produto"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                required
              />
            </motion.div>

            <motion.div
              className="col-span-2 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <button
                type="submit"
                disabled={loading}
                className={`w-full max-w-md py-3 bg-blue-600 text-white font-bold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center ${
                  loading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
              >
                <FaSave className="mr-2" />
                {loading ? "Cadastrando..." : "Cadastrar Produto"}
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Produtos;
