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
import { InputMask } from "@/Components/ui/input-mask";
import { ColumnDef, Row } from "@tanstack/react-table";

// Tipos
interface Pessoa {
  id: string;
  nome: string;
  tipo: "pf" | "pj";
  documento: string;
  telefone: string;
  email: string;
  dataNascimento?: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
}

// Dados mockados
const pessoasMock: Pessoa[] = [
  {
    id: "1",
    nome: "João Silva",
    tipo: "pf",
    documento: "123.456.789-00",
    telefone: "(11) 98765-4321",
    email: "joao@email.com",
    dataNascimento: "1990-01-01",
    endereco: {
      cep: "12345-678",
      logradouro: "Rua das Flores",
      numero: "123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
    },
  },
  {
    id: "2",
    nome: "Empresa XYZ Ltda",
    tipo: "pj",
    documento: "12.345.678/0001-90",
    telefone: "(11) 3456-7890",
    email: "contato@xyz.com",
    endereco: {
      cep: "12345-678",
      logradouro: "Avenida Principal",
      numero: "1000",
      complemento: "Sala 123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
    },
  },
];

const tiposPessoa = [
  { value: "pf", label: "Pessoa Física" },
  { value: "pj", label: "Pessoa Jurídica" },
];

const estados = [
  { value: "SP", label: "São Paulo" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "MG", label: "Minas Gerais" },
  // Adicione mais estados conforme necessário
];

export default function PessoasPage() {
  const [showModal, setShowModal] = useState(false);
  const [pessoaParaEditar, setPessoaParaEditar] = useState<Pessoa | null>(null);
  const methods = useForm();
  const tipoPessoa = methods.watch("tipo");

  // Colunas da tabela
  const columns: ColumnDef<Pessoa>[] = [
    {
      id: "nome",
      accessorKey: "nome",
      header: "Nome/Razão Social",
      cell: ({ row }: { row: Row<Pessoa> }) => {
        const pessoa = row.original;
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{pessoa.nome}</span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  pessoa.tipo === "pf"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {pessoa.tipo === "pf" ? "Pessoa Física" : "Pessoa Jurídica"}
              </span>
            </div>
            <span className="text-sm text-gray-500">{pessoa.email}</span>
          </div>
        );
      },
    },
    {
      id: "contato",
      accessorKey: "contato",
      header: "Contato",
      cell: ({ row }: { row: Row<Pessoa> }) => {
        const pessoa = row.original;
        return (
          <div className="hidden md:flex flex-col text-sm">
            <span className="text-gray-900">{pessoa.documento}</span>
            <span className="text-gray-500">{pessoa.telefone}</span>
          </div>
        );
      },
    },
    {
      id: "endereco",
      accessorKey: "endereco",
      header: "Endereço",
      cell: ({ row }: { row: Row<Pessoa> }) => {
        const endereco = row.original.endereco;
        return (
          <div className="hidden lg:flex flex-col text-sm">
            <span className="text-gray-900">{`${endereco.logradouro}, ${endereco.numero}`}</span>
            <span className="text-gray-500">{`${endereco.cidade} - ${endereco.estado}`}</span>
          </div>
        );
      },
    },
  ];

  const handleEdit = (pessoa: Pessoa) => {
    setPessoaParaEditar(pessoa);
    methods.reset(pessoa);
    setShowModal(true);
  };

  const handleDelete = (pessoa: Pessoa) => {
    // Implementar lógica de deleção
    console.log("Deletar:", pessoa);
  };

  const handleView = (pessoa: Pessoa) => {
    // Implementar lógica de visualização
    console.log("Visualizar:", pessoa);
  };

  const handleSubmit = (data: any) => {
    console.log("Dados do formulário:", data);
    setShowModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb
          items={[{ label: "Pessoas", href: "/pessoas", active: true }]}
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Cabeçalho */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900">
              Gestão de Pessoas
            </h1>
            <button
              onClick={() => {
                setPessoaParaEditar(null);
                methods.reset({});
                setShowModal(true);
              }}
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
              Nova Pessoa
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
                placeholder="Buscar pessoas..."
                className="pl-10 w-full rounded-lg border border-gray-300 bg-white py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <SelectInput
              name="tipo_filtro"
              options={tiposPessoa}
              placeholder="Tipo de pessoa"
              className="w-full"
            />
            <InputMask
              name="documento_filtro"
              mask="cpf"
              placeholder="CPF/CNPJ"
              className="w-full"
            />
            <SelectInput
              name="estado_filtro"
              options={estados}
              placeholder="Estado"
              className="w-full"
            />
          </div>
        </div>

        {/* Tabela para Desktop e Cards para Mobile */}
        <div className="w-full">
          {/* Versão Desktop */}
          <div className="hidden md:block">
            <DataTable
              data={pessoasMock}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          </div>

          {/* Cards Mobile */}
          <div className="md:hidden space-y-4">
            {pessoasMock.map((pessoa) => (
              <div key={pessoa.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {pessoa.nome}
                      </h3>
                      <p className="text-sm text-gray-500">{pessoa.email}</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        pessoa.tipo === "pf"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {pessoa.tipo === "pf"
                        ? "Pessoa Física"
                        : "Pessoa Jurídica"}
                    </span>
                  </div>

                  <div className="text-sm">
                    <p className="text-gray-900">{pessoa.documento}</p>
                    <p className="text-gray-500">{pessoa.telefone}</p>
                  </div>

                  <div className="text-sm">
                    <p className="text-gray-900">
                      {pessoa.endereco.logradouro}, {pessoa.endereco.numero}
                    </p>
                    <p className="text-gray-500">
                      {pessoa.endereco.cidade} - {pessoa.endereco.estado}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleView(pessoa)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="Visualizar"
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
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEdit(pessoa)}
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
                    <button
                      onClick={() => handleDelete(pessoa)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Excluir"
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
                        <path d="M3 6h18" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Formulário */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${pessoaParaEditar ? "Editar" : "Nova"} Pessoa`}
        size="xl"
      >
        <FormProvider {...methods}>
          <FormLayout
            onSubmit={methods.handleSubmit(handleSubmit)}
            title={`${pessoaParaEditar ? "Edição" : "Cadastro"} de Pessoa`}
            submitText="Salvar"
            onCancel={() => setShowModal(false)}
          >
            {/* Informações Básicas */}
            <FormSection title="Informações Básicas">
              <FormField label="Tipo de Pessoa" className="space-y-2">
                <SelectInput
                  name="tipo"
                  options={tiposPessoa}
                  placeholder="Selecione o tipo"
                />
              </FormField>

              <FormField label="Nome" className="space-y-2">
                <input
                  type="text"
                  {...methods.register("nome")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder={`Digite o nome ${
                    tipoPessoa === "pf" ? "completo" : "da empresa"
                  }`}
                />
              </FormField>

              <FormField
                label={tipoPessoa === "pf" ? "CPF" : "CNPJ"}
                className="space-y-2"
              >
                <InputMask
                  name="documento"
                  mask={tipoPessoa === "pf" ? "cpf" : "cnpj"}
                  placeholder={tipoPessoa === "pf" ? "CPF" : "CNPJ"}
                />
              </FormField>

              {tipoPessoa === "pf" && (
                <FormField label="Data de Nascimento" className="space-y-2">
                  <input
                    type="date"
                    {...methods.register("dataNascimento")}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </FormField>
              )}

              <FormField label="Telefone" className="space-y-2">
                <InputMask
                  name="telefone"
                  mask="telefone"
                  placeholder="Telefone"
                />
              </FormField>

              <FormField label="Email" className="space-y-2">
                <input
                  type="email"
                  {...methods.register("email")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Digite o email"
                />
              </FormField>
            </FormSection>

            {/* Endereço */}
            <FormSection title="Endereço">
              <FormField label="CEP" className="space-y-2">
                <InputMask name="endereco.cep" mask="cep" placeholder="CEP" />
              </FormField>

              <FormField label="Logradouro" className="space-y-2 col-span-2">
                <input
                  type="text"
                  {...methods.register("endereco.logradouro")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Digite o logradouro"
                />
              </FormField>

              <FormField label="Número" className="space-y-2">
                <input
                  type="text"
                  {...methods.register("endereco.numero")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Número"
                />
              </FormField>

              <FormField label="Complemento" className="space-y-2">
                <input
                  type="text"
                  {...methods.register("endereco.complemento")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Complemento (opcional)"
                />
              </FormField>

              <FormField label="Bairro" className="space-y-2">
                <input
                  type="text"
                  {...methods.register("endereco.bairro")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Digite o bairro"
                />
              </FormField>

              <FormField label="Estado" className="space-y-2">
                <SelectInput
                  name="endereco.estado"
                  options={estados}
                  placeholder="Selecione o estado"
                />
              </FormField>

              <FormField label="Cidade" className="space-y-2">
                <input
                  type="text"
                  {...methods.register("endereco.cidade")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Digite a cidade"
                />
              </FormField>
            </FormSection>
          </FormLayout>
        </FormProvider>
      </Modal>
    </div>
  );
}
