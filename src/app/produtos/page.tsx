"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Breadcrumb } from "@/Components/ui/breadcrumb";
import { SelectInput } from "@/Components/ui/select";
import { InputMask } from "@/Components/ui/input-mask";
import Link from "next/link";

// Interface para o tipo de produto
interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  codigo: string;
  categorias: string[];
  cores: string[];
  unidade: string;
  tamanho: string;
}

// Dados mockados para exemplo
const produtosExemplo: Produto[] = [
  {
    id: "1",
    nome: "Camiseta Básica",
    descricao: "Camiseta 100% algodão",
    preco: 49.9,
    quantidade: 100,
    codigo: "CAM001",
    categorias: ["Roupas", "Vestuário"],
    cores: ["Preto", "Branco"],
    unidade: "UN",
    tamanho: "M",
  },
  {
    id: "2",
    nome: "Calça Jeans",
    descricao: "Calça jeans tradicional",
    preco: 149.9,
    quantidade: 50,
    codigo: "CJ002",
    categorias: ["Roupas", "Vestuário"],
    cores: ["Azul"],
    unidade: "UN",
    tamanho: "42",
  },
];

export default function ProdutosPage() {
  const [showForm, setShowForm] = useState(false);
  const [produtos] = useState<Produto[]>(produtosExemplo);
  const methods = useForm();

  // Opções para os selects
  const categorias = [
    { value: "roupas", label: "Roupas" },
    { value: "calcados", label: "Calçados" },
    { value: "acessorios", label: "Acessórios" },
  ];

  const cores = [
    { value: "preto", label: "Preto" },
    { value: "branco", label: "Branco" },
    { value: "azul", label: "Azul" },
  ];

  const unidades = [
    { value: "un", label: "Unidade" },
    { value: "kg", label: "Quilograma" },
    { value: "m", label: "Metro" },
  ];

  const tamanhos = [
    { value: "pp", label: "PP" },
    { value: "p", label: "P" },
    { value: "m", label: "M" },
    { value: "g", label: "G" },
    { value: "gg", label: "GG" },
    { value: "36", label: "36" },
    { value: "38", label: "38" },
    { value: "40", label: "40" },
    { value: "42", label: "42" },
    { value: "44", label: "44" },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Breadcrumb
          items={[
            {
              label: "Produtos",
              href: "/produtos",
              active: true,
            },
          ]}
        />
      </div>

      {/* Cabeçalho com título e botão */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-blue-500">Gestão de Produtos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          {showForm ? "Voltar para Lista" : "Novo Produto"}
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-md shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Buscar por nome..."
            className="w-full rounded-md border border-blue-500/20 px-3 py-2 text-blue-500 placeholder-blue-500/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
          />
          <SelectInput
            name="categoria_filtro"
            options={categorias}
            placeholder="Filtrar por categoria"
          />
          <SelectInput
            name="cor_filtro"
            options={cores}
            placeholder="Filtrar por cor"
          />
          <SelectInput
            name="tamanho_filtro"
            options={tamanhos}
            placeholder="Filtrar por tamanho"
          />
        </div>
      </div>

      {showForm ? (
        /* Formulário de Cadastro/Edição */
        <FormProvider {...methods}>
          <form className="bg-white rounded-md shadow p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-500 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-blue-500/20 px-3 py-2 text-blue-500 placeholder-blue-500/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  placeholder="Nome do produto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-500 mb-1">
                  Código
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-blue-500/20 px-3 py-2 text-blue-500 placeholder-blue-500/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  placeholder="Código do produto"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-blue-500 mb-1">
                  Descrição
                </label>
                <textarea
                  className="w-full rounded-md border border-blue-500/20 px-3 py-2 text-blue-500 placeholder-blue-500/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  rows={3}
                  placeholder="Descrição do produto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-500 mb-1">
                  Preço
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full rounded-md border border-blue-500/20 px-3 py-2 text-blue-500 placeholder-blue-500/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  placeholder="0,00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-500 mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border border-blue-500/20 px-3 py-2 text-blue-500 placeholder-blue-500/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-500 mb-1">
                  Categorias
                </label>
                <SelectInput
                  name="categorias"
                  options={categorias}
                  placeholder="Selecione as categorias"
                  isMulti={true}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-500 mb-1">
                  Cores
                </label>
                <SelectInput
                  name="cores"
                  options={cores}
                  placeholder="Selecione as cores"
                  isMulti={true}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-500 mb-1">
                  Unidade
                </label>
                <SelectInput
                  name="unidade"
                  options={unidades}
                  placeholder="Selecione a unidade"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-500 mb-1">
                  Tamanho
                </label>
                <SelectInput
                  name="tamanho"
                  options={tamanhos}
                  placeholder="Selecione o tamanho"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full sm:w-auto px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Salvar
              </button>
            </div>
          </form>
        </FormProvider>
      ) : (
        /* Tabela de Listagem */
        <div className="bg-white rounded-md shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-blue-500/20">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                  Categorias
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                  Cores
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                  Tamanho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                  Unidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-500/20">
              {produtos.map((produto) => (
                <tr key={produto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                    {produto.codigo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                    {produto.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                    {produto.preco.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                    {produto.quantidade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                    {produto.categorias.join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                    {produto.cores.join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 font-medium">
                    {produto.tamanho}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                    {produto.unidade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 space-x-2">
                    <Link
                      href={`/produtos/${produto.id}`}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Visualizar
                    </Link>
                    <button className="text-yellow-500 hover:text-yellow-600">
                      Editar
                    </button>
                    <button className="text-red-500 hover:text-red-600">
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
