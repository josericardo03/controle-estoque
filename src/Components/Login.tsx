"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with:", { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center px-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <motion.div
        className="fixed top-10 left-10 w-40 h-40 bg-blue-500 opacity-10 rounded-full"
        initial={{ scale: 0, rotate: 0 }}
        animate={{
          scale: [0, 1.1, 1],
          rotate: [0, 360],
          transition: {
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          },
        }}
      />
      <motion.div
        className="fixed bottom-10 right-10 w-72 h-72 bg-blue-500 opacity-5 rounded-full"
        initial={{ scale: 0, rotate: 0 }}
        animate={{
          scale: [0, 1.05, 1],
          rotate: [0, -360],
          transition: {
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
          },
        }}
      />

      {/* Login Container */}
      <motion.div
        className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-blue-500/50 relative z-10 max-h-screen overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8 space-y-6">
          <div className="text-center mb-8">
            <motion.h2
              className="text-4xl font-bold text-blue-600 tracking-wider"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Controle Estoque
            </motion.h2>
            <p className="text-gray-600 mt-2">Faça login para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-blue-500 opacity-70" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-10 px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-blue-500 opacity-70" />
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="w-full pl-10 px-4 py-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <button
                type="submit"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2 group"
              >
                <FaSignInAlt className={`transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`} />
                <span>Entrar</span>
              </button>
            </motion.div>

            <motion.div className="mt-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <a href="#" className="text-blue-600 hover:text-blue-800 text-sm transition duration-300 hover:underline">
                Esqueceu sua senha?
              </a>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;