"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FaFilter, 
  FaList, 
  FaCheck, 
  FaPlus, 
  FaPrint, 
  FaEdit, 
  FaCircle 
} from "react-icons/fa";

// Interface for Payment Entry
interface ContaPagar {
  id: number;
  dataAbertura: string;
  dataVencimento: string;
  ultimaParcela?: string;
  nomePessoa: string;
  descricao: string;
  valor: number;
  status: 'atrasado' | 'proximo' | 'normal';
  pago: boolean;
}

// Explicitly typed as React.FC
const ContasPagar: React.FC = () => {
  const [contasPagar, setContasPagar] = useState<ContaPagar[]>([
    {
      id: 1,
      dataAbertura: '2024-02-15',
      dataVencimento: '2024-03-10',
      nomePessoa: 'Fornecedor A',
      descricao: 'Compra de Matéria-Prima',
      valor: 5000.00,
      status: 'proximo',
      pago: false
    },
    {
      id: 2,
      dataAbertura: '2024-01-20',
      dataVencimento: '2024-02-05',
      nomePessoa: 'Fornecedor B',
      descricao: 'Equipamentos',
      valor: 3500.50,
      status: 'atrasado',
      pago: false
    }
  ]);

  // Calcular totais
  const calcularTotais = () => {
    const naoPagas = contasPagar.filter(conta => !conta.pago);
    const valorDevedor = naoPagas.reduce((total, conta) => total + conta.valor, 0);
    const valorVencer = naoPagas.filter(conta => 
      new Date(conta.dataVencimento) > new Date()
    ).reduce((total, conta) => total + conta.valor, 0);
    const valorPago = contasPagar.filter(conta => conta.pago)
      .reduce((total, conta) => total + conta.valor, 0);

    return { valorDevedor, valorVencer, valorPago };
  };

  const totais = calcularTotais();

  const getStatusColor = (status: 'atrasado' | 'proximo' | 'normal') => {
    switch(status) {
      case 'atrasado': return 'bg-red-500';
      case 'proximo': return 'bg-yellow-500';
      default: return 'bg-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex flex-col items-center justify-center p-6">
      <motion.div
        className="w-full max-w-6xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-blue-500/50 relative z-10 p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Cabeçalho e Opções */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-blue-600 tracking-wider">
            Contas a Pagar
          </h2>
          <div className="flex space-x-4">
            <button className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition">
              <FaFilter />
            </button>
            <button className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition">
              <FaList />
            </button>
            <button className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition">
              <FaCheck />
            </button>
            <button className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition">
              <FaPlus />
            </button>
            <button className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition">
              <FaPrint />
            </button>
          </div>
        </div>

        {/* Tabela de Contas */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-blue-900">
            <thead className="bg-blue-100 text-blue-600 uppercase">
              <tr>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Data Abertura</th>
                <th className="px-4 py-3">Data Vencimento</th>
                <th className="px-4 py-3">Última Parcela</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Descrição</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {contasPagar.map((conta) => (
                <tr key={conta.id} className="border-b border-blue-200 hover:bg-blue-50">
                  <td className="px-4 py-3">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(conta.status)}`}></div>
                  </td>
                  <td className="px-4 py-3">{conta.dataAbertura}</td>
                  <td className="px-4 py-3">{conta.dataVencimento}</td>
                  <td className="px-4 py-3">{conta.ultimaParcela || '-'}</td>
                  <td className="px-4 py-3">{conta.nomePessoa}</td>
                  <td className="px-4 py-3">{conta.descricao}</td>
                  <td className="px-4 py-3">R$ {conta.valor.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totalizadores */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="text-blue-600 font-bold">Valor Devedor</h3>
            <p className="text-blue-900 text-xl">R$ {totais.valorDevedor.toFixed(2)}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="text-blue-600 font-bold">A Vencer</h3>
            <p className="text-blue-900 text-xl">R$ {totais.valorVencer.toFixed(2)}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="text-blue-600 font-bold">Pagas</h3>
            <p className="text-blue-900 text-xl">R$ {totais.valorPago.toFixed(2)}</p>
          </div>
        </div>

        {/* Total Geral */}
        <div className="mt-6 text-center">
          <div className="bg-blue-600 text-white p-4 rounded-lg">
            <h3 className="font-bold text-xl">Total Geral</h3>
            <p className="text-2xl">
              R$ {(totais.valorDevedor + totais.valorPago).toFixed(2)}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Explicitly export as default
export default ContasPagar;