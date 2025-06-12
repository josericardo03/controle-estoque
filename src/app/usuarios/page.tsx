"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Breadcrumb } from "@/Components/ui/breadcrumb";
import { DataTable } from "@/Components/ui/data-table";
import { Modal } from "@/Components/ui/modal";
import { FormLayout, FormField } from "@/Components/ui/form-layout";
import { SelectInput } from "@/Components/ui/select";
import { ColumnDef } from "@tanstack/react-table";

// Tipos e Dados
interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: "admin" | "vendedor" | "estoquista";
  status: "ativo" | "inativo";
}

const tiposUsuario = [
  { value: "admin", label: "Administrador" },
  { value: "vendedor", label: "Vendedor" },
  { value: "estoquista", label: "Estoquista" },
];

const statusOptions = [
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
];

// Dados de exemplo
const dadosExemplo: Usuario[] = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao.silva@exemplo.com",
    tipo: "admin",
    status: "ativo",
  },
  {
    id: "2",
    nome: "Maria Santos",
    email: "maria.santos@exemplo.com",
    tipo: "vendedor",
    status: "ativo",
  },
  {
    id: "3",
    nome: "Pedro Oliveira",
    email: "pedro.oliveira@exemplo.com",
    tipo: "estoquista",
    status: "inativo",
  },
];

export default function UsuariosPage() {
  const [showModal, setShowModal] = useState(false);
  const [usuarioParaEditar, setUsuarioParaEditar] = useState<Usuario | null>(
    null
  );
  const methods = useForm();

  // Colunas da tabela
  const columns: ColumnDef<Usuario>[] = [
    {
      id: "nome",
      accessorKey: "nome",
      header: "Nome",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">{row.original.nome}</div>
      ),
    },
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-gray-600">{row.original.email}</div>
      ),
    },
    {
      id: "tipo",
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {tiposUsuario.find((t) => t.value === row.original.tipo)?.label}
        </div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              row.original.status === "ativo"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full mr-1.5 ${
                row.original.status === "ativo" ? "bg-green-400" : "bg-red-400"
              }`}
            ></span>
            {row.original.status === "ativo" ? "Ativo" : "Inativo"}
          </span>
        </div>
      ),
    },
  ];

  const handleSubmit = (data: any) => {
    console.log("Dados do formulário:", data);
    setShowModal(false);
  };

  const handleEdit = (usuario: Usuario) => {
    setUsuarioParaEditar(usuario);
    methods.reset(usuario);
    setShowModal(true);
  };

  const handleDelete = (usuario: Usuario) => {
    console.log("Deletar:", usuario);
  };

  // Renderiza os cards para visualização mobile
  const renderMobileCards = () => {
    return (
      <div className="grid grid-cols-1 gap-4 sm:hidden">
        {dadosExemplo.map((usuario) => (
          <div
            key={usuario.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {usuario.nome}
                </h3>
                <p className="text-sm text-gray-500">{usuario.email}</p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  usuario.status === "ativo"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full mr-1.5 ${
                    usuario.status === "ativo" ? "bg-green-400" : "bg-red-400"
                  }`}
                ></span>
                {usuario.status === "ativo" ? "Ativo" : "Inativo"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {tiposUsuario.find((t) => t.value === usuario.tipo)?.label}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(usuario)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(usuario)}
                  className="text-red-600 hover:text-red-800"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Início", href: "/" },
              { label: "Usuários", href: "/usuarios", active: true },
            ]}
          />
        </div>

        {/* Conteúdo Principal */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Cabeçalho */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Gestão de Usuários
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Gerencie os usuários do sistema e suas permissões
                </p>
              </div>
              <button
                onClick={() => {
                  setUsuarioParaEditar(null);
                  methods.reset({});
                  setShowModal(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
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
                Novo Usuário
              </button>
            </div>
          </div>

          {/* Visualização Mobile (Cards) */}
          {renderMobileCards()}

          {/* Visualização Desktop (Tabela) */}
          <div className="hidden sm:block">
            <DataTable
              data={dadosExemplo}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      {/* Modal de Formulário */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${usuarioParaEditar ? "Editar" : "Novo"} Usuário`}
        size="md"
      >
        <FormProvider {...methods}>
          <FormLayout
            onSubmit={methods.handleSubmit(handleSubmit)}
            title={`${usuarioParaEditar ? "Edição" : "Cadastro"} de Usuário`}
            submitText="Salvar"
            onCancel={() => setShowModal(false)}
          >
            <div className="grid gap-6">
              <FormField label="Nome" className="space-y-2">
                <input
                  type="text"
                  {...methods.register("nome", { required: true })}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Digite o nome"
                />
              </FormField>

              <FormField label="Email" className="space-y-2">
                <input
                  type="email"
                  {...methods.register("email", { required: true })}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Digite o email"
                />
              </FormField>

              {!usuarioParaEditar && (
                <FormField label="Senha" className="space-y-2">
                  <input
                    type="password"
                    {...methods.register("senha", {
                      required: !usuarioParaEditar,
                    })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    placeholder="Digite a senha"
                  />
                </FormField>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Tipo" className="space-y-2">
                  <SelectInput
                    name="tipo"
                    options={tiposUsuario}
                    placeholder="Selecione o tipo"
                  />
                </FormField>

                <FormField label="Status" className="space-y-2">
                  <SelectInput
                    name="status"
                    options={statusOptions}
                    placeholder="Selecione o status"
                  />
                </FormField>
              </div>
            </div>
          </FormLayout>
        </FormProvider>
      </Modal>
    </div>
  );
}
