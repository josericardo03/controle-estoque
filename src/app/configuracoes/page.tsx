"use client";

import { useState } from "react";
import { Breadcrumb } from "@/Components/ui/breadcrumb";
import { DataTable } from "@/Components/ui/data-table";
import { Modal } from "@/Components/ui/modal";
import { FormLayout, FormField } from "@/Components/ui/form-layout";
import { useForm } from "react-hook-form";
import { Tab } from "@headlessui/react";
import { cn } from "@/lib/utils";

// Tipos
interface ConfigItem {
  id: string;
  nome: string;
  descricao?: string;
  quantidadeProdutos: number;
}

type Row = {
  getValue: (key: keyof ConfigItem) => any;
};

// Dados mockados
const categoriasMock: ConfigItem[] = [
  {
    id: "1",
    nome: "Roupas",
    descricao: "Vestuário em geral",
    quantidadeProdutos: 150,
  },
  {
    id: "2",
    nome: "Calçados",
    descricao: "Sapatos e tênis",
    quantidadeProdutos: 80,
  },
];

const coresMock: ConfigItem[] = [
  { id: "1", nome: "Preto", quantidadeProdutos: 200 },
  { id: "2", nome: "Branco", quantidadeProdutos: 180 },
];

const unidadesMock: ConfigItem[] = [
  { id: "1", nome: "Unidade", quantidadeProdutos: 300 },
  { id: "2", nome: "Par", quantidadeProdutos: 150 },
];

const bairrosMock: ConfigItem[] = [
  { id: "1", nome: "Centro", quantidadeProdutos: 120 },
  { id: "2", nome: "Jardim América", quantidadeProdutos: 85 },
  { id: "3", nome: "Vila Nova", quantidadeProdutos: 95 },
  { id: "4", nome: "Boa Vista", quantidadeProdutos: 110 },
];

const cidadesMock: ConfigItem[] = [
  { id: "1", nome: "São Paulo", quantidadeProdutos: 450 },
  { id: "2", nome: "Rio de Janeiro", quantidadeProdutos: 320 },
  { id: "3", nome: "Belo Horizonte", quantidadeProdutos: 280 },
  { id: "4", nome: "Salvador", quantidadeProdutos: 190 },
];

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ConfigItem | null>(null);
  const methods = useForm();

  // Configuração das tabs
  const tabs = [
    { name: "Categorias", data: categoriasMock, hasDescription: true },
    { name: "Cores", data: coresMock, hasDescription: false },
    { name: "Unidades", data: unidadesMock, hasDescription: false },
    { name: "Bairros", data: bairrosMock, hasDescription: false },
    { name: "Cidades", data: cidadesMock, hasDescription: false },
  ];

  // Colunas da tabela
  const getColumns = (hasDescription: boolean) => {
    const getMetricHeader = () => {
      const tabName = tabs[activeTab].name.toLowerCase();
      if (tabName === "bairros" || tabName === "cidades") {
        return "Pessoas Vinculadas";
      }
      return "Produtos Vinculados";
    };

    const baseColumns = [
      {
        accessorKey: "nome",
        header: () => <div className="text-left">Nome</div>,
        cell: ({ row }: { row: Row }) => (
          <div className="text-left font-medium">{row.getValue("nome")}</div>
        ),
      },
      {
        accessorKey: "quantidadeProdutos",
        header: () => <div className="text-center">{getMetricHeader()}</div>,
        cell: ({ row }: { row: Row }) => (
          <div className="text-center font-medium">
            {row.getValue("quantidadeProdutos")}
          </div>
        ),
      },
    ];

    if (hasDescription) {
      baseColumns.splice(1, 0, {
        accessorKey: "descricao",
        header: () => <div className="text-left">Descrição</div>,
        cell: ({ row }: { row: Row }) => (
          <div
            className="text-left max-w-[200px] lg:max-w-[300px] truncate"
            title={row.getValue("descricao")}
          >
            {row.getValue("descricao")}
          </div>
        ),
      });
    }

    return baseColumns;
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: ConfigItem) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = (item: ConfigItem) => {
    // Implementar lógica de deleção
    console.log("Deletar:", item);
  };

  const handleSubmit = (data: any) => {
    console.log("Dados do formulário:", data);
    setShowModal(false);
  };

  // Renderiza um card para visualização mobile
  const renderMobileCard = (item: ConfigItem, hasDescription: boolean) => {
    const getMetricText = () => {
      const tabName = tabs[activeTab].name.toLowerCase();
      if (tabName === "bairros" || tabName === "cidades") {
        return "Pessoas vinculadas";
      }
      return "Produtos vinculados";
    };

    return (
      <div
        key={item.id}
        className="bg-white p-4 rounded-lg border border-gray-200 space-y-3"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">{item.nome}</h3>
            {hasDescription && item.descricao && (
              <p className="text-sm text-gray-500 mt-1">{item.descricao}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(item)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Editar"
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
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              onClick={() => handleDelete(item)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Excluir"
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
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-sm text-gray-500">{getMetricText()}</span>
          <span className="text-sm font-medium text-gray-900">
            {item.quantidadeProdutos}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="mb-6 md:mb-8">
        <Breadcrumb
          items={[
            { label: "Configurações", href: "/configuracoes", active: true },
          ]}
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          {/* Cabeçalho com Tabs */}
          <div className="border-b border-gray-200 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
            <Tab.List className="flex min-w-full">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    cn(
                      "flex-1 min-w-[120px] py-3 md:py-4 px-3 md:px-6 text-sm font-medium whitespace-nowrap border-b-2 focus:outline-none transition-colors duration-200",
                      selected
                        ? "text-blue-600 border-blue-600 bg-blue-50/50"
                        : "text-gray-500 border-transparent hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50/30"
                    )
                  }
                >
                  {tab.name}
                </Tab>
              ))}
            </Tab.List>
          </div>

          {/* Conteúdo das Tabs */}
          <Tab.Panels>
            {tabs.map((tab, idx) => (
              <Tab.Panel key={idx} className="p-4 md:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                    Gestão de {tab.name}
                  </h2>
                  <button
                    onClick={handleAdd}
                    className="w-full sm:w-auto min-w-[140px] bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
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
                    <span>Adicionar {tab.name.slice(0, -1)}</span>
                  </button>
                </div>

                {/* Visualização Mobile (Cards) */}
                <div className="sm:hidden space-y-4">
                  {tab.data.map((item) =>
                    renderMobileCard(item, tab.hasDescription)
                  )}
                </div>

                {/* Visualização Desktop (Tabela) */}
                <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-200">
                  <div className="min-w-full inline-block align-middle">
                    <DataTable
                      data={tab.data}
                      columns={getColumns(tab.hasDescription)}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </div>
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Modal de Formulário */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${editingItem ? "Editar" : "Adicionar"} ${tabs[
          activeTab
        ].name.slice(0, -1)}`}
        size="md"
      >
        <FormLayout
          onSubmit={methods.handleSubmit(handleSubmit)}
          title={`${editingItem ? "Edição" : "Novo"} ${tabs[
            activeTab
          ].name.slice(0, -1)}`}
          submitText="Salvar"
          onCancel={() => setShowModal(false)}
        >
          <div className="space-y-4">
            <FormField label="Nome" className="space-y-2">
              <input
                type="text"
                {...methods.register("nome")}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                placeholder={(() => {
                  const tabName = tabs[activeTab].name.toLowerCase();
                  if (tabName === "bairros") return "Digite o nome do bairro";
                  if (tabName === "cidades") return "Digite o nome da cidade";
                  return `Digite o nome ${tabName.slice(0, -1)}`;
                })()}
              />
            </FormField>

            {tabs[activeTab].hasDescription && (
              <FormField label="Descrição" className="space-y-2">
                <textarea
                  {...methods.register("descricao")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  rows={3}
                  placeholder="Digite uma descrição"
                />
              </FormField>
            )}
          </div>
        </FormLayout>
      </Modal>
    </div>
  );
}
