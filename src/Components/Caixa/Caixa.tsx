"use client";
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  FaMoneyBillWave, 
  FaShoppingCart, 
  FaChartLine, 
  FaUsers, 
  FaCreditCard 
} from 'react-icons/fa';

// Dados Mock (substituir por dados reais)
const profitData = [
  { month: 'Jan', lucro: 4000 },
  { month: 'Fev', lucro: 3000 },
  { month: 'Mar', lucro: 5000 },
  { month: 'Abr', lucro: 4500 },
  { month: 'Mai', lucro: 6000 },
];

const paymentTypeData = [
  { name: 'Crédito', value: 4000 },
  { name: 'Débito', value: 3000 },
  { name: 'Dinheiro', value: 2000 },
  { name: 'Transferência', value: 1500 },
];

const topClientsData = [
  { nome: 'João Silva', total: 15000 },
  { nome: 'Maria Souza', total: 12500 },
  { nome: 'Pedro Santos', total: 10000 },
  { nome: 'Ana Oliveira', total: 8500 },
  { nome: 'Carlos Pereira', total: 7000 },
];

const topProductsData = [
  { produto: 'Notebook', quantidade: 50, faturamento: 75000 },
  { produto: 'Smartphone', quantidade: 45, faturamento: 67500 },
  { produto: 'Tablet', quantidade: 30, faturamento: 45000 },
  { produto: 'Smartwatch', quantidade: 25, faturamento: 37500 },
  { produto: 'Fone de Ouvido', quantidade: 20, faturamento: 30000 },
];

const sellerPerformanceData = [
  { vendedor: 'Carlos', totalProdutos: 150, totalFaturado: 45000, ticketMedio: 300 },
  { vendedor: 'Maria', totalProdutos: 120, totalFaturado: 36000, ticketMedio: 300 },
  { vendedor: 'João', totalProdutos: 100, totalFaturado: 30000, ticketMedio: 300 },
];

const COLORS = ['#2196F3', '#4CAF50', '#FF5722', '#9C27B0', '#FF9800'];

const Caixa: React.FC = () => {
  const [selectedSeller, setSelectedSeller] = useState(sellerPerformanceData[0]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profit Chart */}
        <div className="bg-white shadow-lg rounded-2xl p-6 col-span-2">
          <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center">
            <FaChartLine className="mr-2" /> Evolução do Lucro
          </h2>
          <LineChart width={600} height={300} data={profitData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="month" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#f0f0f0', border: 'none' }} 
              itemStyle={{ color: '#2196F3' }}
            />
            <Line type="monotone" dataKey="lucro" stroke="#2196F3" strokeWidth={3} />
          </LineChart>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white shadow-lg rounded-2xl p-4 flex items-center">
            <FaMoneyBillWave className="text-blue-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-600">Custo Produtos</p>
              <h3 className="text-xl font-bold text-blue-600">R$ 50.000</h3>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-4 flex items-center">
            <FaShoppingCart className="text-blue-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-600">Ticket Médio</p>
              <h3 className="text-xl font-bold text-blue-600">R$ 300</h3>
            </div>
          </div>
        </div>

        {/* Payment Types Chart */}
        <div className="bg-white shadow-lg rounded-2xl p-6 col-span-1">
          <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center">
            <FaCreditCard className="mr-2" /> Tipos de Pagamento
          </h2>
          <PieChart width={400} height={300}>
            <Pie
              data={paymentTypeData}
              cx={150}
              cy={150}
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {paymentTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#f0f0f0', border: 'none' }} 
              itemStyle={{ color: '#2196F3' }}
            />
            <Legend 
              iconType="circle" 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              wrapperStyle={{ 
                color: '#666', 
                position: 'absolute', 
                right: '-80px', 
                top: '50%', 
                transform: 'translateY(-50%)' 
              }}
            />
          </PieChart>
        </div>

        {/* Top Clients */}
        <div className="bg-white shadow-lg rounded-2xl p-6 col-span-1">
          <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center">
            <FaUsers className="mr-2" /> Top 5 Clientes
          </h2>
          <table className="w-full">
            <thead>
              <tr className="text-gray-600 border-b border-gray-200">
                <th className="text-left">Cliente</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {topClientsData.map((client, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-blue-50">
                  <td className="py-2">{client.nome}</td>
                  <td className="text-right text-blue-600">R$ {client.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Seller Performance */}
        <div className="bg-white shadow-lg rounded-2xl p-6 col-span-2">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Desempenho de Vendedores</h2>
          <div className="grid grid-cols-3 gap-4">
            {sellerPerformanceData.map((seller, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg cursor-pointer ${
                  selectedSeller.vendedor === seller.vendedor 
                    ? 'bg-blue-100 border border-blue-300' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedSeller(seller)}
              >
                <h3 className="text-lg font-bold text-blue-600">{seller.vendedor}</h3>
                <p className="text-gray-600">Total Produtos: {seller.totalProdutos}</p>
                <p className="text-gray-600">Faturado: R$ {seller.totalFaturado.toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-gray-100 p-4 rounded-lg">
            <h4 className="text-xl font-bold text-blue-600 mb-2">
              Detalhes de {selectedSeller.vendedor}
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600">Total Produtos</p>
                <h3 className="text-xl font-bold text-blue-600">
                  {selectedSeller.totalProdutos}
                </h3>
              </div>
              <div>
                <p className="text-gray-600">Total Faturado</p>
                <h3 className="text-xl font-bold text-blue-600">
                  R$ {selectedSeller.totalFaturado.toLocaleString()}
                </h3>
              </div>
              <div>
                <p className="text-gray-600">Ticket Médio</p>
                <h3 className="text-xl font-bold text-blue-600">
                  R$ {selectedSeller.ticketMedio.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white shadow-lg rounded-2xl p-6 col-span-3">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Produtos Mais Vendidos</h2>
          <table className="w-full">
            <thead>
              <tr className="text-gray-600 border-b border-gray-200">
                <th className="text-left">Produto</th>
                <th className="text-right">Quantidade</th>
                <th className="text-right">Faturamento</th>
              </tr>
            </thead>
            <tbody>
              {topProductsData.map((product, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-blue-50">
                  <td className="py-2">{product.produto}</td>
                  <td className="text-right">{product.quantidade}</td>
                  <td className="text-right text-blue-600">R$ {product.faturamento.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Caixa;