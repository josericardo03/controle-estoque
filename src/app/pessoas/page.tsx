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
  const columns = [
    {
      accessorKey: "nome",
      header: "Nome",
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ row }: any) => {
        const tipo = row.getValue("tipo");
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-blue-100 text-blue-800">
            {tipo === "pf" ? "Pessoa Física" : "Pessoa Jurídica"}
          </div>
        );
      },
    },
    {
      accessorKey: "documento",
      header: "CPF/CNPJ",
    },
    {
      accessorKey: "telefone",
      header: "Telefone",
    },
    {
      accessorKey: "email",
      header: "Email",
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
      <div className="mb-6 md:mb-8">
        <Breadcrumb
          items={[{ label: "Pessoas", href: "/pessoas", active: true }]}
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 md:p-6 space-y-6">
          {/* Cabeçalho */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              Gestão de Pessoas
            </h2>
            <button
              onClick={() => {
                setPessoaParaEditar(null);
                methods.reset({});
                setShowModal(true);
              }}
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
              <span>Nova Pessoa</span>
            </button>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Buscar por nome..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <SelectInput
              name="tipo_filtro"
              options={tiposPessoa}
              placeholder="Filtrar por tipo"
            />
            <InputMask
              name="documento_filtro"
              mask="cpf"
              placeholder="CPF/CNPJ"
              width="full"
            />
          </div>

          {/* Tabela */}
          <DataTable
            data={pessoasMock}
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
