"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FaIdCard, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendar, 
  FaCheckCircle, 
  FaSave, 
  FaBuilding,
  FaTag
} from "react-icons/fa";

// Dropdown options
const naturezaOptions = [
  "Física",
  "Jurídica"
];

const statusOptions = [
  "Ativo",
  "Inativo"
];

const tipoClienteOptions = [
  "Cliente",
  "Fornecedor", 
  "Fabricante", 
  "Transportadora"
];

const Clientes: React.FC = () => {
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [nomeNomeFantasia, setNomeNomeFantasia] = useState("");
  const [natureza, setNatureza] = useState("");
  const [rgIe, setRgIe] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [telefonePrincipal, setTelefonePrincipal] = useState("");
  const [tipoCliente, setTipoCliente] = useState("");
  const [observacao, setObservacao] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Cliente Cadastrado:", { 
      cpfCnpj,
      nomeNomeFantasia,
      natureza,
      rgIe,
      dataNascimento,
      status,
      email,
      telefonePrincipal,
      tipoCliente,
      observacao
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

      {/* Client Registration Container */}
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
            Cadastro de Clientes
          </motion.h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            {/* CPF/CNPJ */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-blue-600 mb-2">
                <FaIdCard className="mr-2 text-blue-500 inline-block" /> CPF/CNPJ
              </label>
              <input
                type="text"
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(e.target.value)}
                placeholder="Digite CPF ou CNPJ"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </motion.div>

            {/* Nome/Nome Fantasia */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label className="block text-blue-600 mb-2">
                <FaUser className="mr-2 text-blue-500 inline-block" /> Nome/Nome Fantasia
              </label>
              <input
                type="text"
                value={nomeNomeFantasia}
                onChange={(e) => setNomeNomeFantasia(e.target.value)}
                placeholder="Digite nome completo ou nome fantasia"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </motion.div>

            {/* Natureza */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <label className="block text-blue-600 mb-2">
                <FaBuilding className="mr-2 text-blue-500 inline-block" /> Natureza
              </label>
              <select
                value={natureza}
                onChange={(e) => setNatureza(e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione a Natureza</option>
                {naturezaOptions.map((nat) => (
                  <option key={nat} value={nat}>
                    {nat}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* RG/IE */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <label className="block text-blue-600 mb-2">
                <FaIdCard className="mr-2 text-blue-500 inline-block" /> RG/IE
              </label>
              <input
                type="text"
                value={rgIe}
                onChange={(e) => setRgIe(e.target.value)}
                placeholder="Digite RG ou Inscrição Estadual"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>

            {/* Data Nascimento */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
              <label className="block text-blue-600 mb-2">
                <FaCalendar className="mr-2 text-blue-500 inline-block" /> Data Nascimento
              </label>
              <input
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>

            {/* Status */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
              <label className="block text-blue-600 mb-2">
                <FaCheckCircle className="mr-2 text-blue-500 inline-block" /> Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione o Status</option>
                {statusOptions.map((stat) => (
                  <option key={stat} value={stat}>
                    {stat}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Email */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
              <label className="block text-blue-600 mb-2">
                <FaEnvelope className="mr-2 text-blue-500 inline-block" /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite o email"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>

            {/* Telefone Principal */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }}>
              <label className="block text-blue-600 mb-2">
                <FaPhone className="mr-2 text-blue-500 inline-block" /> Telefone Principal
              </label>
              <input
                type="tel"
                value={telefonePrincipal}
                onChange={(e) => setTelefonePrincipal(e.target.value)}
                placeholder="Digite o telefone principal"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>

            {/* Tipo Cliente */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }}>
              <label className="block text-blue-600 mb-2">
                <FaTag className="mr-2 text-blue-500 inline-block" /> Tipo de Cliente
              </label>
              <select
                value={tipoCliente}
                onChange={(e) => setTipoCliente(e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione o Tipo</option>
                {tipoClienteOptions.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Observação */}
            <motion.div className="col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
              <label className="block text-blue-600 mb-2">
                <FaTag className="mr-2 text-blue-500 inline-block" /> Observação
              </label>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Informações adicionais"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div className="col-span-2 flex justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
              <button
                type="submit"
                className="w-full max-w-md py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
              >
                <FaSave className="mr-2" />
                Cadastrar Cliente
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Clientes;