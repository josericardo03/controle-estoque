"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Breadcrumb } from "@/Components/ui/breadcrumb";
import { DataTable } from "@/Components/ui/data-table";
import { SelectInput } from "@/Components/ui/select";
import { InputMask } from "@/Components/ui/input-mask";
import { Modal } from "@/Components/ui/modal";
import {
  FormLayout,
  FormSection,
  FormField,
} from "@/Components/ui/form-layout";
import { ColumnDef, Row } from "@tanstack/react-table";
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
  const [showModal, setShowModal] = useState(false);
  const [produtos] = useState<Produto[]>(produtosExemplo);
  const [produtoParaEditar, setProdutoParaEditar] = useState<Produto | null>(
    null
  );
  const [especificacoes, setEspecificacoes] = useState<
    { chave: string; valor: string }[]
  >([]);
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

  // Colunas da tabela
  const columns: ColumnDef<Produto>[] = [
    {
      id: "codigo",
      accessorKey: "codigo",
      header: "Código",
      cell: ({ row }: { row: Row<Produto> }) => (
        <div className="text-sm text-gray-900 font-medium">
          {row.original.codigo}
        </div>
      ),
    },
    {
      id: "nome",
      accessorKey: "nome",
      header: "Nome",
      cell: ({ row }: { row: Row<Produto> }) => (
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-900">
            {row.original.nome}
          </div>
          <div className="text-sm text-gray-500">{row.original.descricao}</div>
        </div>
      ),
    },
    {
      id: "preco",
      accessorKey: "preco",
      header: "Preço",
      cell: ({ row }: { row: Row<Produto> }) => (
        <div className="text-sm text-gray-900">
          {row.original.preco.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
      ),
    },
    {
      id: "quantidade",
      accessorKey: "quantidade",
      header: "Quantidade",
      cell: ({ row }: { row: Row<Produto> }) => (
        <div className="text-sm text-gray-900">{row.original.quantidade}</div>
      ),
    },
    {
      id: "categorias",
      accessorKey: "categorias",
      header: "Categorias",
      cell: ({ row }: { row: Row<Produto> }) => (
        <div className="text-sm text-gray-900">
          {row.original.categorias.join(", ")}
        </div>
      ),
    },
    {
      id: "cores",
      accessorKey: "cores",
      header: "Cores",
      cell: ({ row }: { row: Row<Produto> }) => (
        <div className="text-sm text-gray-900">
          {row.original.cores.join(", ")}
        </div>
      ),
    },
    {
      id: "tamanho",
      accessorKey: "tamanho",
      header: "Tamanho",
      cell: ({ row }: { row: Row<Produto> }) => (
        <div className="text-sm font-medium text-gray-900">
          {row.original.tamanho}
        </div>
      ),
    },
    {
      id: "unidade",
      accessorKey: "unidade",
      header: "Unidade",
      cell: ({ row }: { row: Row<Produto> }) => (
        <div className="text-sm text-gray-900">{row.original.unidade}</div>
      ),
    },
  ];

  const handleNovoProduto = () => {
    setProdutoParaEditar(null);
    methods.reset({});
    setEspecificacoes([]);
    setShowModal(true);
  };

  const handleEditarProduto = (produto: Produto) => {
    setProdutoParaEditar(produto);
    methods.reset({
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
    setEspecificacoes([]);
    setShowModal(true);
  };

  const handleVisualizarProduto = (produto: Produto) => {
    // Implementar visualização do produto
    console.log("Visualizar produto:", produto);
  };

  const handleExcluirProduto = (produto: Produto) => {
    // Implementar exclusão do produto
    console.log("Excluir produto:", produto);
  };

  const handleSubmit = (data: any) => {
    console.log(produtoParaEditar ? "Editar produto:" : "Novo produto:", data);
    setShowModal(false);
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
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
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

      {/* Conteúdo Principal */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Cabeçalho */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900">
              Gestão de Produtos
            </h1>
            <button
              onClick={handleNovoProduto}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Novo Produto
            </button>
          </div>

          {/* Filtros */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="pl-10 w-full rounded-lg border border-gray-300 bg-white py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <SelectInput
              name="categoria_filtro"
              options={categorias}
              placeholder="Filtrar por categoria"
              className="w-full"
            />
            <SelectInput
              name="cor_filtro"
              options={cores}
              placeholder="Filtrar por cor"
              className="w-full"
            />
            <SelectInput
              name="tamanho_filtro"
              options={tamanhos}
              placeholder="Filtrar por tamanho"
              className="w-full"
            />
          </div>
        </div>

        {/* Tabela */}
        <div className="w-full">
          <DataTable
            data={produtos}
            columns={columns}
            onEdit={handleEditarProduto}
            onDelete={handleExcluirProduto}
            onView={handleVisualizarProduto}
          />
        </div>
      </div>

      {/* Modal Unificado para Novo Produto e Edição */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={produtoParaEditar ? "Editar Produto" : "Novo Produto"}
        size="lg"
      >
        <FormProvider {...methods}>
          <FormLayout
            title={
              produtoParaEditar ? "Edição de Produto" : "Cadastro de Produto"
            }
            onSubmit={methods.handleSubmit(handleSubmit)}
            submitText="Salvar"
            cancelText="Cancelar"
            onCancel={() => setShowModal(false)}
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
                          {...methods.register("nome")}
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
                          {...methods.register("codigo")}
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
                        {...methods.register("descricao")}
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
                            {...methods.register("preco")}
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
                          {...methods.register("quantidade")}
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
                          {methods
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
                          {methods.watch("cores")?.map((cor: string) => {
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
