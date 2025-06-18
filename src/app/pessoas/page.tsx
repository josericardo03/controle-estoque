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

interface HistoricoCompra {
  id: string;
  data: string;
  tipo: "compra" | "venda";
  valor: number;
  itens: string[];
  formaPagamento: string;
  caixa: string;
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

// Histórico de compras mockado
const historicoComprasMock: { [pessoaId: string]: HistoricoCompra[] } = {
  "1": [
    {
      id: "1",
      data: "01/03/2024 14:30",
      tipo: "venda",
      valor: 150.0,
      itens: ["Produto A", "Produto B"],
      formaPagamento: "Cartão de Crédito",
      caixa: "Caixa 1",
    },
    {
      id: "2",
      data: "28/02/2024 10:15",
      tipo: "venda",
      valor: 75.5,
      itens: ["Produto C"],
      formaPagamento: "Dinheiro",
      caixa: "Caixa 2",
    },
  ],
  "2": [
    {
      id: "3",
      data: "01/03/2024 09:00",
      tipo: "compra",
      valor: 2500.0,
      itens: ["Materiais de escritório", "Equipamentos"],
      formaPagamento: "Boleto",
      caixa: "Caixa 1",
    },
  ],
};

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
  const [showViewModal, setShowViewModal] = useState(false);
  const [pessoaParaEditar, setPessoaParaEditar] = useState<Pessoa | null>(null);
  const [pessoaParaVisualizar, setPessoaParaVisualizar] =
    useState<Pessoa | null>(null);
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
                {pessoa.tipo === "pf" ? "PF" : "PJ"}
              </span>
            </div>
            <span className="text-sm text-gray-500">{pessoa.email}</span>
          </div>
        );
      },
    },
    {
      id: "documento",
      accessorKey: "documento",
      header: "CPF/CNPJ",
      cell: ({ row }: { row: Row<Pessoa> }) => {
        const pessoa = row.original;
        return (
          <div className="hidden md:block">
            <span className="text-sm text-gray-900 font-mono">
              {pessoa.documento}
            </span>
          </div>
        );
      },
    },
    {
      id: "telefone",
      accessorKey: "telefone",
      header: "Telefone",
      cell: ({ row }: { row: Row<Pessoa> }) => {
        const pessoa = row.original;
        return (
          <div className="hidden md:block">
            <span className="text-sm text-gray-900">{pessoa.telefone}</span>
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
    setPessoaParaVisualizar(pessoa);
    setShowViewModal(true);
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
                <div className="flex flex-col gap-3">
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
                      {pessoa.tipo === "pf" ? "PF" : "PJ"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        {pessoa.tipo === "pf" ? "CPF" : "CNPJ"}
                      </p>
                      <p className="text-gray-900 font-mono">
                        {pessoa.documento}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        Telefone
                      </p>
                      <p className="text-gray-900">{pessoa.telefone}</p>
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                      Endereço
                    </p>
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

      {/* Modal de Visualização com Histórico */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title={`Visualizar Pessoa - ${pessoaParaVisualizar?.nome}`}
        size="xl"
      >
        {pessoaParaVisualizar && (
          <div className="space-y-6">
            {/* Informações da Pessoa */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">
                Informações da Pessoa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Nome</p>
                  <p className="text-gray-900">{pessoaParaVisualizar.nome}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Tipo</p>
                  <p className="text-gray-900">
                    {pessoaParaVisualizar.tipo === "pf"
                      ? "Pessoa Física"
                      : "Pessoa Jurídica"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {pessoaParaVisualizar.tipo === "pf" ? "CPF" : "CNPJ"}
                  </p>
                  <p className="text-gray-900">
                    {pessoaParaVisualizar.documento}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Telefone</p>
                  <p className="text-gray-900">
                    {pessoaParaVisualizar.telefone}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-gray-900">{pessoaParaVisualizar.email}</p>
                </div>
                {pessoaParaVisualizar.dataNascimento && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Data de Nascimento
                    </p>
                    <p className="text-gray-900">
                      {pessoaParaVisualizar.dataNascimento}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">Endereço</p>
                <p className="text-gray-900">
                  {pessoaParaVisualizar.endereco.logradouro},{" "}
                  {pessoaParaVisualizar.endereco.numero}
                  {pessoaParaVisualizar.endereco.complemento &&
                    ` - ${pessoaParaVisualizar.endereco.complemento}`}
                </p>
                <p className="text-gray-900">
                  {pessoaParaVisualizar.endereco.bairro} -{" "}
                  {pessoaParaVisualizar.endereco.cidade}/
                  {pessoaParaVisualizar.endereco.estado}
                </p>
                <p className="text-gray-900">
                  CEP: {pessoaParaVisualizar.endereco.cep}
                </p>
              </div>
            </div>

            {/* Histórico de Compras */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Histórico de Compras e Vendas
              </h3>
              {historicoComprasMock[pessoaParaVisualizar.id] ? (
                <div className="space-y-3">
                  {historicoComprasMock[pessoaParaVisualizar.id].map(
                    (historico) => (
                      <div
                        key={historico.id}
                        className={`border rounded-lg p-4 ${
                          historico.tipo === "venda"
                            ? "border-green-200 bg-green-50"
                            : "border-blue-200 bg-blue-50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className={`px-2 py-1 text-xs rounded-full font-medium ${
                                  historico.tipo === "venda"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {historico.tipo === "venda"
                                  ? "Venda"
                                  : "Compra"}
                              </span>
                              <span className="text-sm text-gray-600">
                                {historico.data}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm">
                                <span className="font-medium">Valor:</span> R${" "}
                                {historico.valor.toFixed(2)}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">
                                  Forma de Pagamento:
                                </span>{" "}
                                {historico.formaPagamento}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Caixa:</span>{" "}
                                {historico.caixa}
                              </p>
                              <div>
                                <p className="text-sm font-medium">Itens:</p>
                                <ul className="text-sm text-gray-600 ml-4">
                                  {historico.itens.map((item, index) => (
                                    <li key={index}>• {item}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum histórico de compras ou vendas encontrado.</p>
                </div>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(pessoaParaVisualizar);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Editar Pessoa
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
