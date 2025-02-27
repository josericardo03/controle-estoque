"use client"
import React, { useState, useMemo } from "react";
import { FaSort, FaFilter, FaFileExport } from "react-icons/fa";

interface Venda {
  id: string;
  dataHora: string;
  subtotal: number;
  total: number;
  desconto: number;
  descricao: string;
  estado: 'Concluída' | 'Pendente' | 'Cancelada';
  numeroParcela: number;
}

const Caixa: React.FC = () => {
  const [dataAbertura] = useState(new Date().toISOString().substring(0, 10));
  const [dataFechamento, setDataFechamento] = useState("");
  const [vendas, setVendas] = useState<Venda[]>([
    // Example data - replace with actual data fetching logic
    {
      id: '1',
      dataHora: new Date().toISOString(),
      subtotal: 100.00,
      total: 95.00,
      desconto: 5.00,
      descricao: 'Venda de produtos eletrônicos',
      estado: 'Concluída',
      numeroParcela: 1
    }
  ]);

  const [sortConfig, setSortConfig] = useState<{key: keyof Venda, direction: 'ascending' | 'descending'}>({
    key: 'dataHora',
    direction: 'descending'
  });

  const sortedVendas = useMemo(() => {
    let sortableVendas = [...vendas];
    sortableVendas.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortableVendas;
  }, [vendas, sortConfig]);

  const calculateTotals = () => {
    return {
      totalVendas: vendas.reduce((sum, venda) => sum + venda.total, 0),
      totalDescontos: vendas.reduce((sum, venda) => sum + venda.desconto, 0),
      quantidadeVendas: vendas.length
    };
  };

  const handleSort = (key: keyof Venda) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  const exportData = () => {
    // Implement CSV or Excel export logic
    const csvContent = vendas.map(v => Object.values(v).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "vendas_exportadas.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totals = calculateTotals();

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-700">Relatório de Caixa</h2>
        <div className="flex space-x-2">
          <button 
            onClick={exportData}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            <FaFileExport /> Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-600">Total de Vendas</p>
          <p className="text-xl font-bold text-blue-700">R$ {totals.totalVendas.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Total de Descontos</p>
          <p className="text-xl font-bold text-red-600">R$ {totals.totalDescontos.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Quantidade de Vendas</p>
          <p className="text-xl font-bold text-green-700">{totals.quantidadeVendas}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-50">
            <tr>
              {(['dataHora', 'subtotal', 'total', 'desconto', 'descricao', 'estado', 'numeroParcela'] as (keyof Venda)[]).map((key) => (
                <th 
                  key={key} 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    <FaSort className="ml-2 text-gray-400" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedVendas.map((venda) => (
              <tr key={venda.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">{new Date(venda.dataHora).toLocaleString()}</td>
                <td className="px-4 py-3">R$ {venda.subtotal.toFixed(2)}</td>
                <td className="px-4 py-3">R$ {venda.total.toFixed(2)}</td>
                <td className="px-4 py-3">R$ {venda.desconto.toFixed(2)}</td>
                <td className="px-4 py-3">{venda.descricao}</td>
                <td className="px-4 py-3">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-semibold
                    ${venda.estado === 'Concluída' ? 'bg-green-100 text-green-800' : 
                      venda.estado === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}
                  `}>
                    {venda.estado}
                  </span>
                </td>
                <td className="px-4 py-3">{venda.numeroParcela}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Caixa;