"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Breadcrumb } from "@/Components/ui/breadcrumb";
import { SelectInput } from "@/Components/ui/select";
import { InputMask } from "@/Components/ui/input-mask";
import { Modal } from "@/Components/ui/modal";
import {
  FormLayout,
  FormSection,
  FormField,
} from "@/Components/ui/form-layout";
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

// Opções de cores com códigos hexadecimais
const opcoesCorProduto = [
  { value: "preto", label: "Preto", hex: "#000000" },
  { value: "branco", label: "Branco", hex: "#FFFFFF" },
  { value: "cinza", label: "Cinza", hex: "#808080" },
  { value: "vermelho", label: "Vermelho", hex: "#FF0000" },
  { value: "azul", label: "Azul", hex: "#0000FF" },
  { value: "verde", label: "Verde", hex: "#008000" },
  { value: "amarelo", label: "Amarelo", hex: "#FFFF00" },
  { value: "roxo", label: "Roxo", hex: "#800080" },
  { value: "rosa", label: "Rosa", hex: "#FFC0CB" },
  { value: "laranja", label: "Laranja", hex: "#FFA500" },
  { value: "marrom", label: "Marrom", hex: "#8B4513" },
  { value: "bege", label: "Bege", hex: "#F5F5DC" },
];

export default function ProdutosPage() {
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [produtos] = useState<Produto[]>(produtosExemplo);
  const [produtoParaEditar, setProdutoParaEditar] = useState<Produto | null>(
    null
  );
  const [especificacoes, setEspecificacoes] = useState<
    { chave: string; valor: string }[]
  >([]);
  const methodsNovo = useForm();
  const methodsEditar = useForm();

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

  const handleEditarProduto = (produto: Produto) => {
    setProdutoParaEditar(produto);
    methodsEditar.reset({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      quantidade: produto.quantidade,
      codigo: produto.codigo,
      categorias: produto.categorias,
      cores: produto.cores,
      unidade: produto.unidade,
      tamanho: produto.tamanho,
    });
    setShowEditForm(true);
  };

  const handleSubmitEditar = (data: any) => {
    console.log("Editar produto:", data);
    setShowEditForm(false);
  };

  const adicionarEspecificacao = () => {
    setEspecificacoes([...especificacoes, { chave: "", valor: "" }]);
  };

  const removerEspecificacao = (index: number) => {
    setEspecificacoes(especificacoes.filter((_, i) => i !== index));
  };

  const atualizarEspecificacao = (
    index: number,
    campo: "chave" | "valor",
    valor: string
  ) => {
    const novasEspecificacoes = [...especificacoes];
    novasEspecificacoes[index][campo] = valor;
    setEspecificacoes(novasEspecificacoes);
  };

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
        <FormProvider {...methodsNovo}>
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
                    <button
                      onClick={() => handleEditarProduto(produto)}
                      className="text-yellow-500 hover:text-yellow-600"
                    >
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

      {/* Modal de Edição */}
      <Modal
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        title="Editar Produto"
        size="lg"
      >
        <FormProvider {...methodsEditar}>
          <FormLayout
            title="Edição de Produto"
            onSubmit={methodsEditar.handleSubmit(handleSubmitEditar)}
            submitText="Salvar"
            cancelText="Cancelar"
            onCancel={() => setShowEditForm(false)}
            className="max-w-4xl mx-auto"
          >
            <div className="space-y-6">
              {/* Seção de Informações Básicas */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-white">
                    Informações Básicas
                  </h3>
                </div>

                <div className="p-6 space-y-8">
                  {/* Grupo: Identificação */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-gray-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M7 8h10" />
                        <path d="M7 12h10" />
                        <path d="M7 16h10" />
                      </svg>
                      <h4 className="text-base font-medium">
                        Identificação do Produto
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField label="Nome do Produto" className="space-y-2">
                        <input
                          type="text"
                          {...methodsEditar.register("nome")}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                          placeholder="Digite o nome do produto"
                        />
                      </FormField>

                      <FormField
                        label="Código do Produto"
                        className="space-y-2"
                      >
                        <input
                          type="text"
                          {...methodsEditar.register("codigo")}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                          placeholder="Digite o código do produto"
                        />
                      </FormField>
                    </div>

                    <FormField
                      label="Descrição do Produto"
                      className="space-y-2"
                    >
                      <textarea
                        {...methodsEditar.register("descricao")}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        rows={3}
                        placeholder="Digite uma descrição detalhada do produto"
                      />
                    </FormField>
                  </div>

                  {/* Grupo: Estoque e Preço */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-gray-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      <h4 className="text-base font-medium">Estoque e Preço</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField label="Preço Unitário" className="space-y-2">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">R$</span>
                          </div>
                          <input
                            type="number"
                            step="0.01"
                            {...methodsEditar.register("preco")}
                            className="w-full rounded-lg border-gray-300 pl-8 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                            placeholder="0,00"
                          />
                        </div>
                      </FormField>

                      <FormField
                        label="Quantidade em Estoque"
                        className="space-y-2"
                      >
                        <input
                          type="number"
                          {...methodsEditar.register("quantidade")}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                          placeholder="0"
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Grupo: Características */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-gray-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                      <h4 className="text-base font-medium">
                        Características do Produto
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="Categorias"
                        className="space-y-2 md:col-span-2"
                      >
                        <SelectInput
                          name="categorias"
                          options={categorias}
                          placeholder="Selecione as categorias"
                          isMulti={true}
                          className="rounded-lg"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {methodsEditar
                            .watch("categorias")
                            ?.map((categoria: string) => {
                              const categoriaInfo = categorias.find(
                                (c) => c.value === categoria
                              );
                              return categoriaInfo ? (
                                <div
                                  key={categoria}
                                  className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
                                >
                                  <span>{categoriaInfo.label}</span>
                                </div>
                              ) : null;
                            })}
                        </div>
                      </FormField>

                      <FormField
                        label="Unidade de Medida"
                        className="space-y-2"
                      >
                        <SelectInput
                          name="unidade"
                          options={unidades}
                          placeholder="Selecione a unidade"
                          className="rounded-lg"
                        />
                      </FormField>

                      <FormField label="Tamanho/Dimensão" className="space-y-2">
                        <SelectInput
                          name="tamanho"
                          options={tamanhos}
                          placeholder="Selecione o tamanho"
                          className="rounded-lg"
                        />
                      </FormField>

                      <FormField
                        label="Cores Disponíveis"
                        className="space-y-2 md:col-span-2"
                      >
                        <SelectInput
                          name="cores"
                          options={opcoesCorProduto}
                          placeholder="Selecione as cores"
                          isMulti={true}
                          className="rounded-lg"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {methodsEditar.watch("cores")?.map((cor: string) => {
                            const corInfo = opcoesCorProduto.find(
                              (c) => c.value === cor
                            );
                            return corInfo ? (
                              <div
                                key={cor}
                                className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                                style={{
                                  backgroundColor: corInfo.hex,
                                  color: ["branco", "amarelo", "bege"].includes(
                                    cor
                                  )
                                    ? "#000"
                                    : "#fff",
                                  border: [
                                    "branco",
                                    "amarelo",
                                    "bege",
                                  ].includes(cor)
                                    ? "1px solid #e5e7eb"
                                    : "none",
                                }}
                              >
                                <span>{corInfo.label}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </FormField>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção de Especificações Técnicas */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-white">
                    Especificações Técnicas
                  </h3>
                  <p className="mt-1 text-sm text-blue-50">
                    Adicione especificações técnicas detalhadas do produto
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  {especificacoes.map((esp, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-blue-200 transition-colors duration-200"
                    >
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome da Especificação
                        </label>
                        <input
                          type="text"
                          value={esp.chave}
                          onChange={(e) =>
                            atualizarEspecificacao(
                              index,
                              "chave",
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                          placeholder="Ex: Material, Dimensões, etc"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Valor da Especificação
                        </label>
                        <input
                          type="text"
                          value={esp.valor}
                          onChange={(e) =>
                            atualizarEspecificacao(
                              index,
                              "valor",
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                          placeholder="Ex: Algodão, 30x40cm, etc"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removerEspecificacao(index)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Remover Especificação"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={adicionarEspecificacao}
                    className="w-full py-3 border-2 border-dashed border-blue-200 rounded-lg text-blue-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2 group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transform group-hover:scale-110 transition-transform duration-200"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Adicionar Nova Especificação
                  </button>
                </div>
              </div>
            </div>
          </FormLayout>
        </FormProvider>
      </Modal>
    </div>
  );
}
