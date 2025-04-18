"use client";
import React, { useState, useEffect } from "react";
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
  FaTag,
  FaMapMarkerAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

// Dropdown options
const naturezaOptions = ["Física", "Jurídica"];

const statusOptions = ["Ativo", "Inativo"];

const tipoClienteOptions = [
  "Cliente",
  "Fornecedor",
  "Fabricante",
  "Transportadora",
];

const Clientes: React.FC = () => {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cep, setCep] = useState("");
  const [limiteCredito, setLimiteCredito] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [inscricaoEstadual, setInscricaoEstadual] = useState("");

  // Estados para validação
  const [erroCpf, setErroCpf] = useState("");
  const [erroCnpj, setErroCnpj] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroTelefone, setErroTelefone] = useState("");

  const [estados, setEstados] = useState<
    Array<{ id: number; sigla: string; nome: string }>
  >([]);
  const [cidades, setCidades] = useState<Array<{ id: number; nome: string }>>(
    []
  );

  // Carregar estados ao montar o componente
  useEffect(() => {
    const carregarEstados = async () => {
      try {
        const response = await fetch(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
        );
        const data = await response.json();
        setEstados(data.sort((a: any, b: any) => a.nome.localeCompare(b.nome)));
      } catch (error) {
        console.error("Erro ao carregar estados:", error);
      }
    };

    carregarEstados();
  }, []);

  // Carregar cidades quando o estado for selecionado
  useEffect(() => {
    const carregarCidades = async () => {
      if (estado) {
        try {
          const response = await fetch(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`
          );
          const data = await response.json();
          setCidades(
            data.sort((a: any, b: any) => a.nome.localeCompare(b.nome))
          );
        } catch (error) {
          console.error("Erro ao carregar cidades:", error);
        }
      } else {
        setCidades([]);
      }
    };

    carregarCidades();
  }, [estado]);

  // Função para formatar o telefone
  const formatarTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      if (numbers.length <= 2) {
        return numbers;
      }
      if (numbers.length <= 6) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      }
      if (numbers.length <= 10) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(
          6
        )}`;
      }
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7,
        11
      )}`;
    }
    return value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (tipo === "Cliente" && !cpf) {
      setErroCpf("CPF é obrigatório para clientes");
      return;
    }

    if (tipo === "Fornecedor" && !cnpj) {
      setErroCnpj("CNPJ é obrigatório para fornecedores");
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErroEmail("Email inválido");
      return;
    }

    // Validação de telefone - agora aceita apenas números
    const telefoneRegex = /^\d{10,11}$/;
    if (!telefoneRegex.test(telefone.replace(/\D/g, ""))) {
      setErroTelefone("Telefone inválido. Digite 10 ou 11 dígitos.");
      return;
    }

    try {
      const clienteData = {
        nome,
        tipo,
        cpf,
        cnpj,
        dataNascimento,
        telefone: telefone.replace(/\D/g, ""), // Envia apenas os números para o backend
        email,
        endereco: {
          estado,
          cidade,
          logradouro,
          numero,
          complemento,
          bairro,
          cep,
        },
        limiteCredito,
        razaoSocial,
        inscricaoEstadual,
      };

      const response = await fetch("http://localhost:8080/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clienteData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar cliente");
      }

      const data = await response.json();
      alert("Cliente cadastrado com sucesso!");

      // Limpar o formulário
      setNome("");
      setTipo("");
      setCpf("");
      setCnpj("");
      setDataNascimento("");
      setTelefone("");
      setEmail("");
      setEstado("");
      setCidade("");
      setLogradouro("");
      setNumero("");
      setComplemento("");
      setBairro("");
      setCep("");
      setLimiteCredito("");
      setRazaoSocial("");
      setInscricaoEstadual("");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao cadastrar cliente. Tente novamente.");
    }
  };

  // Função para buscar CEP
  const buscarCep = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setLogradouro(data.logradouro);
        setBairro(data.bairro);
        setCidade(data.localidade);
        setEstado(data.uf);
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
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

      {/* Client Registration Container */}
      <motion.div
        className="w-full max-w-4xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-blue-500/50 relative z-10 p-8"
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
            {/* Nome */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-blue-600 mb-2">
                <FaUser className="mr-2 text-blue-500 inline-block" /> Nome
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome completo"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </motion.div>

            {/* Tipo */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-blue-600 mb-2">
                <FaTag className="mr-2 text-blue-500 inline-block" /> Tipo
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione o Tipo</option>
                <option value="Cliente">Cliente</option>
                <option value="Fornecedor">Fornecedor</option>
              </select>
            </motion.div>

            {/* CPF (apenas para Cliente) */}
            {tipo === "Cliente" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-blue-600 mb-2">
                  <FaIdCard className="mr-2 text-blue-500 inline-block" /> CPF
                </label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="Digite o CPF"
                  className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {erroCpf && (
                  <p className="text-red-500 text-sm mt-1">{erroCpf}</p>
                )}
              </motion.div>
            )}

            {/* CNPJ (apenas para Fornecedor) */}
            {tipo === "Fornecedor" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-blue-600 mb-2">
                  <FaIdCard className="mr-2 text-blue-500 inline-block" /> CNPJ
                </label>
                <input
                  type="text"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="Digite o CNPJ"
                  className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {erroCnpj && (
                  <p className="text-red-500 text-sm mt-1">{erroCnpj}</p>
                )}
              </motion.div>
            )}

            {/* Data de Nascimento */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-blue-600 mb-2">
                <FaCalendar className="mr-2 text-blue-500 inline-block" /> Data
                de Nascimento
              </label>
              <input
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>

            {/* Telefone */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label className="block text-blue-600 mb-2">
                <FaPhone className="mr-2 text-blue-500 inline-block" /> Telefone
              </label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                placeholder="Digite o telefone"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {erroTelefone && (
                <p className="text-red-500 text-sm mt-1">{erroTelefone}</p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <label className="block text-blue-600 mb-2">
                <FaEnvelope className="mr-2 text-blue-500 inline-block" /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite o email"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {erroEmail && (
                <p className="text-red-500 text-sm mt-1">{erroEmail}</p>
              )}
            </motion.div>

            {/* CEP */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <label className="block text-blue-600 mb-2">
                <FaMapMarkerAlt className="mr-2 text-blue-500 inline-block" />{" "}
                CEP
              </label>
              <input
                type="text"
                value={cep}
                onChange={(e) => {
                  setCep(e.target.value);
                  if (e.target.value.length === 8) {
                    buscarCep(e.target.value);
                  }
                }}
                placeholder="Digite o CEP"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </motion.div>

            {/* Estado */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <label className="block text-blue-600 mb-2">
                <FaMapMarkerAlt className="mr-2 text-blue-500 inline-block" />{" "}
                Estado
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione o Estado</option>
                {estados.map((estado) => (
                  <option key={estado.id} value={estado.sigla}>
                    {estado.nome}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Cidade */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
            >
              <label className="block text-blue-600 mb-2">
                <FaMapMarkerAlt className="mr-2 text-blue-500 inline-block" />{" "}
                Cidade
              </label>
              <select
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!estado}
              >
                <option value="">Selecione a Cidade</option>
                {cidades.map((cidade) => (
                  <option key={cidade.id} value={cidade.nome}>
                    {cidade.nome}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Logradouro */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 }}
            >
              <label className="block text-blue-600 mb-2">
                <FaMapMarkerAlt className="mr-2 text-blue-500 inline-block" />{" "}
                Logradouro
              </label>
              <input
                type="text"
                value={logradouro}
                onChange={(e) => setLogradouro(e.target.value)}
                placeholder="Digite o logradouro"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </motion.div>

            {/* Número */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
            >
              <label className="block text-blue-600 mb-2">
                <FaMapMarkerAlt className="mr-2 text-blue-500 inline-block" />{" "}
                Número
              </label>
              <input
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Digite o número"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </motion.div>

            {/* Complemento */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 }}
            >
              <label className="block text-blue-600 mb-2">
                <FaMapMarkerAlt className="mr-2 text-blue-500 inline-block" />{" "}
                Complemento
              </label>
              <input
                type="text"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                placeholder="Digite o complemento"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>

            {/* Bairro */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6 }}
            >
              <label className="block text-blue-600 mb-2">
                <FaMapMarkerAlt className="mr-2 text-blue-500 inline-block" />{" "}
                Bairro
              </label>
              <input
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Digite o bairro"
                className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </motion.div>

            {/* Limite de Crédito (apenas para Cliente) */}
            {tipo === "Cliente" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.7 }}
              >
                <label className="block text-blue-600 mb-2">
                  <FaMoneyBillWave className="mr-2 text-blue-500 inline-block" />{" "}
                  Limite de Crédito
                </label>
                <input
                  type="number"
                  value={limiteCredito}
                  onChange={(e) => setLimiteCredito(e.target.value)}
                  placeholder="Digite o limite de crédito"
                  className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>
            )}

            {/* Razão Social (apenas para Fornecedor) */}
            {tipo === "Fornecedor" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.8 }}
              >
                <label className="block text-blue-600 mb-2">
                  <FaBuilding className="mr-2 text-blue-500 inline-block" />{" "}
                  Razão Social
                </label>
                <input
                  type="text"
                  value={razaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                  placeholder="Digite a razão social"
                  className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </motion.div>
            )}

            {/* Inscrição Estadual (apenas para Fornecedor) */}
            {tipo === "Fornecedor" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.9 }}
              >
                <label className="block text-blue-600 mb-2">
                  <FaIdCard className="mr-2 text-blue-500 inline-block" />{" "}
                  Inscrição Estadual
                </label>
                <input
                  type="text"
                  value={inscricaoEstadual}
                  onChange={(e) => setInscricaoEstadual(e.target.value)}
                  placeholder="Digite a inscrição estadual"
                  className="w-full px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              className="col-span-2 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0 }}
            >
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
