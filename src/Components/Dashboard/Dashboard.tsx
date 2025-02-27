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
  Cell, 
  ResponsiveContainer,
  ReferenceLine
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

const Dashboard: React.FC = () => {
  const [selectedSeller, setSelectedSeller] = useState(sellerPerformanceData[0]);

  return (
    
    <div className="w-full min-h-screen bg-blue-600 p-4 overflow-auto">
    <div className="grid grid-cols-12 gap-4 h-full">
      {/* Profit Chart */}
      <div className="col-span-12 lg:col-span-8 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl p-4">
        <h2 className="text-xl font-semibold text-blue-600 mb-3 flex items-center gap-2">
          <FaChartLine className="text-blue-500" /> Evolução do Lucro
        </h2>
        <ResponsiveContainer width="100%" height="87%">
          <LineChart 
            data={profitData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#f9fafb', 
                border: '1px solid #e0e0e0',
                borderRadius: '8px'
              }} 
              itemStyle={{ color: '#2196F3' }}
            />
            <ReferenceLine y={4500} label="" stroke="green" strokeDasharray="3 3" />
            <Line 
              type="monotone" 
              dataKey="lucro" 
              stroke="#000000" 
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Payment Types Chart */}
      <div className="col-span-12 lg:col-span-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl p-4">
        <h2 className="text-xl font-semibold text-blue-600 mb-3 flex items-center gap-2">
          <FaCreditCard className="text-blue-500" /> Tipos de Pagamento
        </h2>
        <ResponsiveContainer width="100%" height="80%">
          <PieChart 
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <Pie
              data={paymentTypeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="80%"
              fill="#8884d8"
              dataKey="value"
              paddingAngle={5}
            >
              {paymentTypeData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#f9fafb', 
                border: '1px solid #e0e0e0',
                borderRadius: '8px'
              }} 
              itemStyle={{ color: '#2196F3' }}
            />
            <Legend 
              iconType="circle" 
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ 
                paddingTop: '10px',
                fontSize: '12px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        </div>

        {/* Top Clients */}
        <div className="col-span-12 lg:col-span-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl p-4">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 flex items-center gap-2">
            <FaUsers className="text-blue-500" /> Top 5 Clientes
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-200">
                <th className="text-left py-1">Cliente</th>
                <th className="text-right py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {topClientsData.map((client, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2">{client.nome}</td>
                  <td className="text-right  font-semibold">R$ {client.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Seller Performance */}
        <div className="col-span-12 lg:col-span-8 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl p-4">
          <h2 className="text-xl font-semibold text-blue-600 mb-3">Desempenho de Vendedores</h2>
          <div className="grid grid-cols-3 gap-3">
            {sellerPerformanceData.map((seller, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg cursor-pointer transition-all duration-300 text-sm ${
                  selectedSeller.vendedor === seller.vendedor 
                    ? 'bg-blue-100 border border-blue-300 scale-105' 
                    : 'hover:bg-gray-100 hover:scale-105'
                }`}
                onClick={() => setSelectedSeller(seller)}
              >
                <h3 className="text-base font-bold ">{seller.vendedor}</h3>
                <p className="text-gray-600">Total Produtos: {seller.totalProdutos}</p>
                <p className="text-gray-600">Faturado: R$ {seller.totalFaturado.toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 bg-gray-50 p-3 rounded-lg">
            <h4 className="text-lg font-bold text-blue-600 mb-2">
              Detalhes de {selectedSeller.vendedor}
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Produtos', value: selectedSeller.totalProdutos },
                { label: 'Total Faturado', value: `R$ ${selectedSeller.totalFaturado.toLocaleString()}` },
                { label: 'Ticket Médio', value: `R$ ${selectedSeller.ticketMedio.toLocaleString()}` }
              ].map((item, index) => (
                <div key={index} className="bg-white p-2 rounded-lg shadow-sm">
                  <p className="text-gray-500 text-xs">{item.label}</p>
                  <h3 className="text-base font-bold ">{item.value}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="col-span-12 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl p-4 ">
          <h2 className="text-xl font-semibold text-blue-600 mb-3">Produtos Mais Vendidos</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-200">
                <th className="text-left py-1">Produto</th>
                <th className="text-right py-1">Quantidade</th>
                <th className="text-right py-1">Faturamento</th>
              </tr>
            </thead>
            <tbody>
              {topProductsData.map((product, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2">{product.produto}</td>
                  <td className="text-right">{product.quantidade}</td>
                  <td className="text-right text-green-600 font-semibold">R$ {product.faturamento.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;