"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Breadcrumb } from "@/Components/ui/breadcrumb";
import { DataTable } from "@/Components/ui/data-table";
import { Modal } from "@/Components/ui/modal";
import {
  FormLayout,
  FormField,
  FormSection,
} from "@/Components/ui/form-layout";
import { SelectInput } from "@/Components/ui/select";
import { ColumnDef, Row } from "@tanstack/react-table";

// Tipos
interface Parcela {
  id: string;
  dataVencimento: string;
  valor: number;
  formaPagamento: string;
}

interface Negociacao {
  id: string;
  data: string;
  descricao: string;
  status: string;
  valorTotal: number;
  subtotal: number;
  valorDesconto: number;
  numeroParcelas: number;
  parcelas: Parcela[];
}

// Dados mockados
const negociacoesMock: Negociacao[] = [
  {
    id: "1",
    data: "2024-03-15",
    descricao: "Venda de Produtos",
    status: "pendente",
    valorTotal: 1500.0,
    subtotal: 1600.0,
    valorDesconto: 100.0,
    numeroParcelas: 3,
    parcelas: [
      {
        id: "1",
        dataVencimento: "2024-04-15",
        valor: 500.0,
        formaPagamento: "cartao",
      },
      {
        id: "2",
        dataVencimento: "2024-05-15",
        valor: 500.0,
        formaPagamento: "cartao",
      },
      {
        id: "3",
        dataVencimento: "2024-06-15",
        valor: 500.0,
        formaPagamento: "cartao",
      },
    ],
  },
  {
    id: "2",
    data: "2024-03-16",
    descricao: "Compra de Insumos",
    status: "concluida",
    valorTotal: 2000.0,
    subtotal: 2200.0,
    valorDesconto: 200.0,
    numeroParcelas: 2,
    parcelas: [
      {
        id: "1",
        dataVencimento: "2024-04-16",
        valor: 1000.0,
        formaPagamento: "pix",
      },
      {
        id: "2",
        dataVencimento: "2024-05-16",
        valor: 1000.0,
        formaPagamento: "pix",
      },
    ],
  },
];

const statusOptions = [
  { value: "pendente", label: "Pendente" },
  { value: "concluida", label: "Concluída" },
  { value: "cancelada", label: "Cancelada" },
];

const formasPagamentoOptions = [
  { value: "dinheiro", label: "Dinheiro" },
  { value: "pix", label: "PIX" },
  { value: "cartao", label: "Cartão" },
  { value: "boleto", label: "Boleto" },
];

export default function NegociacoesPage() {
  const [showModal, setShowModal] = useState(false);
  const [negociacaoParaEditar, setNegociacaoParaEditar] =
    useState<Negociacao | null>(null);
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const methods = useForm();

  // Colunas da tabela
  const columns: ColumnDef<Negociacao>[] = [
    {
      id: "data",
      accessorKey: "data",
      header: "Data",
      cell: ({ row }) => {
        const data = new Date(row.original.data);
        return data.toLocaleDateString("pt-BR");
      },
    },
    {
      id: "descricao",
      accessorKey: "descricao",
      header: "Descrição",
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.original.status === "pendente"
              ? "bg-yellow-100 text-yellow-800"
              : row.original.status === "concluida"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.status === "pendente"
            ? "Pendente"
            : row.original.status === "concluida"
            ? "Concluída"
            : "Cancelada"}
        </span>
      ),
    },
    {
      id: "numeroParcelas",
      accessorKey: "numeroParcelas",
      header: "Nº Parcelas",
    },
    {
      id: "valores",
      accessorKey: "valores",
      header: "Valores",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-900">
            Total:{" "}
            {row.original.valorTotal.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>
          <div className="text-sm text-gray-500">
            Subtotal:{" "}
            {row.original.subtotal.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>
          <div className="text-sm text-gray-500">
            Desconto:{" "}
            {row.original.valorDesconto.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>
        </div>
      ),
    },
  ];

  const handleEdit = (negociacao: Negociacao) => {
    setNegociacaoParaEditar(negociacao);
    setParcelas(negociacao.parcelas);
    methods.reset(negociacao);
    setShowModal(true);
  };

  const handleDelete = (negociacao: Negociacao) => {
    console.log("Deletar:", negociacao);
  };

  const handleView = (negociacao: Negociacao) => {
    console.log("Visualizar:", negociacao);
  };

  const handleSubmit = (data: any) => {
    console.log("Dados do formulário:", { ...data, parcelas });
    setShowModal(false);
  };

  const adicionarParcela = () => {
    const novaParcela: Parcela = {
      id: String(parcelas.length + 1),
      dataVencimento: "",
      valor: 0,
      formaPagamento: "",
    };
    setParcelas([...parcelas, novaParcela]);
  };

  const removerParcela = (index: number) => {
    setParcelas(parcelas.filter((_, i) => i !== index));
  };

  const atualizarParcela = (
    index: number,
    campo: keyof Parcela,
    valor: any
  ) => {
    const novasParcelas = [...parcelas];
    novasParcelas[index] = { ...novasParcelas[index], [campo]: valor };
    setParcelas(novasParcelas);
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Financeiro", href: "/financeiro" },
            { label: "Negociações", href: "/negociacoes", active: true },
          ]}
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Cabeçalho */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900">
              Gestão de Negociações
            </h1>
            <button
              onClick={() => {
                setNegociacaoParaEditar(null);
                setParcelas([]);
                methods.reset({});
                setShowModal(true);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
              Nova Negociação
            </button>
          </div>

          {/* Filtros */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Data Inicial
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Data Final
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <SelectInput
                name="status_filtro"
                options={statusOptions}
                placeholder="Todos"
                className="w-full"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Buscar
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar negociações..."
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
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
              </div>
            </div>
          </div>
        </div>

        {/* Visualização Mobile (Cards) */}
        <div className="sm:hidden divide-y divide-gray-200">
          {negociacoesMock.map((negociacao) => (
            <div key={negociacao.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-sm text-gray-500">
                    {new Date(negociacao.data).toLocaleDateString("pt-BR")}
                  </span>
                  <h3 className="text-base font-medium text-gray-900 mt-1">
                    {negociacao.descricao}
                  </h3>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    negociacao.status === "pendente"
                      ? "bg-yellow-100 text-yellow-800"
                      : negociacao.status === "concluida"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {negociacao.status === "pendente"
                    ? "Pendente"
                    : negociacao.status === "concluida"
                    ? "Concluída"
                    : "Cancelada"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2">
                <div>
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">
                    {negociacao.subtotal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Desconto</p>
                  <p className="text-sm font-medium text-gray-900">
                    {negociacao.valorDesconto.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-sm font-medium text-gray-900">
                    {negociacao.valorTotal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Parcelas</p>
                  <p className="text-sm font-medium text-gray-900">
                    {negociacao.numeroParcelas}x
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleView(negociacao)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Visualizar
                </button>
                <button
                  onClick={() => handleEdit(negociacao)}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(negociacao)}
                  className="text-red-600 hover:text-red-800"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Visualização Desktop (Tabela) */}
        <div className="hidden sm:block">
          <DataTable
            data={negociacoesMock}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </div>
      </div>

      {/* Modal de Formulário */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${negociacaoParaEditar ? "Editar" : "Nova"} Negociação`}
        size="xl"
      >
        <FormProvider {...methods}>
          <FormLayout
            onSubmit={methods.handleSubmit(handleSubmit)}
            title={`${
              negociacaoParaEditar ? "Edição" : "Cadastro"
            } de Negociação`}
            submitText="Salvar"
            onCancel={() => setShowModal(false)}
          >
            {/* Informações Básicas */}
            <FormSection title="Informações Básicas">
              <FormField label="Data" className="space-y-2">
                <input
                  type="date"
                  {...methods.register("data")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </FormField>

              <FormField label="Descrição" className="space-y-2">
                <input
                  type="text"
                  {...methods.register("descricao")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Digite a descrição"
                />
              </FormField>

              <FormField label="Status" className="space-y-2">
                <SelectInput
                  name="status"
                  options={statusOptions}
                  placeholder="Selecione o status"
                />
              </FormField>

              <FormField label="Número de Parcelas" className="space-y-2">
                <input
                  type="number"
                  {...methods.register("numeroParcelas")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="0"
                  min="1"
                />
              </FormField>
            </FormSection>

            {/* Valores */}
            <FormSection title="Valores">
              <FormField label="Subtotal" className="space-y-2">
                <input
                  type="number"
                  step="0.01"
                  {...methods.register("subtotal")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="0,00"
                />
              </FormField>

              <FormField label="Valor Desconto" className="space-y-2">
                <input
                  type="number"
                  step="0.01"
                  {...methods.register("valorDesconto")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="0,00"
                />
              </FormField>

              <FormField label="Valor Total" className="space-y-2">
                <input
                  type="number"
                  step="0.01"
                  {...methods.register("valorTotal")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="0,00"
                />
              </FormField>
            </FormSection>

            {/* Parcelas */}
            <FormSection title="Parcelas">
              <div className="col-span-2 space-y-4">
                {parcelas.map((parcela, index) => (
                  <div
                    key={`parcela-${index}`}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <FormField label="Data de Vencimento">
                      <input
                        type="date"
                        value={parcela.dataVencimento}
                        onChange={(e) =>
                          atualizarParcela(
                            index,
                            "dataVencimento",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      />
                    </FormField>

                    <FormField label="Valor">
                      <input
                        type="number"
                        step="0.01"
                        value={parcela.valor}
                        onChange={(e) =>
                          atualizarParcela(
                            index,
                            "valor",
                            Number(e.target.value)
                          )
                        }
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        placeholder="0,00"
                      />
                    </FormField>

                    <FormField label="Forma de Pagamento">
                      <SelectInput
                        name={`parcelas.${index}.formaPagamento`}
                        options={formasPagamentoOptions}
                        value={formasPagamentoOptions.find(
                          (opt) => opt.value === parcela.formaPagamento
                        )}
                        onChange={(option: any) =>
                          atualizarParcela(
                            index,
                            "formaPagamento",
                            option?.value || ""
                          )
                        }
                        placeholder="Selecione"
                      />
                    </FormField>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removerParcela(index)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
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
                  onClick={adicionarParcela}
                  className="w-full py-3 border-2 border-dashed border-blue-200 rounded-lg text-blue-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2"
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
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Adicionar Parcela
                </button>
              </div>
            </FormSection>
          </FormLayout>
        </FormProvider>
      </Modal>
    </div>
  );
}
