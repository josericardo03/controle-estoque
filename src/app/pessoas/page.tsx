"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Breadcrumb } from "@/Components/ui/breadcrumb";
import { DataTable } from "@/Components/ui/data-table";
import { Modal } from "@/Components/ui/modal";
import { ErrorModal } from "@/Components/ui/error-modal";
import {
  FormLayout,
  FormField,
  FormSection,
} from "@/Components/ui/form-layout";
import { SelectInput } from "@/Components/ui/select";
import { InputMask } from "@/Components/ui/input-mask";
import { ColumnDef, Row } from "@tanstack/react-table";
import {
  pessoaService,
  Pessoa,
  CriarPessoaPayload,
  AtualizarPessoaPayload,
} from "@/services/pessoaService";
import {
  enderecoService,
  Estado,
  Cidade,
  Bairro,
  CriarBairroPayload,
  CriarEnderecoPayload,
} from "@/services/enderecoService";
import { detectDuplicateError, ErrorInfo } from "@/utils/errorHandler";

// Tipos
interface SelectOption {
  value: string;
  label: string;
}

const tiposPessoa = [
  { value: "pf", label: "Pessoa Física" },
  { value: "pj", label: "Pessoa Jurídica" },
];

const tiposLogradouro = [
  { value: "Rua", label: "Rua" },
  { value: "Avenida", label: "Avenida" },
  { value: "Travessa", label: "Travessa" },
  { value: "Alameda", label: "Alameda" },
  { value: "Praça", label: "Praça" },
];

export default function PessoasPage() {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showBairroModal, setShowBairroModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);
  const [pessoaParaEditar, setPessoaParaEditar] = useState<Pessoa | null>(null);
  const [pessoaParaVisualizar, setPessoaParaVisualizar] =
    useState<Pessoa | null>(null);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [cidadesFiltradas, setCidadesFiltradas] = useState<SelectOption[]>([]);
  const [bairrosFiltrados, setBairrosFiltrados] = useState<SelectOption[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [pessoasFiltradas, setPessoasFiltradas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEndereco, setLoadingEndereco] = useState(false);
  const [loadingBairro, setLoadingBairro] = useState(false);
  const [novoBairroNome, setNovoBairroNome] = useState("");

  // Estados para filtros
  const [filtros, setFiltros] = useState({
    busca: "",
    tipo: "",
    documento: "",
    estado: "",
  });

  const methods = useForm();

  // Função para aplicar filtros
  const aplicarFiltros = useCallback(() => {
    let resultado = [...pessoas];

    // Filtro por busca (nome, email)
    if (filtros.busca) {
      const termoBusca = filtros.busca.toLowerCase();
      resultado = resultado.filter(
        (pessoa) =>
          pessoa.nome.toLowerCase().includes(termoBusca) ||
          pessoa.email.toLowerCase().includes(termoBusca)
      );
    }

    // Filtro por tipo de pessoa (PF/PJ)
    if (filtros.tipo) {
      if (filtros.tipo === "pf") {
        resultado = resultado.filter((pessoa) => pessoa.cpf);
      } else if (filtros.tipo === "pj") {
        resultado = resultado.filter((pessoa) => pessoa.cnpj);
      }
    }

    // Filtro por documento (CPF/CNPJ)
    if (filtros.documento) {
      const documentoLimpo = filtros.documento.replace(/\D/g, "");
      resultado = resultado.filter(
        (pessoa) =>
          (pessoa.cpf && pessoa.cpf.includes(documentoLimpo)) ||
          (pessoa.cnpj && pessoa.cnpj.includes(documentoLimpo))
      );
    }

    // Filtro por estado
    if (filtros.estado) {
      resultado = resultado.filter(
        (pessoa) =>
          pessoa.fkEndereco?.bairro.fkCidade.fkEstado.id.toString() ===
          filtros.estado
      );
    }

    setPessoasFiltradas(resultado);
  }, [pessoas, filtros]);

  // Aplicar filtros quando pessoas ou filtros mudarem
  useEffect(() => {
    aplicarFiltros();
  }, [aplicarFiltros]);

  // Função para atualizar filtros
  const atualizarFiltro = (campo: keyof typeof filtros, valor: string) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  // Função para limpar filtros
  const limparFiltros = () => {
    setFiltros({
      busca: "",
      tipo: "",
      documento: "",
      estado: "",
    });
  };

  const selectedEstado = methods.watch(
    "fkEndereco.bairro.fkCidade.fkEstado.id"
  );
  const selectedCidade = methods.watch("fkEndereco.bairro.fkCidade.id");

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [pessoasData, estadosData, cidadesData, bairrosData] =
          await Promise.all([
            pessoaService.listar(),
            enderecoService.listarEstados(),
            enderecoService.listarCidades(),
            enderecoService.listarBairros(),
          ]);

        setPessoas(pessoasData);
        setPessoasFiltradas(pessoasData); // Inicializar filtradas com todas as pessoas
        setEstados(estadosData);
        setCidades(cidadesData);
        setBairros(bairrosData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // Filtrar cidades quando estado for selecionado
  useEffect(() => {
    if (selectedEstado) {
      const cidadesDoEstado = cidades.filter(
        (cidade) => cidade.fkEstado.id === Number(selectedEstado)
      );
      const opcoesCidades = cidadesDoEstado.map((cidade) => ({
        value: cidade.id.toString(),
        label: cidade.nome,
      }));
      setCidadesFiltradas(opcoesCidades);

      // Atualizar o nome do estado no formulário
      const estadoSelecionado = estados.find(
        (e) => e.id === Number(selectedEstado)
      );
      if (estadoSelecionado) {
        methods.setValue(
          "fkEndereco.bairro.fkCidade.fkEstado.nome",
          estadoSelecionado.nome
        );
      }
    } else {
      setCidadesFiltradas([]);
    }
  }, [selectedEstado, cidades, estados, methods]);

  // Filtrar bairros quando cidade for selecionada
  useEffect(() => {
    if (selectedCidade) {
      const bairrosDaCidade = bairros.filter(
        (bairro) => bairro.fkCidade.id === Number(selectedCidade)
      );
      const opcoesBairros = bairrosDaCidade.map((bairro) => ({
        value: bairro.id.toString(),
        label: bairro.nome,
      }));
      setBairrosFiltrados(opcoesBairros);

      // Atualizar o nome da cidade no formulário
      const cidadeSelecionada = cidades.find(
        (c) => c.id === Number(selectedCidade)
      );
      if (cidadeSelecionada) {
        methods.setValue(
          "fkEndereco.bairro.fkCidade.nome",
          cidadeSelecionada.nome
        );
      }
    } else {
      setBairrosFiltrados([]);
    }
  }, [selectedCidade, bairros, cidades, methods]);

  // Atualizar o nome do bairro quando selecionado
  const selectedBairro = methods.watch("fkEndereco.bairro.id");
  useEffect(() => {
    if (selectedBairro) {
      const bairroSelecionado = bairros.find(
        (b) => b.id === Number(selectedBairro)
      );
      if (bairroSelecionado) {
        methods.setValue("fkEndereco.bairro.nome", bairroSelecionado.nome);
      }
    }
  }, [selectedBairro, bairros, methods]);

  // Lógica para limpar CPF quando CNPJ for preenchido e vice-versa
  const cpfValue = methods.watch("cpf");
  const cnpjValue = methods.watch("cnpj");

  useEffect(() => {
    if (cpfValue && cpfValue.length > 0) {
      methods.setValue("cnpj", null);
    }
  }, [cpfValue, methods]);

  useEffect(() => {
    if (cnpjValue && cnpjValue.length > 0) {
      methods.setValue("cpf", null);
    }
  }, [cnpjValue, methods]);

  // Função para criar novo bairro
  const handleCriarBairro = async () => {
    if (!novoBairroNome.trim() || !selectedCidade) {
      alert("Por favor, preencha o nome do bairro e selecione uma cidade.");
      return;
    }

    try {
      setLoadingBairro(true);

      const cidadeSelecionada = cidades.find(
        (c) => c.id === Number(selectedCidade)
      );
      const estadoSelecionado = estados.find(
        (e) => e.id === Number(selectedEstado)
      );

      if (!cidadeSelecionada || !estadoSelecionado) {
        alert("Erro: Cidade ou estado não encontrado.");
        return;
      }

      const novoBairro = await enderecoService.criarBairro({
        nome: novoBairroNome.trim(),
        fkCidade: {
          id: cidadeSelecionada.id,
        },
      });

      // Atualizar a lista de bairros
      const bairrosAtualizados = await enderecoService.listarBairros();
      setBairros(bairrosAtualizados);

      // Selecionar automaticamente o novo bairro
      methods.setValue("fkEndereco.bairro.id", novoBairro.id.toString());
      methods.setValue("fkEndereco.bairro.nome", novoBairro.nome);

      // Fechar modal e limpar campo
      setShowBairroModal(false);
      setNovoBairroNome("");

      alert("Bairro criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar bairro:", error);
      alert("Erro ao criar bairro. Por favor, tente novamente.");
    } finally {
      setLoadingBairro(false);
    }
  };

  // Função para criar pessoa com endereço
  const handleCriarPessoaComEndereco = async (data: any) => {
    try {
      setLoadingEndereco(true);

      // Criar o endereço
      const enderecoData: CriarEnderecoPayload = {
        nome: data.fkEndereco.nome,
        logradouro: data.fkEndereco.logradouro,
        numero: data.fkEndereco.numero,
        complemento: data.fkEndereco.complemento,
        cep: data.fkEndereco.cep,
        bairro: {
          id: Number(data.fkEndereco.bairro.id),
        },
      };

      const enderecoCriado = await enderecoService.criarEndereco(enderecoData);

      // Depois criar a pessoa com o endereço criado
      const pessoaData: CriarPessoaPayload = {
        nome: data.nome,
        email: data.email,
        cpf: data.cpf ? data.cpf.replace(/\D/g, "") : null,
        cnpj: data.cnpj ? data.cnpj.replace(/\D/g, "") : null,
        dataNascimento: data.dataNascimento,
        telefone: data.telefone,
        fkEndereco: enderecoCriado,
      };

      await pessoaService.criar(pessoaData);

      // Recarregar dados
      const pessoasAtualizadas = await pessoaService.listar();
      setPessoas(pessoasAtualizadas);
      setPessoasFiltradas(pessoasAtualizadas);
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao criar pessoa com endereço:", error);

      // Detectar se é um erro de duplicação
      const errorInfo = detectDuplicateError(error);

      if (errorInfo.isDuplicate) {
        // Mostrar modal de erro personalizado
        setErrorInfo(errorInfo);
        setShowErrorModal(true);
      } else {
        // Mostrar alerta genérico para outros erros
        alert("Erro ao criar pessoa. Por favor, tente novamente.");
      }
    } finally {
      setLoadingEndereco(false);
    }
  };

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
            <span className="text-gray-900 font-medium">{endereco.nome}</span>
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
    if (!pessoa.id) return;

    if (window.confirm("Tem certeza que deseja excluir esta pessoa?")) {
      try {
        await pessoaService.excluir(pessoa.id);

        // Recarregar a lista de pessoas
        const pessoasAtualizadas = await pessoaService.listar();
        setPessoas(pessoasAtualizadas);
        setPessoasFiltradas(pessoasAtualizadas);
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
      if (pessoaParaEditar?.id) {
        // Lógica para editar pessoa existente
        const formattedData: AtualizarPessoaPayload = {
          nome: data.nome,
          email: data.email,
          cpf: data.cpf ? data.cpf.replace(/\D/g, "") : null,
          cnpj: data.cnpj ? data.cnpj.replace(/\D/g, "") : null,
          dataNascimento: data.dataNascimento,
          telefone: data.telefone,
          fkEndereco: {
            id: pessoaParaEditar.fkEndereco?.id,
            nome: data.fkEndereco.nome,
            logradouro: data.fkEndereco.logradouro,
            numero: data.fkEndereco.numero,
            complemento: data.fkEndereco.complemento,
            cep: data.fkEndereco.cep,
            bairro: {
              id: Number(data.fkEndereco.bairro.id),
            },
          },
        };

        await pessoaService.atualizar(pessoaParaEditar.id, formattedData);
      } else {
        // Lógica para criar nova pessoa com endereço
        await handleCriarPessoaComEndereco(data);
        return; // handleCriarPessoaComEndereco já recarrega os dados
      }

      // Recarregar a lista de pessoas
      const pessoasAtualizadas = await pessoaService.listar();
      setPessoas(pessoasAtualizadas);
      setPessoasFiltradas(pessoasAtualizadas);
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao salvar pessoa:", error);

      // Detectar se é um erro de duplicação
      const errorInfo = detectDuplicateError(error);

      if (errorInfo.isDuplicate) {
        // Mostrar modal de erro personalizado
        setErrorInfo(errorInfo);
        setShowErrorModal(true);
      } else {
        // Mostrar alerta genérico para outros erros
        alert("Erro ao salvar pessoa. Por favor, tente novamente.");
      }
    }
  };

  // Converter dados para formato de select
  const estadosOptions = estados.map((estado) => ({
    value: estado.id.toString(),
    label: estado.nome,
  }));

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
                value={filtros.busca}
                onChange={(e) => atualizarFiltro("busca", e.target.value)}
                placeholder="Buscar pessoas..."
                className="pl-10 w-full rounded-lg border border-gray-300 bg-white py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <SelectInput
              name="tipo_filtro"
              options={tiposPessoa}
              placeholder="Tipo de pessoa"
              className="w-full"
              value={
                filtros.tipo
                  ? {
                      value: filtros.tipo,
                      label:
                        tiposPessoa.find((t) => t.value === filtros.tipo)
                          ?.label || "",
                    }
                  : null
              }
              onChange={(option) =>
                atualizarFiltro("tipo", option?.value || "")
              }
            />
            <div className="relative">
              <input
                type="text"
                value={filtros.documento}
                onChange={(e) => atualizarFiltro("documento", e.target.value)}
                placeholder="CPF/CNPJ"
                className="w-full rounded-lg border border-gray-300 bg-white py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <SelectInput
                name="estado_filtro"
                options={estadosOptions}
                placeholder="Estado"
                className="flex-1"
                value={
                  filtros.estado
                    ? {
                        value: filtros.estado,
                        label:
                          estados.find(
                            (e) => e.id.toString() === filtros.estado
                          )?.nome || "",
                      }
                    : null
                }
                onChange={(option) =>
                  atualizarFiltro("estado", option?.value || "")
                }
              />
              <button
                onClick={limparFiltros}
                className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                title="Limpar filtros"
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
        </div>

        {/* Tabela para Desktop e Cards para Mobile */}
        <div className="w-full">
          {/* Indicador de resultados filtrados */}
          {(filtros.busca ||
            filtros.tipo ||
            filtros.documento ||
            filtros.estado) && (
            <div className="px-4 py-3 bg-blue-50 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-blue-700">
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
                    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
                  </svg>
                  <span>
                    Mostrando {pessoasFiltradas.length} de {pessoas.length}{" "}
                    pessoas
                    {filtros.busca && ` para "${filtros.busca}"`}
                  </span>
                </div>
                <button
                  onClick={limparFiltros}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          )}

          {/* Versão Desktop */}
          <div className="hidden md:block">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Carregando...</p>
              </div>
            ) : (
              <DataTable
                data={pessoasFiltradas}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            )}
          </div>

          {/* Cards Mobile */}
          <div className="md:hidden space-y-4 p-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Carregando...</p>
              </div>
            ) : pessoasFiltradas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma pessoa cadastrada.</p>
              </div>
            ) : (
              pessoasFiltradas.map((pessoa) => (
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
                          <p className="text-gray-900 font-medium">
                            {pessoa.fkEndereco.nome}
                          </p>
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
        size="full"
      >
        <FormProvider {...methods}>
          <FormLayout
            onSubmit={methods.handleSubmit(handleSubmit)}
            title={`${pessoaParaEditar ? "Edição" : "Cadastro"} de Pessoa`}
            submitText={loadingEndereco ? "Salvando..." : "Salvar"}
            onCancel={() => setShowModal(false)}
          >
            {/* Informações Básicas */}
            <FormSection title="Informações Básicas">
              <FormField label="Nome" className="space-y-2" fullWidth>
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

              <FormField label="Email" className="space-y-2" fullWidth>
                <input
                  type="email"
                  {...methods.register("email")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Digite o email"
                />
              </FormField>

              <FormField label="Telefone" className="space-y-2">
                <InputMask
                  name="telefone"
                  mask="telefone"
                  placeholder="Telefone"
                />
              </FormField>
            </FormSection>

            {/* Endereço */}
            <FormSection title="Endereço">
              <FormField
                label="Nome do Endereço"
                className="space-y-2"
                fullWidth
              >
                <input
                  type="text"
                  {...methods.register("fkEndereco.nome")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Ex: Casa, Trabalho, Residencial"
                />
              </FormField>

              <FormField label="CEP" className="space-y-2">
                <InputMask name="fkEndereco.cep" mask="cep" placeholder="CEP" />
              </FormField>

              <FormField label="Logradouro" className="space-y-2">
                <SelectInput
                  name="fkEndereco.logradouro"
                  options={tiposLogradouro}
                  placeholder="Selecione o tipo"
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

              <FormField label="Complemento" className="space-y-2" fullWidth>
                <input
                  type="text"
                  {...methods.register("fkEndereco.complemento")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Complemento (opcional)"
                />
              </FormField>

              <FormField label="Estado" fullWidth>
                <SelectInput
                  name="fkEndereco.bairro.fkCidade.fkEstado.id"
                  options={estadosOptions}
                  placeholder="Selecione o estado"
                />
              </FormField>

              <FormField label="Cidade" fullWidth>
                <SelectInput
                  name="fkEndereco.bairro.fkCidade.id"
                  options={cidadesFiltradas}
                  placeholder="Selecione a cidade"
                />
              </FormField>

              <FormField label="Bairro" fullWidth>
                <div className="flex flex-col sm:flex-row gap-2 relative z-10">
                  <div className="flex-1">
                    <SelectInput
                      name="fkEndereco.bairro.id"
                      options={bairrosFiltrados}
                      placeholder="Selecione o bairro"
                    />
                  </div>
                  {!pessoaParaEditar && selectedCidade && (
                    <button
                      type="button"
                      onClick={() => setShowBairroModal(true)}
                      className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap flex-shrink-0"
                    >
                      Novo
                    </button>
                  )}
                </div>
              </FormField>
            </FormSection>
          </FormLayout>
        </FormProvider>
      </Modal>

      {/* Modal de Visualização */}
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
                    <p className="text-gray-900 font-medium">
                      {pessoaParaVisualizar.fkEndereco.nome}
                    </p>
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
            <div className="flex justify-end gap-4">
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

      {/* Modal para criar novo bairro */}
      <Modal
        isOpen={showBairroModal}
        onClose={() => setShowBairroModal(false)}
        title="Criar Novo Bairro"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Bairro
            </label>
            <input
              type="text"
              value={novoBairroNome}
              onChange={(e) => setNovoBairroNome(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              placeholder="Digite o nome do bairro"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Cidade:</strong>{" "}
              {cidades.find((c) => c.id === Number(selectedCidade))?.nome}
            </p>
            <p className="text-sm text-blue-800">
              <strong>Estado:</strong>{" "}
              {estados.find((e) => e.id === Number(selectedEstado))?.nome}
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => {
                setShowBairroModal(false);
                setNovoBairroNome("");
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleCriarBairro}
              disabled={loadingBairro || !novoBairroNome.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingBairro ? "Criando..." : "Criar Bairro"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Erro */}
      {errorInfo && (
        <ErrorModal
          isOpen={showErrorModal}
          onClose={() => {
            setShowErrorModal(false);
            setErrorInfo(null);
          }}
          title={errorInfo.title}
          message={errorInfo.message}
          details={errorInfo.details}
        />
      )}
    </div>
  );
}
