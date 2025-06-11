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
  ];

  // Colunas da tabela
  const getColumns = (hasDescription: boolean) => {
    const baseColumns = [
      {
        accessorKey: "nome",
        header: "Nome",
      },
      {
        accessorKey: "quantidadeProdutos",
        header: "Produtos Vinculados",
      },
    ];

    if (hasDescription) {
      baseColumns.splice(1, 0, {
        accessorKey: "descricao",
        header: "Descrição",
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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Breadcrumb
          items={[
            { label: "Configurações", href: "/configuracoes", active: true },
          ]}
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="bg-white rounded-lg shadow">
        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          {/* Cabeçalho com Tabs */}
          <div className="border-b border-gray-200">
            <Tab.List className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    cn(
                      "py-4 text-sm font-medium border-b-2 outline-none",
                      selected
                        ? "text-blue-600 border-blue-600"
                        : "text-gray-500 border-transparent hover:text-blue-600 hover:border-blue-600"
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
              <Tab.Panel key={idx} className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Gestão de {tab.name}
                  </h2>
                  <button
                    onClick={handleAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Adicionar {tab.name.slice(0, -1)}
                  </button>
                </div>

                <DataTable
                  data={tab.data}
                  columns={getColumns(tab.hasDescription)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
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
            <FormField label="Nome" className="space-y-1">
              <input
                type="text"
                {...methods.register("nome")}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                placeholder={`Digite o nome ${tabs[activeTab].name
                  .toLowerCase()
                  .slice(0, -1)}`}
              />
            </FormField>

            {tabs[activeTab].hasDescription && (
              <FormField label="Descrição" className="space-y-1">
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
