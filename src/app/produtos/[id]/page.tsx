"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { Breadcrumb } from "@/Components/ui/breadcrumb";
import { SelectInput } from "@/Components/ui/select";
import { Modal } from "@/Components/ui/modal";
import {
  FormLayout,
  FormSection,
  FormField,
} from "@/Components/ui/form-layout";

interface UnidadeProduto {
  id: string;
  codigosUnicos: {
    tipo: string;
    codigo: string;
    descricao?: string;
  }[];
  descricao?: string;
  status: "disponivel" | "vendido" | "reservado";
  dataEntrada: string;
  dataVenda?: string;
  precoVenda?: number;
  observacoes?: string;
  comprador?: string;
}

interface ProdutoDetalhado {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  codigo: string;
  categorias: string[];
  cores: string[];
  unidade: string;
  tamanho: string;
  especificacoes: {
    [key: string]: string;
  };
  unidades: UnidadeProduto[];
}

// Dados mockados para exemplo
const produtoExemplo: ProdutoDetalhado = {
  id: "1",
  nome: "iPhone 13 Pro",
  descricao: "iPhone 13 Pro com 256GB de armazenamento",
  preco: 6999.9,
  quantidade: 3,
  codigo: "IPH13P",
  categorias: ["Eletrônicos", "Smartphones"],
  cores: ["Grafite"],
  unidade: "UN",
  tamanho: "256GB",
  especificacoes: {
    Processador: "A15 Bionic",
    Tela: "6.1 polegadas",
    Resolução: "2532 x 1170 pixels",
    "Câmera Principal": "12MP + 12MP + 12MP",
    "Câmera Frontal": "12MP",
    Bateria: "3095mAh",
    "Sistema Operacional": "iOS 15",
    "Memória RAM": "6GB",
    Armazenamento: "256GB",
  },
  unidades: [
    {
      id: "1-1",
      status: "disponivel",
      dataEntrada: "2024-01-15",
      codigosUnicos: [
        {
          tipo: "IMEI 1",
          codigo: "354885648957412",
          descricao: "Principal",
        },
        {
          tipo: "IMEI 2",
          codigo: "354885648957413",
          descricao: "Secundário",
        },
        {
          tipo: "Número de Série",
          codigo: "DNQXK8NKDNQ2",
        },
      ],
      descricao: "Unidade nova, lacrada",
      observacoes: "Produto em perfeito estado",
    },
    {
      id: "1-2",
      status: "vendido",
      dataEntrada: "2024-01-15",
      dataVenda: "2024-01-20",
      precoVenda: 6899.9,
      comprador: "João Silva",
      codigosUnicos: [
        {
          tipo: "IMEI 1",
          codigo: "354885648957414",
          descricao: "Principal",
        },
        {
          tipo: "IMEI 2",
          codigo: "354885648957415",
          descricao: "Secundário",
        },
        {
          tipo: "Número de Série",
          codigo: "DNQXK8NKDNQ3",
        },
      ],
      descricao: "Unidade vendida para cliente X",
    },
    {
      id: "1-3",
      status: "reservado",
      dataEntrada: "2024-01-16",
      codigosUnicos: [
        {
          tipo: "IMEI 1",
          codigo: "354885648957416",
          descricao: "Principal",
        },
        {
          tipo: "IMEI 2",
          codigo: "354885648957417",
          descricao: "Secundário",
        },
        {
          tipo: "Número de Série",
          codigo: "DNQXK8NKDNQ4",
        },
      ],
      descricao: "Unidade reservada para cliente Y",
      observacoes: "Reserva válida até 20/01/2024",
    },
  ],
};

// Componente de seleção de período
const PeriodSelect = ({
  label,
  dataInicio,
  dataFim,
  onChangeInicio,
  onChangeFim,
}: {
  label: string;
  dataInicio: string;
  dataFim: string;
  onChangeInicio: (value: string) => void;
  onChangeFim: (value: string) => void;
}) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-500">{label}</label>
    <div className="flex gap-2">
      <input
        type="date"
        value={dataInicio}
        onChange={(e) => onChangeInicio(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        placeholder="De"
      />
      <input
        type="date"
        value={dataFim}
        onChange={(e) => onChangeFim(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        placeholder="Até"
      />
    </div>
  </div>
);

export default function ProdutoDetalhesPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [produto] = useState<ProdutoDetalhado>(produtoExemplo);
  const [unidadeSelecionada, setUnidadeSelecionada] =
    useState<UnidadeProduto | null>(null);
  const [showNovaUnidade, setShowNovaUnidade] = useState(false);
  const [showEditarUnidade, setShowEditarUnidade] = useState(false);
  const [unidadeParaEditar, setUnidadeParaEditar] =
    useState<UnidadeProduto | null>(null);
  const methodsNovaUnidade = useForm();
  const methodsEditarUnidade = useForm();
  const [filtros, setFiltros] = useState({
    busca: "",
    tipoBusca: "codigo",
    dataEntradaInicio: "",
    dataEntradaFim: "",
    dataVendaInicio: "",
    dataVendaFim: "",
    status: "",
  });
  const [statusSelecionado, setStatusSelecionado] =
    useState<string>("disponivel");

  const statusClasses = {
    disponivel: "bg-green-100 text-green-800",
    vendido: "bg-gray-100 text-gray-800",
    reservado: "bg-yellow-100 text-yellow-800",
  };

  const statusLabels = {
    disponivel: "Disponível",
    vendido: "Vendido",
    reservado: "Reservado",
  };

  // Opções de busca baseadas no tipo de produto
  const opcoesBusca = [
    { value: "codigo", label: "Código" },
    ...(produto.unidades.some((u) =>
      u.codigosUnicos.some((c) => c.tipo.includes("IMEI"))
    )
      ? [{ value: "imei", label: "IMEI" }]
      : []),
    { value: "serie", label: "Número de Série" },
  ];

  const opcoesStatus = [
    { value: "", label: "Todos" },
    { value: "disponivel", label: "Disponível" },
    { value: "vendido", label: "Vendido" },
    { value: "reservado", label: "Reservado" },
  ];

  // Função para filtrar unidades
  const unidadesFiltradas = produto.unidades.filter((unidade) => {
    // Filtro por status
    if (filtros.status && unidade.status !== filtros.status) return false;

    // Filtro por data de entrada
    if (filtros.dataEntradaInicio || filtros.dataEntradaFim) {
      const dataEntrada = new Date(unidade.dataEntrada);

      if (filtros.dataEntradaInicio) {
        const inicio = new Date(filtros.dataEntradaInicio);
        if (dataEntrada < inicio) return false;
      }

      if (filtros.dataEntradaFim) {
        const fim = new Date(filtros.dataEntradaFim);
        if (dataEntrada > fim) return false;
      }
    }

    // Filtro por data de venda
    if (filtros.dataVendaInicio || filtros.dataVendaFim) {
      if (!unidade.dataVenda) return false;

      const dataVenda = new Date(unidade.dataVenda);

      if (filtros.dataVendaInicio) {
        const inicio = new Date(filtros.dataVendaInicio);
        if (dataVenda < inicio) return false;
      }

      if (filtros.dataVendaFim) {
        const fim = new Date(filtros.dataVendaFim);
        if (dataVenda > fim) return false;
      }
    }

    // Filtro por texto (código, IMEI, série)
    if (filtros.busca) {
      const busca = filtros.busca.toLowerCase();
      if (filtros.tipoBusca === "imei") {
        return unidade.codigosUnicos.some(
          (c) =>
            c.tipo.includes("IMEI") && c.codigo.toLowerCase().includes(busca)
        );
      } else if (filtros.tipoBusca === "serie") {
        return unidade.codigosUnicos.some(
          (c) =>
            c.tipo.includes("Série") && c.codigo.toLowerCase().includes(busca)
        );
      } else {
        return unidade.codigosUnicos.some((c) =>
          c.codigo.toLowerCase().includes(busca)
        );
      }
    }

    return true;
  });

  const handleSubmitNovaUnidade = (data: any) => {
    console.log("Nova unidade:", data);
    setShowNovaUnidade(false);
  };

  const handleEditarUnidade = (unidade: UnidadeProduto) => {
    setUnidadeParaEditar(unidade);
    methodsEditarUnidade.reset({
      status: unidade.status,
      dataEntrada: unidade.dataEntrada,
      dataVenda: unidade.dataVenda || "",
      precoVenda: unidade.precoVenda || "",
      descricao: unidade.descricao || "",
      observacoes: unidade.observacoes || "",
      comprador: unidade.comprador || "",
      codigosUnicos: unidade.codigosUnicos.map((codigo) => ({
        tipo: codigo.tipo,
        codigo: codigo.codigo,
        descricao: codigo.descricao || "",
      })),
    });
    setStatusSelecionado(unidade.status);
    setShowEditarUnidade(true);
  };

  const handleSubmitEditarUnidade = (data: any) => {
    console.log("Editar unidade:", data);
    setShowEditarUnidade(false);
  };

  const handleExcluirUnidade = (unidade: UnidadeProduto) => {
    // Implementar lógica de exclusão
    console.log("Excluir unidade:", unidade);
  };

  // Opções de status para nova unidade (sem vendido)
  const novaUnidadeStatusOptions = [
    { value: "disponivel", label: "Disponível" },
    { value: "reservado", label: "Reservado" },
  ];

  // Opções de status para edição (incluindo vendido)
  const editarStatusOptions = [
    { value: "disponivel", label: "Disponível" },
    { value: "reservado", label: "Reservado" },
    { value: "vendido", label: "Vendido" },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Breadcrumb
          items={[
            {
              label: "Produtos",
              href: "/produtos",
            },
            {
              label: produto.nome,
              href: `/produtos/${produto.id}`,
              active: true,
            },
          ]}
        />
      </div>

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-500">{produto.nome}</h1>
          <p className="text-gray-600 mt-1">{produto.descricao}</p>
        </div>
        <button
          onClick={() => router.back()}
          className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Voltar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informações Básicas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-blue-500 mb-4">
            Informações Básicas
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Código</p>
              <p className="text-blue-500">{produto.codigo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Preço Base</p>
              <p className="text-blue-500">
                {produto.preco.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Quantidade Total
              </p>
              <p className="text-blue-500">{produto.quantidade} unidades</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Unidade</p>
              <p className="text-blue-500">{produto.unidade}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tamanho</p>
              <p className="text-blue-500">{produto.tamanho}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cores</p>
              <p className="text-blue-500">{produto.cores.join(", ")}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500">Categorias</p>
              <p className="text-blue-500">{produto.categorias.join(", ")}</p>
            </div>
          </div>
        </div>

        {/* Especificações */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-blue-500 mb-4">
            Especificações Técnicas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(produto.especificacoes).map(([chave, valor]) => (
              <div key={chave}>
                <p className="text-sm font-medium text-gray-500">{chave}</p>
                <p className="text-blue-500">{valor}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lista de Unidades */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-blue-500">
              Unidades do Produto
            </h2>
            <button
              onClick={() => setShowNovaUnidade(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Nova Unidade
            </button>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="space-y-4">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Tipo de Busca
                </label>
                <SelectInput
                  name="tipoBusca"
                  options={opcoesBusca}
                  value={
                    opcoesBusca.find((o) => o.value === filtros.tipoBusca) ||
                    null
                  }
                  onChange={(option) =>
                    setFiltros((prev) => ({
                      ...prev,
                      tipoBusca: option?.value || "codigo",
                    }))
                  }
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Buscar por{" "}
                  {
                    opcoesBusca.find((o) => o.value === filtros.tipoBusca)
                      ?.label
                  }
                </label>
                <input
                  type="text"
                  value={filtros.busca}
                  onChange={(e) =>
                    setFiltros((prev) => ({ ...prev, busca: e.target.value }))
                  }
                  className="rounded-md border border-gray-300 px-3 py-2"
                  placeholder={`Digite o ${
                    opcoesBusca.find((o) => o.value === filtros.tipoBusca)
                      ?.label
                  }`}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <SelectInput
                  name="status"
                  options={opcoesStatus}
                  value={
                    opcoesStatus.find((o) => o.value === filtros.status) || null
                  }
                  onChange={(option) =>
                    setFiltros((prev) => ({
                      ...prev,
                      status: option?.value || "",
                    }))
                  }
                />
              </div>
              <PeriodSelect
                label="Data de Entrada"
                dataInicio={filtros.dataEntradaInicio}
                dataFim={filtros.dataEntradaFim}
                onChangeInicio={(value) =>
                  setFiltros((prev) => ({ ...prev, dataEntradaInicio: value }))
                }
                onChangeFim={(value) =>
                  setFiltros((prev) => ({ ...prev, dataEntradaFim: value }))
                }
              />
            </div>

            <div className="space-y-4">
              <PeriodSelect
                label="Data de Venda"
                dataInicio={filtros.dataVendaInicio}
                dataFim={filtros.dataVendaFim}
                onChangeInicio={(value) =>
                  setFiltros((prev) => ({ ...prev, dataVendaInicio: value }))
                }
                onChangeFim={(value) =>
                  setFiltros((prev) => ({ ...prev, dataVendaFim: value }))
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            {unidadesFiltradas.map((unidade) => (
              <div
                key={unidade.id}
                className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusClasses[unidade.status]
                      }`}
                    >
                      {statusLabels[unidade.status]}
                    </span>
                    <p className="text-sm text-gray-600">
                      Data de Entrada:{" "}
                      {new Date(unidade.dataEntrada).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                    {unidade.dataVenda && (
                      <p className="text-sm text-gray-600">
                        Data de Venda:{" "}
                        {new Date(unidade.dataVenda).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unidade.precoVenda && (
                      <p className="text-sm font-medium text-blue-500">
                        Preço de Venda:{" "}
                        {unidade.precoVenda.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    )}
                    <button
                      onClick={() => handleEditarUnidade(unidade)}
                      className="text-yellow-500 hover:text-yellow-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluirUnidade(unidade)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Excluir
                    </button>
                  </div>
                </div>

                {unidade.descricao && (
                  <p className="text-sm text-gray-600 mb-2">
                    {unidade.descricao}
                  </p>
                )}

                <div className="flex items-center justify-end">
                  <button
                    onClick={() =>
                      setUnidadeSelecionada(
                        unidade === unidadeSelecionada ? null : unidade
                      )
                    }
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    {unidadeSelecionada?.id === unidade.id
                      ? "Ocultar Detalhes"
                      : "Ver Detalhes"}
                  </button>
                </div>

                {unidadeSelecionada?.id === unidade.id && (
                  <div className="mt-4 space-y-3 border-t pt-3">
                    {unidade.codigosUnicos.map((codigo, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-start"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            {codigo.tipo}
                          </p>
                          <p className="text-blue-500 font-mono">
                            {codigo.codigo}
                          </p>
                        </div>
                        {codigo.descricao && (
                          <span className="text-xs text-gray-400">
                            {codigo.descricao}
                          </span>
                        )}
                      </div>
                    ))}
                    {unidade.observacoes && (
                      <div className="mt-2 text-sm text-gray-500">
                        <p className="font-medium">Observações:</p>
                        <p>{unidade.observacoes}</p>
                      </div>
                    )}
                    {unidade.comprador && (
                      <div className="mt-2 text-sm text-gray-500">
                        <p className="font-medium">Comprador:</p>
                        <p>{unidade.comprador}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Nova Unidade */}
      <Modal
        isOpen={showNovaUnidade}
        onClose={() => setShowNovaUnidade(false)}
        title="Nova Unidade"
        size="lg"
      >
        <FormProvider {...methodsNovaUnidade}>
          <FormLayout
            title="Cadastro de Nova Unidade"
            onSubmit={methodsNovaUnidade.handleSubmit(handleSubmitNovaUnidade)}
            submitText="Salvar"
            cancelText="Cancelar"
            onCancel={() => setShowNovaUnidade(false)}
          >
            <FormSection>
              <FormField label="Status">
                <SelectInput
                  name="status"
                  options={novaUnidadeStatusOptions}
                  placeholder="Selecione o status"
                  value={
                    novaUnidadeStatusOptions.find(
                      (o) => o.value === statusSelecionado
                    ) || null
                  }
                  onChange={(option) =>
                    setStatusSelecionado(option?.value || "disponivel")
                  }
                />
              </FormField>

              <FormField label="Data de Entrada">
                <input
                  type="date"
                  {...methodsNovaUnidade.register("dataEntrada")}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </FormField>

              <FormField label="Preço de Venda">
                <input
                  type="number"
                  step="0.01"
                  {...methodsNovaUnidade.register("precoVenda")}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="0,00"
                />
              </FormField>

              <FormField label="Descrição" fullWidth>
                <textarea
                  {...methodsNovaUnidade.register("descricao")}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  rows={3}
                  placeholder="Descrição da unidade"
                />
              </FormField>

              <FormField label="Observações" fullWidth>
                <textarea
                  {...methodsNovaUnidade.register("observacoes")}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  rows={3}
                  placeholder="Observações adicionais"
                />
              </FormField>
            </FormSection>

            <FormSection title="Códigos Únicos">
              <div className="col-span-2 space-y-4">
                {/* IMEI 1 */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="IMEI 1">
                    <input
                      type="text"
                      {...methodsNovaUnidade.register("codigosUnicos.0.codigo")}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Digite o IMEI 1"
                    />
                  </FormField>
                  <FormField label="Descrição IMEI 1">
                    <input
                      type="text"
                      {...methodsNovaUnidade.register(
                        "codigosUnicos.0.descricao"
                      )}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Ex: Principal"
                    />
                    <input
                      type="hidden"
                      {...methodsNovaUnidade.register("codigosUnicos.0.tipo")}
                      value="IMEI 1"
                    />
                  </FormField>
                </div>

                {/* IMEI 2 */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="IMEI 2">
                    <input
                      type="text"
                      {...methodsNovaUnidade.register("codigosUnicos.1.codigo")}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Digite o IMEI 2"
                    />
                  </FormField>
                  <FormField label="Descrição IMEI 2">
                    <input
                      type="text"
                      {...methodsNovaUnidade.register(
                        "codigosUnicos.1.descricao"
                      )}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Ex: Secundário"
                    />
                    <input
                      type="hidden"
                      {...methodsNovaUnidade.register("codigosUnicos.1.tipo")}
                      value="IMEI 2"
                    />
                  </FormField>
                </div>

                {/* Número de Série */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Número de Série">
                    <input
                      type="text"
                      {...methodsNovaUnidade.register("codigosUnicos.2.codigo")}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Digite o número de série"
                    />
                  </FormField>
                  <FormField label="Descrição Número de Série">
                    <input
                      type="text"
                      {...methodsNovaUnidade.register(
                        "codigosUnicos.2.descricao"
                      )}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Ex: S/N"
                    />
                    <input
                      type="hidden"
                      {...methodsNovaUnidade.register("codigosUnicos.2.tipo")}
                      value="Número de Série"
                    />
                  </FormField>
                </div>
              </div>
            </FormSection>
          </FormLayout>
        </FormProvider>
      </Modal>

      {/* Modal de Editar Unidade */}
      <Modal
        isOpen={showEditarUnidade}
        onClose={() => setShowEditarUnidade(false)}
        title="Editar Unidade"
        size="lg"
      >
        <FormProvider {...methodsEditarUnidade}>
          <FormLayout
            title="Edição de Unidade"
            onSubmit={methodsEditarUnidade.handleSubmit(
              handleSubmitEditarUnidade
            )}
            submitText="Salvar"
            cancelText="Cancelar"
            onCancel={() => setShowEditarUnidade(false)}
          >
            <FormSection>
              <FormField label="Status">
                <SelectInput
                  name="status"
                  options={editarStatusOptions}
                  placeholder="Selecione o status"
                  value={
                    editarStatusOptions.find(
                      (o) => o.value === statusSelecionado
                    ) || null
                  }
                  onChange={(option) =>
                    setStatusSelecionado(option?.value || "disponivel")
                  }
                />
              </FormField>

              <FormField label="Data de Entrada">
                <input
                  type="date"
                  {...methodsEditarUnidade.register("dataEntrada")}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </FormField>

              {statusSelecionado === "vendido" && (
                <>
                  <FormField label="Data de Venda">
                    <input
                      type="date"
                      {...methodsEditarUnidade.register("dataVenda")}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </FormField>

                  <FormField label="Comprador">
                    <input
                      type="text"
                      {...methodsEditarUnidade.register("comprador")}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Nome do comprador"
                    />
                  </FormField>
                </>
              )}

              <FormField label="Preço de Venda">
                <input
                  type="number"
                  step="0.01"
                  {...methodsEditarUnidade.register("precoVenda")}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="0,00"
                />
              </FormField>

              <FormField label="Descrição" fullWidth>
                <textarea
                  {...methodsEditarUnidade.register("descricao")}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  rows={3}
                  placeholder="Descrição da unidade"
                />
              </FormField>

              <FormField label="Observações" fullWidth>
                <textarea
                  {...methodsEditarUnidade.register("observacoes")}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  rows={3}
                  placeholder="Observações adicionais"
                />
              </FormField>
            </FormSection>

            <FormSection title="Códigos Únicos">
              <div className="col-span-2 space-y-4">
                {/* IMEI 1 */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="IMEI 1">
                    <input
                      type="text"
                      {...methodsEditarUnidade.register(
                        "codigosUnicos.0.codigo"
                      )}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Digite o IMEI 1"
                    />
                  </FormField>
                  <FormField label="Descrição IMEI 1">
                    <input
                      type="text"
                      {...methodsEditarUnidade.register(
                        "codigosUnicos.0.descricao"
                      )}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Ex: Principal"
                    />
                    <input
                      type="hidden"
                      {...methodsEditarUnidade.register("codigosUnicos.0.tipo")}
                      value="IMEI 1"
                    />
                  </FormField>
                </div>

                {/* IMEI 2 */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="IMEI 2">
                    <input
                      type="text"
                      {...methodsEditarUnidade.register(
                        "codigosUnicos.1.codigo"
                      )}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Digite o IMEI 2"
                    />
                  </FormField>
                  <FormField label="Descrição IMEI 2">
                    <input
                      type="text"
                      {...methodsEditarUnidade.register(
                        "codigosUnicos.1.descricao"
                      )}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Ex: Secundário"
                    />
                    <input
                      type="hidden"
                      {...methodsEditarUnidade.register("codigosUnicos.1.tipo")}
                      value="IMEI 2"
                    />
                  </FormField>
                </div>

                {/* Número de Série */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Número de Série">
                    <input
                      type="text"
                      {...methodsEditarUnidade.register(
                        "codigosUnicos.2.codigo"
                      )}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Digite o número de série"
                    />
                  </FormField>
                  <FormField label="Descrição Número de Série">
                    <input
                      type="text"
                      {...methodsEditarUnidade.register(
                        "codigosUnicos.2.descricao"
                      )}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Ex: S/N"
                    />
                    <input
                      type="hidden"
                      {...methodsEditarUnidade.register("codigosUnicos.2.tipo")}
                      value="Número de Série"
                    />
                  </FormField>
                </div>
              </div>
            </FormSection>
          </FormLayout>
        </FormProvider>
      </Modal>
    </div>
  );
}
