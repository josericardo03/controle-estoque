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
import { pessoaService, Pessoa } from "@/services/pessoaService";

// Tipos
interface SelectOption {
  value: string;
  label: string;
}

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
  const [pessoaParaEditar, setPessoaParaEditar] = useState<Pessoa | null>(null);
  const [pessoaParaVisualizar, setPessoaParaVisualizar] =
    useState<Pessoa | null>(null);
  const [cidades, setCidades] = useState<SelectOption[]>([]);
  const [bairros, setBairros] = useState<SelectOption[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const methods = useForm();
  const selectedEstado = methods.watch(
    "fkEndereco.bairro.fkCidade.fkEstado.id"
  );
  const selectedCidade = methods.watch("fkEndereco.bairro.fkCidade.id");

  // Carregar lista de pessoas
  useEffect(() => {
    const carregarPessoas = async () => {
      try {
        const data = await pessoaService.listar();
        setPessoas(data);
      } catch (error) {
        console.error("Erro ao carregar pessoas:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarPessoas();
  }, []);

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
          "fkEndereco.bairro.fkCidade.fkEstado.nome",
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
          "fkEndereco.bairro.fkCidade.nome",
          cidadeSelecionada.label
        );
      }
    } else {
      setBairros([]);
    }
  }, [selectedCidade, methods, cidades]);

  // Atualizar o nome do bairro quando selecionado
  const selectedBairro = methods.watch("fkEndereco.bairro.id");
  useEffect(() => {
    if (selectedBairro) {
      const bairroSelecionado = bairros.find((b) => b.value === selectedBairro);
      if (bairroSelecionado) {
        methods.setValue("fkEndereco.bairro.nome", bairroSelecionado.label);
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
                  pessoa.cpf
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {pessoa.cpf ? "PF" : "PJ"}
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
              {pessoa.cpf || pessoa.cnpj}
            </span>
          </div>
        );
      },
    },
    {
      id: "endereco",
      accessorKey: "fkEndereco",
      header: "Endereço",
      cell: ({ row }: { row: Row<Pessoa> }) => {
        const endereco = row.original.fkEndereco;
        if (!endereco) {
          return (
            <div className="hidden lg:flex flex-col text-sm">
              <span className="text-gray-500">Endereço não cadastrado</span>
            </div>
          );
        }
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

  const handleDelete = async (pessoa: Pessoa) => {
    if (window.confirm("Tem certeza que deseja excluir esta pessoa?")) {
      try {
        await pessoaService.excluir(pessoa.id);

        // Recarregar a lista de pessoas
        const pessoasAtualizadas = await pessoaService.listar();
        setPessoas(pessoasAtualizadas);
      } catch (error) {
        console.error("Erro ao excluir pessoa:", error);
        alert("Erro ao excluir pessoa. Por favor, tente novamente.");
      }
    }
  };

  const handleView = (pessoa: Pessoa) => {
    setPessoaParaVisualizar(pessoa);
    setShowViewModal(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      // Transformar os dados para o formato esperado
      const formattedData = {
        ...data,
        id: data.id ? Number(data.id) : undefined,
        fkEndereco: {
          ...data.fkEndereco,
          id: data.fkEndereco?.id ? Number(data.fkEndereco.id) : undefined,
          bairro: {
            id: Number(data.fkEndereco.bairro.id),
            nome: data.fkEndereco.bairro.nome,
            fkCidade: {
              id: Number(data.fkEndereco.bairro.fkCidade.id),
              nome: data.fkEndereco.bairro.fkCidade.nome,
              fkEstado: {
                id: Number(data.fkEndereco.bairro.fkCidade.fkEstado.id),
                nome: data.fkEndereco.bairro.fkCidade.fkEstado.nome,
              },
            },
          },
        },
      };

      if (pessoaParaEditar) {
        await pessoaService.atualizar(pessoaParaEditar.id, formattedData);
      } else {
        await pessoaService.criar(formattedData);
      }

      // Recarregar a lista de pessoas
      const pessoasAtualizadas = await pessoaService.listar();
      setPessoas(pessoasAtualizadas);

      setShowModal(false);
    } catch (error) {
      console.error("Erro ao salvar pessoa:", error);
      alert("Erro ao salvar pessoa. Por favor, tente novamente.");
    }
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
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Carregando...</p>
              </div>
            ) : (
              <DataTable
                data={pessoas}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            )}
          </div>

          {/* Cards Mobile */}
          <div className="md:hidden space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Carregando...</p>
              </div>
            ) : pessoas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma pessoa cadastrada.</p>
              </div>
            ) : (
              pessoas.map((pessoa) => (
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
                          pessoa.cpf
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {pessoa.cpf ? "PF" : "PJ"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                          {pessoa.cpf ? "CPF" : "CNPJ"}
                        </p>
                        <p className="text-gray-900 font-mono">
                          {pessoa.cpf || pessoa.cnpj}
                        </p>
                      </div>
                      {pessoa.dataNascimento && (
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                            Data de Nascimento
                          </p>
                          <p className="text-gray-900">
                            {pessoa.dataNascimento}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="text-sm">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                        Endereço
                      </p>
                      {pessoa.fkEndereco ? (
                        <>
                          <p className="text-gray-900">
                            {pessoa.fkEndereco.logradouro},{" "}
                            {pessoa.fkEndereco.numero}
                          </p>
                          <p className="text-gray-500">
                            {pessoa.fkEndereco.bairro.fkCidade.nome} -{" "}
                            {pessoa.fkEndereco.bairro.fkCidade.fkEstado.nome}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500">Endereço não cadastrado</p>
                      )}
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
              ))
            )}
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
              <FormField label="Nome" className="space-y-2">
                <input
                  type="text"
                  {...methods.register("nome")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Digite o nome completo"
                />
              </FormField>

              <FormField label="CPF" className="space-y-2">
                <InputMask name="cpf" mask="cpf" placeholder="CPF" />
              </FormField>

              <FormField label="CNPJ" className="space-y-2">
                <InputMask name="cnpj" mask="cnpj" placeholder="CNPJ" />
              </FormField>

              <FormField label="Data de Nascimento" className="space-y-2">
                <input
                  type="date"
                  {...methods.register("dataNascimento")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
                <InputMask name="fkEndereco.cep" mask="cep" placeholder="CEP" />
              </FormField>

              <FormField label="Logradouro" className="space-y-2 col-span-2">
                <input
                  type="text"
                  {...methods.register("fkEndereco.logradouro")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Digite o logradouro"
                />
              </FormField>

              <FormField label="Número" className="space-y-2">
                <input
                  type="text"
                  {...methods.register("fkEndereco.numero")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Número"
                />
              </FormField>

              <FormField label="Complemento" className="space-y-2">
                <input
                  type="text"
                  {...methods.register("fkEndereco.complemento")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Complemento (opcional)"
                />
              </FormField>

              <FormField label="Estado">
                <SelectInput
                  name="fkEndereco.bairro.fkCidade.fkEstado.id"
                  options={estados}
                  placeholder="Selecione o estado"
                />
              </FormField>

              <FormField label="Cidade">
                <SelectInput
                  name="fkEndereco.bairro.fkCidade.id"
                  options={selectedEstado ? cidades : []}
                  placeholder="Selecione a cidade"
                />
              </FormField>

              <FormField label="Bairro">
                <SelectInput
                  name="fkEndereco.bairro.id"
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
                    {pessoaParaVisualizar.cpf
                      ? "Pessoa Física"
                      : "Pessoa Jurídica"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {pessoaParaVisualizar.cpf ? "CPF" : "CNPJ"}
                  </p>
                  <p className="text-gray-900">
                    {pessoaParaVisualizar.cpf || pessoaParaVisualizar.cnpj}
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
                {pessoaParaVisualizar.fkEndereco ? (
                  <>
                    <p className="text-gray-900">
                      {pessoaParaVisualizar.fkEndereco.logradouro},{" "}
                      {pessoaParaVisualizar.fkEndereco.numero}
                      {pessoaParaVisualizar.fkEndereco.complemento &&
                        ` - ${pessoaParaVisualizar.fkEndereco.complemento}`}
                    </p>
                    <p className="text-gray-900">
                      {pessoaParaVisualizar.fkEndereco.bairro.nome} -{" "}
                      {pessoaParaVisualizar.fkEndereco.bairro.fkCidade.nome}/
                      {
                        pessoaParaVisualizar.fkEndereco.bairro.fkCidade.fkEstado
                          .nome
                      }
                    </p>
                    <p className="text-gray-900">
                      CEP: {pessoaParaVisualizar.fkEndereco.cep}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500">Endereço não cadastrado</p>
                )}
              </div>
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
