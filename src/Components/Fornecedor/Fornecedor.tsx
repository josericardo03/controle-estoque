"use client";

import React, { useState, FormEvent } from "react";
import { 
  FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSearch, FaFileExport 
} from "react-icons/fa";

interface Endereco {
  nome: string;
  bairro: string;
  complemento: string;
  cidade: {
    nome: string;
    estado: {
      nome: string;
    };
  };
}

interface Telefone {
  ddd: string;
  numero: string;
}

interface Fornecedor {
  id?: string;
  nome: string;
  cnpj?: string;
  cpf?: string;
  endereco: Endereco;
  telefone: Telefone;
  dataCadastro: string;
}

const Fornecedor: React.FC = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [fornecedorAtual, setFornecedorAtual] = useState<Fornecedor>({
    nome: "",
    cnpj: "",
    cpf: "",
    endereco: {
      nome: "",
      bairro: "",
      complemento: "",
      cidade: {
        nome: "",
        estado: {
          nome: ""
        }
      }
    },
    telefone: {
      ddd: "",
      numero: ""
    },
    dataCadastro: new Date().toISOString().split('T')[0]
  });

  const [modoEdicao, setModoEdicao] = useState(false);
  const [indiceEdicao, setIndiceEdicao] = useState<number | null>(null);
  const [filtro, setFiltro] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    const updateNestedState = (prevState: Fornecedor, path: string, newValue: string): Fornecedor => {
      const keys = path.split('.');
      
      const newState = JSON.parse(JSON.stringify(prevState));
      
      let current: any = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = newValue;
      
      return newState;
    };

    const keys = name.split('.');
    
    if (keys.length > 1) {
      setFornecedorAtual(prev => updateNestedState(prev, name, value));
    } else {
      setFornecedorAtual(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const adicionarOuAtualizarFornecedor = (e: FormEvent) => {
    e.preventDefault();
    
    if (modoEdicao && indiceEdicao !== null) {
      const novosFornecedores = [...fornecedores];
      novosFornecedores[indiceEdicao] = fornecedorAtual;
      setFornecedores(novosFornecedores);
    } else {
      setFornecedores([...fornecedores, { 
        ...fornecedorAtual, 
        id: Date.now().toString(),
        dataCadastro: new Date().toISOString().split('T')[0]
      }]);
    }
    
    resetFormulario();
  };

  const resetFormulario = () => {
    setFornecedorAtual({
      nome: "",
      cnpj: "",
      cpf: "",
      endereco: {
        nome: "",
        bairro: "",
        complemento: "",
        cidade: {
          nome: "",
          estado: {
            nome: ""
          }
        }
      },
      telefone: {
        ddd: "",
        numero: ""
      },
      dataCadastro: new Date().toISOString().split('T')[0]
    });
    setModoEdicao(false);
    setIndiceEdicao(null);
  };

  const editarFornecedor = (fornecedor: Fornecedor, index: number) => {
    setFornecedorAtual(fornecedor);
    setModoEdicao(true);
    setIndiceEdicao(index);
  };

  const excluirFornecedor = (index: number) => {
    const novosFornecedores = fornecedores.filter((_, i) => i !== index);
    setFornecedores(novosFornecedores);
  };

  const fornecedoresFiltrados = fornecedores
    .filter(f => 
      f.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      (f.cnpj && f.cnpj.includes(filtro)) ||
      (f.cpf && f.cpf.includes(filtro))
    );

  const exportarFornecedores = () => {
    const csvContent = [
      "Nome,CNPJ/CPF,Endereço,Bairro,Complemento,Cidade,Estado,DDD,Telefone,Data Cadastro",
      ...fornecedores.map(f => 
        `${f.nome},${f.cnpj || f.cpf},${f.endereco.nome},${f.endereco.bairro},${f.endereco.complemento},${f.endereco.cidade.nome},${f.endereco.cidade.estado.nome},${f.telefone.ddd},${f.telefone.numero},${f.dataCadastro}`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "fornecedores_exportados.csv");
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600  to-blue-400 text-white p-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold">Gestão de Fornecedores</h2>
          <div className="flex space-x-4">
            <button 
              onClick={exportarFornecedores}
              className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-gray-100 transition"
            >
              <FaFileExport /> Exportar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 p-6">
          <div className="col-span-1 bg-gray-100 rounded-2xl p-6 shadow-md">
            <form onSubmit={adicionarOuAtualizarFornecedor} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                <input
                  type="text"
                  name="nome"
                  value={fornecedorAtual.nome}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
                  <input
                    type="text"
                    name="cnpj"
                    value={fornecedorAtual.cnpj}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                  <input
                    type="text"
                    name="cpf"
                    value={fornecedorAtual.cpf}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">DDD</label>
                  <input
                    type="text"
                    name="telefone.ddd"
                    value={fornecedorAtual.telefone.ddd}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número de Telefone</label>
                  <input
                    type="text"
                    name="telefone.numero"
                    value={fornecedorAtual.telefone.numero}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                <input
                  type="text"
                  name="endereco.nome"
                  value={fornecedorAtual.endereco.nome}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                  <input
                    type="text"
                    name="endereco.bairro"
                    value={fornecedorAtual.endereco.bairro}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
                  <input
                    type="text"
                    name="endereco.complemento"
                    value={fornecedorAtual.endereco.complemento}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                  <input
                    type="text"
                    name="endereco.cidade.nome"
                    value={fornecedorAtual.endereco.cidade.nome}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <input
                    type="text"
                    name="endereco.cidade.estado.nome"
                    value={fornecedorAtual.endereco.cidade.estado.nome}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                {modoEdicao ? (
                  <>
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                      <FaSave /> Salvar
                    </button>
                    <button
                      type="button"
                      onClick={resetFormulario}
                      className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      <FaTimes /> Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    <FaPlus /> Adicionar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="col-span-2 bg-white rounded-2xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar fornecedor..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-blue-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CNPJ/CPF</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endereço</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {fornecedoresFiltrados.map((fornecedor, index) => (
                    <tr key={fornecedor.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">{fornecedor.nome}</td>
                      <td className="px-4 py-3">{fornecedor.cnpj || fornecedor.cpf}</td>
                      <td className="px-4 py-3">({fornecedor.telefone.ddd}) {fornecedor.telefone.numero}</td>
                      <td className="px-4 py-3">
                        {fornecedor.endereco.nome}, {fornecedor.endereco.bairro} - 
                        {fornecedor.endereco.cidade.nome}/{fornecedor.endereco.cidade.estado.nome}
                      </td>
                      <td className="px-4 py-3 flex justify-center space-x-2">
                        <button 
                          onClick={() => editarFornecedor(fornecedor, index)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => excluirFornecedor(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fornecedor;