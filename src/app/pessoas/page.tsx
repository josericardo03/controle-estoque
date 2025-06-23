"use client";

import { useState, useEffect } from "react";
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
interface SelectOption {
  value: string;
  label: string;
}

interface Pessoa {
  id: string;
  nome: string;
  tipo: "pf" | "pj";
  documento: string;
  telefone: string;
  email: string;
  dataNascimento?: string;
  endereco: {
    id?: number;
    logradouro: string;
    numero: string;
    complemento?: string;
    cep: string;
    bairro: {
      id: number;
      nome: string;
      fkCidade: {
        id: number;
        nome: string;
        fkEstado: {
          id: number;
          nome: string;
        };
      };
    };
  };
}

interface HistoricoCompra {
  id: string;
  data: string;
  tipo: "compra" | "venda";
  valor: number;
  vendedor: string;
  entregador: string;
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
      bairro: {
        id: 1,
        nome: "Centro",
        fkCidade: {
          id: 1,
          nome: "São Paulo",
          fkEstado: {
            id: 1,
            nome: "SP",
          },
        },
      },
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
      bairro: {
        id: 1,
        nome: "Centro",
        fkCidade: {
          id: 1,
          nome: "São Paulo",
          fkEstado: {
            id: 1,
            nome: "SP",
          },
        },
      },
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
      vendedor: "João Silva",
      entregador: "Carlos Santos",
      formaPagamento: "Cartão de Crédito",
      caixa: "Caixa 1",
    },
    {
      id: "2",
      data: "28/02/2024 10:15",
      tipo: "venda",
      valor: 75.5,
      vendedor: "Maria Oliveira",
      entregador: "Pedro Costa",
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
      vendedor: "Ana Ferreira",
      entregador: "Roberto Lima",
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
  { value: "4", label: "Mato Grosso" },
  { value: "25", label: "São Paulo" },
  { value: "19", label: "Rio de Janeiro" },
  { value: "13", label: "Minas Gerais" },
];

export default function PessoasPage() {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showVendaModal, setShowVendaModal] = useState(false);
  const [pessoaParaEditar, setPessoaParaEditar] = useState<Pessoa | null>(null);
  const [pessoaParaVisualizar, setPessoaParaVisualizar] =
    useState<Pessoa | null>(null);
  const [vendaParaVisualizar, setVendaParaVisualizar] = useState<any>(null);
  const [cidades, setCidades] = useState<SelectOption[]>([]);
  const [bairros, setBairros] = useState<SelectOption[]>([]);
  const methods = useForm();
  const tipoPessoa = methods.watch("tipo");
  const selectedEstado = methods.watch("endereco.bairro.fkCidade.fkEstado.id");
  const selectedCidade = methods.watch("endereco.bairro.fkCidade.id");

  // Carregar cidades quando o estado for selecionado
  useEffect(() => {
    if (selectedEstado) {
      // Aqui você deve fazer a chamada à API para buscar as cidades do estado selecionado
      // Por enquanto, vamos usar dados mockados
      const cidadesMock = [
        { value: "5", label: "Cuiabá" },
        { value: "6", label: "Várzea Grande" },
      ];
      setCidades(cidadesMock);

      // Atualizar o nome do estado no formulário
      const estadoSelecionado = estados.find((e) => e.value === selectedEstado);
      if (estadoSelecionado) {
        methods.setValue(
          "endereco.bairro.fkCidade.fkEstado.nome",
          estadoSelecionado.label
        );
      }
    } else {
      setCidades([]);
    }
  }, [selectedEstado, methods, estados]);

  // Carregar bairros quando a cidade for selecionada
  useEffect(() => {
    if (selectedCidade) {
      // Aqui você deve fazer a chamada à API para buscar os bairros da cidade selecionada
      // Por enquanto, vamos usar dados mockados
      const bairrosMock = [
        { value: "4", label: "Centro Norte" },
        { value: "5", label: "Centro Sul" },
      ];
      setBairros(bairrosMock);

      // Atualizar o nome da cidade no formulário
      const cidadeSelecionada = cidades.find((c) => c.value === selectedCidade);
      if (cidadeSelecionada) {
        methods.setValue(
          "endereco.bairro.fkCidade.nome",
          cidadeSelecionada.label
        );
      }
    } else {
      setBairros([]);
    }
  }, [selectedCidade, methods, cidades]);

  // Atualizar o nome do bairro quando selecionado
  const selectedBairro = methods.watch("endereco.bairro.id");
  useEffect(() => {
    if (selectedBairro) {
      const bairroSelecionado = bairros.find((b) => b.value === selectedBairro);
      if (bairroSelecionado) {
        methods.setValue("endereco.bairro.nome", bairroSelecionado.label);
      }
    }
  }, [selectedBairro, methods, bairros]);

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
            <span className="text-gray-500">{`${endereco.bairro.fkCidade.nome} - ${endereco.bairro.fkCidade.fkEstado.nome}`}</span>
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

  const handleViewVenda = (historico: HistoricoCompra) => {
    // Converter o histórico para o formato de venda similar ao do caixa
    const venda = {
      id: historico.id,
      tipo: historico.tipo,
      data: historico.data,
      cliente: pessoaParaVisualizar,
      fornecedor: historico.tipo === "compra" ? pessoaParaVisualizar : null,
      itens: [
        {
          id: "1",
          codigo: "VENDA",
          produto: `${historico.tipo === "venda" ? "Venda" : "Compra"} - ${
            historico.vendedor
          }`,
          quantidade: 1,
          precoUnitario: historico.valor,
          subtotal: historico.valor,
        },
      ],
      pagamentos: [
        {
          forma: historico.formaPagamento,
          valor: historico.valor,
        },
      ],
      total: historico.valor,
      vendedor: historico.vendedor,
      entregador: historico.entregador,
    };
    setVendaParaVisualizar(venda);
    setShowVendaModal(true);
  };

  const handleSubmit = (data: any) => {
    // Transformar os dados para o formato esperado
    const formattedData = {
      ...data,
      endereco: {
        ...data.endereco,
        bairro: {
          id: data.endereco.bairro.id,
          nome: data.endereco.bairro.nome,
          fkCidade: {
            id: data.endereco.bairro.fkCidade.id,
            nome: data.endereco.bairro.fkCidade.nome,
            fkEstado: {
              id: data.endereco.bairro.fkCidade.fkEstado.id,
              nome: data.endereco.bairro.fkCidade.fkEstado.nome,
            },
          },
        },
      },
    };
    console.log("Dados do formulário:", formattedData);
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
                      {pessoa.endereco.bairro.fkCidade.nome} -{" "}
                      {pessoa.endereco.bairro.fkCidade.fkEstado.nome}
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

              <FormField label="Estado">
                <SelectInput
                  name="endereco.bairro.fkCidade.fkEstado.id"
                  options={estados}
                  placeholder="Selecione o estado"
                />
              </FormField>

              <FormField label="Cidade">
                <SelectInput
                  name="endereco.bairro.fkCidade.id"
                  options={selectedEstado ? cidades : []}
                  placeholder="Selecione a cidade"
                />
              </FormField>

              <FormField label="Bairro">
                <SelectInput
                  name="endereco.bairro.id"
                  options={selectedCidade ? bairros : []}
                  placeholder="Selecione o bairro"
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
                  {pessoaParaVisualizar.endereco.bairro.nome} -{" "}
                  {pessoaParaVisualizar.endereco.bairro.fkCidade.nome}/
                  {pessoaParaVisualizar.endereco.bairro.fkCidade.fkEstado.nome}
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
                                <p className="text-sm font-medium">Vendedor:</p>
                                <p className="text-sm text-gray-600 ml-4">
                                  {historico.vendedor}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  Entregador:
                                </p>
                                <p className="text-sm text-gray-600 ml-4">
                                  {historico.entregador}
                                </p>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleViewVenda(historico)}
                            className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Ver detalhes"
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

      {/* Modal de Visualização da Venda */}
      {showVendaModal && vendaParaVisualizar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Detalhes da{" "}
                {vendaParaVisualizar.tipo === "venda" ? "Venda" : "Compra"}
              </h2>
              <button
                onClick={() => setShowVendaModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Informações Gerais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data
                  </label>
                  <p className="text-gray-900">{vendaParaVisualizar.data}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Operação
                  </label>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      vendaParaVisualizar.tipo === "venda"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {vendaParaVisualizar.tipo === "venda" ? "Venda" : "Compra"}
                  </span>
                </div>
              </div>

              {/* Cliente/Fornecedor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {vendaParaVisualizar.tipo === "venda"
                    ? "Cliente"
                    : "Fornecedor"}
                </label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Nome</p>
                      <p className="text-gray-900">
                        {vendaParaVisualizar.cliente?.nome ||
                          vendaParaVisualizar.fornecedor?.nome}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-gray-900">
                        {vendaParaVisualizar.cliente?.email ||
                          vendaParaVisualizar.fornecedor?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Telefone
                      </p>
                      <p className="text-gray-900">
                        {vendaParaVisualizar.cliente?.telefone ||
                          vendaParaVisualizar.fornecedor?.telefone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {vendaParaVisualizar.cliente?.cpf ? "CPF" : "CNPJ"}
                      </p>
                      <p className="text-gray-900">
                        {vendaParaVisualizar.cliente?.cpf ||
                          vendaParaVisualizar.fornecedor?.cnpj}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vendedor e Entregador */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendedor
                  </label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-900">
                      {vendaParaVisualizar.vendedor}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entregador
                  </label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-900">
                      {vendaParaVisualizar.entregador}
                    </p>
                  </div>
                </div>
              </div>

              {/* Produtos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detalhes da Operação
                </label>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Código
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Descrição
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantidade
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Preço Unit.
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {vendaParaVisualizar.itens.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {item.codigo}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {item.produto}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {item.quantidade}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            R$ {item.precoUnitario.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            R$ {item.subtotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagamentos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formas de Pagamento
                </label>
                <div className="space-y-2">
                  {vendaParaVisualizar.pagamentos.map(
                    (pagamento: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {pagamento.forma}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              R$ {pagamento.valor.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    R$ {vendaParaVisualizar.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  onClick={() => setShowVendaModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    const email =
                      vendaParaVisualizar.cliente?.email ||
                      vendaParaVisualizar.fornecedor?.email;
                    if (email) {
                      window.location.href = `mailto:${email}?subject=Detalhes da ${
                        vendaParaVisualizar.tipo === "venda"
                          ? "Venda"
                          : "Compra"
                      }&body=Detalhes da operação:%0D%0A%0D%0A${vendaParaVisualizar.itens
                        .map(
                          (item: any) =>
                            `- ${item.produto}: ${
                              item.quantidade
                            }x R$ ${item.subtotal.toFixed(2)}`
                        )
                        .join(
                          "%0D%0A"
                        )}%0D%0A%0D%0ATotal: R$ ${vendaParaVisualizar.total.toFixed(
                        2
                      )}`;
                    } else {
                      alert("Email não disponível para esta operação");
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Enviar Email
                </button>
                <button
                  onClick={() => {
                    alert(
                      "Funcionalidade de emissão de nota fiscal será implementada em breve"
                    );
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Emitir NF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
