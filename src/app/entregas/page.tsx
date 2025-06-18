"use client";

import { useState } from "react";
import { Breadcrumb } from "@/Components/ui/breadcrumb";
import { DataTable } from "@/Components/ui/data-table";
import { Modal } from "@/Components/ui/modal";
import { FormLayout, FormField } from "@/Components/ui/form-layout";
import { useForm, FormProvider } from "react-hook-form";
import { ClientSelect } from "@/Components/ui/client-select";
import { ProductArea } from "@/Components/ui/product-area";

// Tipos
interface Entrega {
  id: string;
  destinatario: { id: string; nome: string; endereco: string };
  produtos: {
    id: string;
    codigo: string;
    produto: string;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
  }[];
  status: "pendente" | "em_transporte" | "entregue";
  dataPrevista: string;
  dataEntrega?: string;
  responsavel: string;
}

// Mock de entregas
const entregasMock: Entrega[] = [
  {
    id: "1",
    destinatario: {
      id: "1",
      nome: "Cliente 1",
      endereco: "Rua das Flores, 123 - Centro, São Paulo/SP",
    },
    produtos: [
      {
        id: "1",
        codigo: "A001",
        produto: "Produto A",
        quantidade: 2,
        precoUnitario: 50,
        subtotal: 100,
      },
      {
        id: "2",
        codigo: "B002",
        produto: "Produto B",
        quantidade: 1,
        precoUnitario: 80,
        subtotal: 80,
      },
    ],
    status: "pendente",
    dataPrevista: "10/03/2024",
    responsavel: "João Silva",
  },
  {
    id: "2",
    destinatario: {
      id: "2",
      nome: "Cliente 2",
      endereco: "Av. Brasil, 456 - Jardim América, Rio de Janeiro/RJ",
    },
    produtos: [
      {
        id: "3",
        codigo: "C003",
        produto: "Produto C",
        quantidade: 5,
        precoUnitario: 30,
        subtotal: 150,
      },
    ],
    status: "em_transporte",
    dataPrevista: "11/03/2024",
    responsavel: "Maria Santos",
  },
  {
    id: "3",
    destinatario: {
      id: "3",
      nome: "Cliente 3",
      endereco: "Rua Nova, 789 - Boa Vista, Belo Horizonte/MG",
    },
    produtos: [
      {
        id: "1",
        codigo: "A001",
        produto: "Produto A",
        quantidade: 1,
        precoUnitario: 50,
        subtotal: 50,
      },
      {
        id: "4",
        codigo: "D004",
        produto: "Produto D",
        quantidade: 3,
        precoUnitario: 40,
        subtotal: 120,
      },
    ],
    status: "entregue",
    dataPrevista: "08/03/2024",
    dataEntrega: "08/03/2024",
    responsavel: "Carlos Souza",
  },
];

const statusOptions = [
  { value: "pendente", label: "Pendente" },
  { value: "em_transporte", label: "Em Transporte" },
  { value: "entregue", label: "Entregue" },
];

export default function EntregasPage() {
  const [entregas, setEntregas] = useState(entregasMock);
  const [showModal, setShowModal] = useState(false);
  const [entregaEditando, setEntregaEditando] = useState<Entrega | null>(null);
  const methods = useForm();
  const [produtos, setProdutos] = useState<Entrega["produtos"]>([]);
  const [destinatario, setDestinatario] = useState<any>(null);

  // Colunas da tabela
  const columns = [
    {
      accessorKey: "destinatario",
      header: "Destinatário",
      cell: ({ row }: any) => (
        <div>
          <div className="font-medium">{row.original.destinatario.nome}</div>
          <div className="text-xs text-gray-500">
            {row.original.destinatario.endereco}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "produtos",
      header: "Produtos",
      cell: ({ row }: any) => (
        <div className="text-xs">
          {row.original.produtos.map((p: any) => (
            <div key={p.id}>
              {p.produto} ({p.quantidade}x)
            </div>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.original.status;
        const color =
          status === "pendente"
            ? "bg-yellow-100 text-yellow-800"
            : status === "em_transporte"
            ? "bg-blue-100 text-blue-800"
            : "bg-green-100 text-green-800";
        return (
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${color}`}>
            {statusOptions.find((s) => s.value === status)?.label}
          </span>
        );
      },
    },
    {
      accessorKey: "dataPrevista",
      header: "Data Prevista",
      cell: ({ row }: any) => <span>{row.original.dataPrevista}</span>,
    },
    {
      accessorKey: "dataEntrega",
      header: "Data Entrega",
      cell: ({ row }: any) => <span>{row.original.dataEntrega || "-"}</span>,
    },
    {
      accessorKey: "responsavel",
      header: "Responsável",
      cell: ({ row }: any) => <span>{row.original.responsavel}</span>,
    },
  ];

  const handleAdd = () => {
    setEntregaEditando(null);
    setDestinatario(null);
    setProdutos([]);
    methods.reset({});
    setShowModal(true);
  };

  const handleEdit = (entrega: Entrega) => {
    setEntregaEditando(entrega);
    setDestinatario(entrega.destinatario);
    setProdutos(entrega.produtos);
    methods.reset({
      status: entrega.status,
      dataPrevista: entrega.dataPrevista,
      dataEntrega: entrega.dataEntrega || "",
      responsavel: entrega.responsavel,
    });
    setShowModal(true);
  };

  const handleSubmit = (data: any) => {
    const novaEntrega: Entrega = {
      id: entregaEditando?.id || Date.now().toString(),
      destinatario: destinatario,
      produtos: produtos,
      status: data.status,
      dataPrevista: data.dataPrevista,
      dataEntrega: data.dataEntrega || undefined,
      responsavel: data.responsavel,
    };
    let novasEntregas;
    if (entregaEditando) {
      novasEntregas = entregas.map((e) =>
        e.id === entregaEditando.id ? novaEntrega : e
      );
    } else {
      novasEntregas = [novaEntrega, ...entregas];
    }
    setEntregas(novasEntregas);
    setShowModal(false);
    setEntregaEditando(null);
    setDestinatario(null);
    setProdutos([]);
    methods.reset({});
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb
          items={[{ label: "Entregas", href: "/entregas", active: true }]}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-lg font-semibold text-gray-900">
            Gestão de Entregas
          </h1>
          <button
            onClick={handleAdd}
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
            Nova Entrega
          </button>
        </div>

        {/* Tabela Desktop */}
        <div className="hidden md:block">
          <DataTable data={entregas} columns={columns} onEdit={handleEdit} />
        </div>

        {/* Cards Mobile */}
        <div className="md:hidden space-y-4 p-4">
          {entregas.map((entrega) => (
            <div key={entrega.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {entrega.destinatario.nome}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {entrega.destinatario.endereco}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      entrega.status === "pendente"
                        ? "bg-yellow-100 text-yellow-800"
                        : entrega.status === "em_transporte"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {
                      statusOptions.find((s) => s.value === entrega.status)
                        ?.label
                    }
                  </span>
                </div>
                <div className="text-xs">
                  {entrega.produtos.map((p) => (
                    <div key={p.id}>
                      {p.produto} ({p.quantidade}x)
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-gray-600 mt-2">
                  <div>
                    <span className="font-medium">Prevista:</span>{" "}
                    {entrega.dataPrevista}
                  </div>
                  <div>
                    <span className="font-medium">Entrega:</span>{" "}
                    {entrega.dataEntrega || "-"}
                  </div>
                  <div>
                    <span className="font-medium">Responsável:</span>{" "}
                    {entrega.responsavel}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(entrega)}
                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                    title="Editar"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Formulário */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={entregaEditando ? "Editar Entrega" : "Nova Entrega"}
        size="lg"
      >
        <FormProvider {...methods}>
          <FormLayout
            onSubmit={methods.handleSubmit(handleSubmit)}
            title={
              entregaEditando ? "Edição de Entrega" : "Cadastro de Entrega"
            }
            submitText="Salvar"
            onCancel={() => setShowModal(false)}
          >
            <FormField label="Destinatário" className="space-y-2">
              <ClientSelect
                cliente={destinatario}
                clientes={[]}
                onSelect={setDestinatario}
              />
            </FormField>
            <FormField label="Produtos" className="space-y-2">
              <ProductArea
                itens={produtos}
                onRemoveItem={(id) =>
                  setProdutos(produtos.filter((p) => p.id !== id))
                }
              />
              {/* Aqui você pode adicionar um componente de busca/adicionar produto, se desejar */}
            </FormField>
            <FormField label="Status" className="space-y-2">
              <select
                {...methods.register("status")}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FormField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Data Prevista" className="space-y-2">
                <input
                  type="date"
                  {...methods.register("dataPrevista")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </FormField>
              <FormField label="Data de Entrega" className="space-y-2">
                <input
                  type="date"
                  {...methods.register("dataEntrega")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </FormField>
            </div>
            <FormField label="Responsável" className="space-y-2">
              <input
                type="text"
                {...methods.register("responsavel")}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Nome do responsável pela entrega"
              />
            </FormField>
          </FormLayout>
        </FormProvider>
      </Modal>
    </div>
  );
}
