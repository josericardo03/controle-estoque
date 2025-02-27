"use client";

import React, { useState, useEffect } from "react";
import { 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaSearch 
} from "react-icons/fa";

// Interface para Item
interface Item {
  id: string;
  tipo: 'unitario' | 'varios';
  nome: string;
  valor: number;
  descricao: string;
  custo: number;
  cor: string;
  quantidade: number;
  ações?: string;
}

const TabelaItem: React.FC = () => {
  // Estados para gerenciamento
  const [itens, setItens] = useState<Item[]>([]);
  const [busca, setBusca] = useState('');
  const [itensFiltrados, setItensFiltrados] = useState<Item[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);

  // Dados mockados (substituir por chamada de API)
  useEffect(() => {
    const mockItens: Item[] = [
      { 
        id: '1', 
        tipo: 'unitario',
        nome: 'Camisa Polo', 
        valor: 79.90, 
        descricao: 'Camisa polo masculina',
        custo: 45.50,
        cor: 'Azul',
        quantidade: 50,
      },
      { 
        id: '2', 
        tipo: 'varios',
        nome: 'Calça Jeans', 
        valor: 129.90, 
        descricao: 'Calça jeans masculina',
        custo: 75.30,
        cor: 'Preto',
        quantidade: 30,
      }
    ];

    setItens(mockItens);
    setItensFiltrados(mockItens);
  }, []);

  // Filtrar itens
  useEffect(() => {
    if (busca) {
      const filtrados = itens.filter(item => 
        item.nome.toLowerCase().includes(busca.toLowerCase()) ||
        item.descricao.toLowerCase().includes(busca.toLowerCase())
      );
      setItensFiltrados(filtrados);
      setPaginaAtual(1);
    } else {
      setItensFiltrados(itens);
    }
  }, [busca, itens]);

  // Paginação
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const itensPaginaAtual = itensFiltrados.slice(indexPrimeiroItem, indexUltimoItem);

  // Mudar página
  const paginar = (numeroPagina: number) => setPaginaAtual(numeroPagina);

  // Remover item
  const removerItem = (id: string) => {
    const confirmacao = window.confirm('Tem certeza que deseja remover este item?');
    if (confirmacao) {
      const novosItens = itens.filter(item => item.id !== id);
      setItens(novosItens);
      setItensFiltrados(novosItens);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto bg-white rounded-3xl shadow-2xl">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold">Tabela de Itens</h2>
          <button 
            className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg 
              hover:bg-gray-100 transition"
          >
            <FaPlus /> Adicionar Item
          </button>
        </div>

        {/* Barra de Busca */}
        <div className="p-6">
          <div className="flex mb-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar itens..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg pl-10"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Tabela de Itens */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-300 shadow-md rounded-lg">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="p-3 text-left">Tipo</th>
                  <th className="p-3 text-left">Nome</th>
                  <th className="p-3 text-left">Valor</th>
                  <th className="p-3 text-left">Descrição</th>
                  <th className="p-3 text-left">Custo</th>
                  <th className="p-3 text-left">Cor</th>
                  <th className="p-3 text-left">Quantidade</th>
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {itensPaginaAtual.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3">{item.tipo === 'unitario' ? 'Unitário' : 'Vários'}</td>
                    <td className="p-3">{item.nome}</td>
                    <td className="p-3">R$ {item.valor.toFixed(2)}</td>
                    <td className="p-3">{item.descricao}</td>
                    <td className="p-3">R$ {item.custo.toFixed(2)}</td>
                    <td className="p-3">{item.cor}</td>
                    <td className="p-3">{item.quantidade}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          className="text-blue-500 hover:text-blue-700"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => removerItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Remover"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-gray-600">
              Mostrando {indexPrimeiroItem + 1} - {Math.min(indexUltimoItem, itensFiltrados.length)} de {itensFiltrados.length} itens
            </span>
            <div className="flex space-x-2">
              {Array.from({ length: Math.ceil(itensFiltrados.length / itensPorPagina) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginar(index + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    paginaAtual === index + 1 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabelaItem;