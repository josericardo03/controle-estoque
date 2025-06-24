"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Breadcrumb } from "@/Components/ui/breadcrumb";
import { DataTable } from "@/Components/ui/data-table";
import { SelectInput } from "@/Components/ui/select";
import { InputMask } from "@/Components/ui/input-mask";
import { Modal } from "@/Components/ui/modal";
import {
  FormLayout,
  FormSection,
  FormField,
} from "@/Components/ui/form-layout";
import { ColumnDef, Row } from "@tanstack/react-table";
import {
  produtoService,
  Produto,
  Cor,
  Categoria,
  Tamanho,
  Unidade,
  CriarProdutoPayload,
  AtualizarProdutoPayload,
} from "@/services/produtoService";

// Interface para opções de select
interface SelectOption {
  value: string;
  label: string;
}

export default function ProdutosPage() {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCorModal, setShowCorModal] = useState(false);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [showTamanhoModal, setShowTamanhoModal] = useState(false);
  const [showUnidadeModal, setShowUnidadeModal] = useState(false);

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [cores, setCores] = useState<Cor[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tamanhos, setTamanhos] = useState<Tamanho[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);

  const [produtoParaEditar, setProdutoParaEditar] = useState<Produto | null>(
    null
  );
  const [produtoParaVisualizar, setProdutoParaVisualizar] =
    useState<Produto | null>(null);
  const [especificacoes, setEspecificacoes] = useState<
    { chave: string; valor: string }[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const [novoCorNome, setNovoCorNome] = useState("");
  const [novaCategoriaNome, setNovaCategoriaNome] = useState("");
  const [novoTamanhoNome, setNovoTamanhoNome] = useState("");
  const [novaUnidadeNome, setNovaUnidadeNome] = useState("");

  const methods = useForm();

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Carregar dados básicos
        const [
          produtosData,
          coresData,
          categoriasData,
          tamanhosData,
          unidadesData,
        ] = await Promise.all([
          produtoService.listar(),
          produtoService.listarCores(),
          produtoService.listarCategorias(),
          produtoService.listarTamanhos(),
          produtoService.listarUnidades(),
        ]);

        // Carregar listas de vínculos (com tratamento de erro)
        let listaCoresData = [];
        let listaCategoriasData = [];

        try {
          listaCoresData = await produtoService.listarListaCores();
          console.log("Lista Cores Data (raw):", listaCoresData);
        } catch (error) {
          console.warn("API lista-cores não disponível:", error);
        }

        try {
          listaCategoriasData = await produtoService.listarListaCategorias();
          console.log("Lista Categorias Data (raw):", listaCategoriasData);
        } catch (error) {
          console.warn("API lista-categorias não disponível:", error);
        }

        // Combinar produtos com suas cores e categorias
        const produtosComVinculos = produtosData.map((produto) => {
          // Buscar cores vinculadas ao produto
          const coresVinculadas = listaCoresData.filter((listaCor) => {
            return listaCor.fkProduto?.id === produto.id;
          });

          const coresDoProduto = coresVinculadas
            .map((listaCor) => listaCor.fkCor)
            .filter((cor): cor is Cor => cor !== undefined);

          // Buscar categorias vinculadas ao produto
          const categoriasVinculadas = listaCategoriasData.filter(
            (listaCategoria) => {
              return listaCategoria.fkProduto?.id === produto.id;
            }
          );

          const categoriasDoProduto = categoriasVinculadas
            .map((listaCategoria) => listaCategoria.fkCategoria)
            .filter(
              (categoria): categoria is Categoria => categoria !== undefined
            );

          console.log(`Produto ${produto.nome}:`, {
            cores: coresDoProduto,
            categorias: categoriasDoProduto,
          });

          return {
            ...produto,
            listaCores: coresDoProduto,
            listaCategorias: categoriasDoProduto,
          };
        });

        setProdutos(produtosComVinculos);
        setCores(coresData);
        setCategorias(categoriasData);
        setTamanhos(tamanhosData);
        setUnidades(unidadesData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // Converter dados para formato de select
  const coresOptions: SelectOption[] = cores.map((cor) => ({
    value: cor.id.toString(),
    label: cor.nome,
  }));

  const categoriasOptions: SelectOption[] = categorias.map((categoria) => ({
    value: categoria.id.toString(),
    label: categoria.nome,
  }));

  const tamanhosOptions: SelectOption[] = tamanhos.map((tamanho) => ({
    value: tamanho.id.toString(),
    label: tamanho.nome,
  }));

  const unidadesOptions: SelectOption[] = unidades.map((unidade) => ({
    value: unidade.id.toString(),
    label: unidade.nome,
  }));

  // Funções para criar novos registros
  const handleCriarCor = async () => {
    if (!novoCorNome.trim()) return;

    try {
      setLoadingCreate(true);
      const novaCor = await produtoService.criarCor({
        nome: novoCorNome.trim(),
      });
      setCores([...cores, novaCor]);
      setShowCorModal(false);
      setNovoCorNome("");
    } catch (error) {
      console.error("Erro ao criar cor:", error);
      alert("Erro ao criar cor. Tente novamente.");
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleCriarCategoria = async () => {
    if (!novaCategoriaNome.trim()) return;

    try {
      setLoadingCreate(true);
      const novaCategoria = await produtoService.criarCategoria({
        nome: novaCategoriaNome.trim(),
      });
      setCategorias([...categorias, novaCategoria]);
      setShowCategoriaModal(false);
      setNovaCategoriaNome("");
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      alert("Erro ao criar categoria. Tente novamente.");
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleCriarTamanho = async () => {
    if (!novoTamanhoNome.trim()) return;

    try {
      setLoadingCreate(true);
      const novoTamanho = await produtoService.criarTamanho({
        nome: novoTamanhoNome.trim(),
      });
      setTamanhos([...tamanhos, novoTamanho]);
      setShowTamanhoModal(false);
      setNovoTamanhoNome("");
    } catch (error) {
      console.error("Erro ao criar tamanho:", error);
      alert("Erro ao criar tamanho. Tente novamente.");
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleCriarUnidade = async () => {
    if (!novaUnidadeNome.trim()) return;

    try {
      setLoadingCreate(true);
      const novaUnidade = await produtoService.criarUnidade({
        nome: novaUnidadeNome.trim(),
      });
      setUnidades([...unidades, novaUnidade]);
      setShowUnidadeModal(false);
      setNovaUnidadeNome("");
    } catch (error) {
      console.error("Erro ao criar unidade:", error);
      alert("Erro ao criar unidade. Tente novamente.");
    } finally {
      setLoadingCreate(false);
    }
  };

  // Colunas da tabela
  const columns: ColumnDef<Produto>[] = [
    {
      id: "codigoBarra",
      accessorKey: "codigoBarra",
      header: "Código",
      cell: ({ row }: { row: Row<Produto> }) => (
        <div className="text-sm text-gray-900 font-medium">
          {row.original.codigoBarra}
        </div>
      ),
    },
    {
      id: "nome",
      accessorKey: "nome",
      header: "Nome",
      cell: ({ row }: { row: Row<Produto> }) => (
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-900">
            {row.original.nome}
          </div>
          <div className="text-sm text-gray-500">{row.original.descricao}</div>
        </div>
      ),
    },
    {
      id: "valor",
      accessorKey: "valor",
      header: "Preço",
      cell: ({ row }: { row: Row<Produto> }) => (
        <div className="text-sm text-gray-900">
          {row.original.valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
      ),
    },
    {
      id: "tamanho",
      accessorKey: "fkTamanho",
      header: "Tamanho",
      cell: ({ row }: { row: Row<Produto> }) => (
        <div className="text-sm font-medium text-gray-900">
          {row.original.fkTamanho?.nome || "-"}
        </div>
      ),
    },
    {
      id: "unidade",
      accessorKey: "fkUnidade",
      header: "Unidade",
      cell: ({ row }: { row: Row<Produto> }) => (
        <div className="text-sm text-gray-900">
          {row.original.fkUnidade?.nome || "-"}
        </div>
      ),
    },
    {
      id: "categorias",
      accessorKey: "listaCategorias",
      header: "Categorias",
      cell: ({ row }: { row: Row<Produto> }) => (
        <div className="text-sm text-gray-900">
          {row.original.listaCategorias?.map((cat) => cat.nome).join(", ") ||
            "-"}
        </div>
      ),
    },
    {
      id: "cores",
      accessorKey: "listaCores",
      header: "Cores",
      cell: ({ row }: { row: Row<Produto> }) => (
        <div className="text-sm text-gray-900">
          {row.original.listaCores?.map((cor) => cor.nome).join(", ") || "-"}
        </div>
      ),
    },
  ];

  const handleNovoProduto = () => {
    setProdutoParaEditar(null);
    methods.reset({});
    setEspecificacoes([]);
    setShowModal(true);
  };

  const handleEditarProduto = (produto: Produto) => {
    setProdutoParaEditar(produto);

    // Converter especificações do objeto para array
    const especificacoesArray = Object.entries(
      produto.especificacoes || {}
    ).map(([chave, valor]) => ({
      chave,
      valor: String(valor),
    }));

    methods.reset({
      nome: produto.nome,
      codigoBarra: produto.codigoBarra,
      descricao: produto.descricao,
      valor: produto.valor,
      fkTamanho: produto.fkTamanho?.id?.toString(),
      fkUnidade: produto.fkUnidade?.id?.toString(),
      cores: produto.listaCores?.map((cor) => cor.id.toString()) || [],
      categorias:
        produto.listaCategorias?.map((cat) => cat.id.toString()) || [],
    });

    setEspecificacoes(especificacoesArray);
    setShowModal(true);
  };

  const handleVisualizarProduto = (produto: Produto) => {
    setProdutoParaVisualizar(produto);
    setShowViewModal(true);
  };

  const handleExcluirProduto = async (produto: Produto) => {
    if (!produto.id) return;

    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await produtoService.excluir(produto.id);

        // Recarregar a lista de produtos
        await recarregarProdutos();
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        alert("Erro ao excluir produto. Por favor, tente novamente.");
      }
    }
  };

  // Função para recarregar produtos com vínculos
  const recarregarProdutos = async () => {
    try {
      const produtosData = await produtoService.listar();

      // Carregar listas de vínculos
      let listaCoresData = [];
      let listaCategoriasData = [];

      try {
        listaCoresData = await produtoService.listarListaCores();
        console.log("Recarregar - Lista Cores Data (raw):", listaCoresData);
      } catch (error) {
        console.warn("API lista-cores não disponível:", error);
      }

      try {
        listaCategoriasData = await produtoService.listarListaCategorias();
        console.log(
          "Recarregar - Lista Categorias Data (raw):",
          listaCategoriasData
        );
      } catch (error) {
        console.warn("API lista-categorias não disponível:", error);
      }

      // Combinar produtos com suas cores e categorias
      const produtosComVinculos = produtosData.map((produto) => {
        const coresVinculadas = listaCoresData.filter((listaCor) => {
          return listaCor.fkProduto?.id === produto.id;
        });

        const coresDoProduto = coresVinculadas
          .map((listaCor) => listaCor.fkCor)
          .filter((cor): cor is Cor => cor !== undefined);

        const categoriasVinculadas = listaCategoriasData.filter(
          (listaCategoria) => {
            return listaCategoria.fkProduto?.id === produto.id;
          }
        );

        const categoriasDoProduto = categoriasVinculadas
          .map((listaCategoria) => listaCategoria.fkCategoria)
          .filter(
            (categoria): categoria is Categoria => categoria !== undefined
          );

        console.log(`Recarregar - Produto ${produto.nome}:`, {
          cores: coresDoProduto,
          categorias: categoriasDoProduto,
        });

        return {
          ...produto,
          listaCores: coresDoProduto,
          listaCategorias: categoriasDoProduto,
        };
      });

      setProdutos(produtosComVinculos);
    } catch (error) {
      console.error("Erro ao recarregar produtos:", error);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      setLoadingSubmit(true);

      // Preparar dados do produto
      const produtoData: CriarProdutoPayload = {
        nome: data.nome,
        codigoBarra: data.codigoBarra,
        descricao: data.descricao,
        valor: parseFloat(data.valor),
        especificacoes: especificacoes.reduce((acc, esp) => {
          if (esp.chave && esp.valor) {
            acc[esp.chave] = esp.valor;
          }
          return acc;
        }, {} as Record<string, any>),
        fkTamanho: { id: parseInt(data.fkTamanho) },
        fkUnidade: { id: parseInt(data.fkUnidade) },
      };

      let produtoSalvo: Produto;

      if (produtoParaEditar?.id) {
        // Atualizar produto existente
        produtoSalvo = await produtoService.atualizar(
          produtoParaEditar.id,
          produtoData
        );

        // Remover vínculos antigos - TEMPORARIAMENTE DESABILITADO
        // Backend não suporta DELETE em tabelas de ligação ainda
        // if (produtoParaEditar.listaCores) {
        //   for (const cor of produtoParaEditar.listaCores) {
        //     await produtoService.excluirListaCor(cor.id, produtoParaEditar.id);
        //   }
        // }
        // if (produtoParaEditar.listaCategorias) {
        //   for (const categoria of produtoParaEditar.listaCategorias) {
        //     await produtoService.excluirListaCategoria(
        //       categoria.id,
        //       produtoParaEditar.id
        //     );
        //   }
        // }
      } else {
        // Criar novo produto
        produtoSalvo = await produtoService.criar(produtoData);
      }

      // Salvar cores selecionadas (ListaCor)
      if (data.cores && data.cores.length > 0) {
        for (const corId of data.cores) {
          await produtoService.criarListaCor(parseInt(corId), produtoSalvo.id);
        }
      }

      // Salvar categorias selecionadas (ListaCategoria)
      if (data.categorias && data.categorias.length > 0) {
        for (const categoriaId of data.categorias) {
          await produtoService.criarListaCategoria(
            parseInt(categoriaId),
            produtoSalvo.id
          );
        }
      }

      // Recarregar produtos
      await recarregarProdutos();

      setShowModal(false);
      alert(
        produtoParaEditar
          ? "Produto atualizado com sucesso!"
          : "Produto criado com sucesso!"
      );
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto. Por favor, tente novamente.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const adicionarEspecificacao = () => {
    setEspecificacoes([...especificacoes, { chave: "", valor: "" }]);
  };

  const removerEspecificacao = (index: number) => {
    setEspecificacoes(especificacoes.filter((_, i) => i !== index));
  };

  const atualizarEspecificacao = (
    index: number,
    campo: "chave" | "valor",
    valor: string
  ) => {
    const novasEspecificacoes = [...especificacoes];
    novasEspecificacoes[index][campo] = valor;
    setEspecificacoes(novasEspecificacoes);
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            {
              label: "Produtos",
              href: "/produtos",
              active: true,
            },
          ]}
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Cabeçalho */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900">
              Gestão de Produtos
            </h1>
            <button
              onClick={handleNovoProduto}
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
              Novo Produto
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
                placeholder="Buscar produtos..."
                className="pl-10 w-full rounded-lg border border-gray-300 bg-white py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <SelectInput
              name="categoria_filtro"
              options={categoriasOptions}
              placeholder="Filtrar por categoria"
              className="w-full"
            />
            <SelectInput
              name="cor_filtro"
              options={coresOptions}
              placeholder="Filtrar por cor"
              className="w-full"
            />
            <SelectInput
              name="tamanho_filtro"
              options={tamanhosOptions}
              placeholder="Filtrar por tamanho"
              className="w-full"
            />
          </div>
        </div>

        {/* Tabela */}
        <div className="w-full">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando...</p>
            </div>
          ) : (
            <DataTable
              data={produtos}
              columns={columns}
              onEdit={handleEditarProduto}
              onDelete={handleExcluirProduto}
              onView={handleVisualizarProduto}
            />
          )}
        </div>
      </div>

      {/* Modal de Formulário */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={produtoParaEditar ? "Editar Produto" : "Novo Produto"}
        size="full"
      >
        <FormProvider {...methods}>
          <FormLayout
            title={
              produtoParaEditar ? "Edição de Produto" : "Cadastro de Produto"
            }
            onSubmit={methods.handleSubmit(handleSubmit)}
            submitText={loadingSubmit ? "Salvando..." : "Salvar"}
            cancelText="Cancelar"
            onCancel={() => setShowModal(false)}
            className="max-w-4xl mx-auto"
          >
            <div className="space-y-6">
              {/* Seção de Informações Básicas */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-white">
                    Informações Básicas
                  </h3>
                </div>

                <div className="p-6 space-y-8">
                  {/* Grupo: Identificação */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-gray-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M7 8h10" />
                        <path d="M7 12h10" />
                        <path d="M7 16h10" />
                      </svg>
                      <h4 className="text-base font-medium">
                        Identificação do Produto
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField label="Nome do Produto" className="space-y-2">
                        <input
                          type="text"
                          {...methods.register("nome")}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                          placeholder="Digite o nome do produto"
                        />
                      </FormField>

                      <FormField label="Código de Barras" className="space-y-2">
                        <input
                          type="text"
                          {...methods.register("codigoBarra")}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                          placeholder="Digite o código de barras"
                        />
                      </FormField>
                    </div>

                    <FormField
                      label="Descrição do Produto"
                      className="space-y-2"
                    >
                      <textarea
                        {...methods.register("descricao")}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        rows={3}
                        placeholder="Digite uma descrição detalhada do produto"
                      />
                    </FormField>
                  </div>

                  {/* Grupo: Preço */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-gray-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      <h4 className="text-base font-medium">Preço</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField label="Valor Unitário" className="space-y-2">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">R$</span>
                          </div>
                          <input
                            type="number"
                            step="0.01"
                            {...methods.register("valor")}
                            className="w-full rounded-lg border-gray-300 pl-8 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                            placeholder="0,00"
                          />
                        </div>
                      </FormField>
                    </div>
                  </div>

                  {/* Grupo: Características */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-gray-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                      <h4 className="text-base font-medium">
                        Características do Produto
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="Categorias"
                        className="space-y-2 md:col-span-2"
                      >
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="flex-1">
                            <SelectInput
                              name="categorias"
                              options={categoriasOptions}
                              placeholder="Selecione as categorias"
                              isMulti={true}
                              className="rounded-lg"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowCategoriaModal(true)}
                            className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap flex-shrink-0"
                          >
                            Nova Categoria
                          </button>
                        </div>
                      </FormField>

                      <FormField
                        label="Unidade de Medida"
                        className="space-y-2"
                      >
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="flex-1">
                            <SelectInput
                              name="fkUnidade"
                              options={unidadesOptions}
                              placeholder="Selecione a unidade"
                              className="rounded-lg"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowUnidadeModal(true)}
                            className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap flex-shrink-0"
                          >
                            Nova Unidade
                          </button>
                        </div>
                      </FormField>

                      <FormField label="Tamanho/Dimensão" className="space-y-2">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="flex-1">
                            <SelectInput
                              name="fkTamanho"
                              options={tamanhosOptions}
                              placeholder="Selecione o tamanho"
                              className="rounded-lg"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowTamanhoModal(true)}
                            className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap flex-shrink-0"
                          >
                            Novo Tamanho
                          </button>
                        </div>
                      </FormField>

                      <FormField
                        label="Cores Disponíveis"
                        className="space-y-2 md:col-span-2"
                      >
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="flex-1">
                            <SelectInput
                              name="cores"
                              options={coresOptions}
                              placeholder="Selecione as cores"
                              isMulti={true}
                              className="rounded-lg"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowCorModal(true)}
                            className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap flex-shrink-0"
                          >
                            Nova Cor
                          </button>
                        </div>
                      </FormField>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção de Especificações Técnicas */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-white">
                    Especificações Técnicas
                  </h3>
                  <p className="mt-1 text-sm text-blue-50">
                    Adicione especificações técnicas detalhadas do produto
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  {especificacoes.map((esp, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-blue-200 transition-colors duration-200"
                    >
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome da Especificação
                        </label>
                        <input
                          type="text"
                          value={esp.chave}
                          onChange={(e) =>
                            atualizarEspecificacao(
                              index,
                              "chave",
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                          placeholder="Ex: Material, Dimensões, etc"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Valor da Especificação
                        </label>
                        <input
                          type="text"
                          value={esp.valor}
                          onChange={(e) =>
                            atualizarEspecificacao(
                              index,
                              "valor",
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                          placeholder="Ex: Algodão, 30x40cm, etc"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removerEspecificacao(index)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Remover Especificação"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={adicionarEspecificacao}
                    className="w-full py-3 border-2 border-dashed border-blue-200 rounded-lg text-blue-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2 group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transform group-hover:scale-110 transition-transform duration-200"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Adicionar Nova Especificação
                  </button>
                </div>
              </div>
            </div>
          </FormLayout>
        </FormProvider>
      </Modal>

      {/* Modal de Visualização */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title={`Visualizar Produto - ${produtoParaVisualizar?.nome}`}
        size="xl"
      >
        {produtoParaVisualizar && (
          <div className="space-y-6">
            {/* Informações do Produto */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">
                Informações do Produto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Nome</p>
                  <p className="text-gray-900">{produtoParaVisualizar.nome}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Código de Barras
                  </p>
                  <p className="text-gray-900">
                    {produtoParaVisualizar.codigoBarra}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Descrição</p>
                  <p className="text-gray-900">
                    {produtoParaVisualizar.descricao}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Valor</p>
                  <p className="text-gray-900">
                    {produtoParaVisualizar.valor.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Tamanho</p>
                  <p className="text-gray-900">
                    {produtoParaVisualizar.fkTamanho?.nome || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Unidade</p>
                  <p className="text-gray-900">
                    {produtoParaVisualizar.fkUnidade?.nome || "-"}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">Categorias</p>
                <p className="text-gray-900">
                  {produtoParaVisualizar.listaCategorias
                    ?.map((cat) => cat.nome)
                    .join(", ") || "Nenhuma categoria"}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">Cores</p>
                <p className="text-gray-900">
                  {produtoParaVisualizar.listaCores
                    ?.map((cor) => cor.nome)
                    .join(", ") || "Nenhuma cor"}
                </p>
              </div>

              {Object.keys(produtoParaVisualizar.especificacoes || {}).length >
                0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700">
                    Especificações
                  </p>
                  <div className="mt-2 space-y-1">
                    {Object.entries(produtoParaVisualizar.especificacoes).map(
                      ([chave, valor]) => (
                        <div key={chave} className="flex justify-between">
                          <span className="text-gray-600">{chave}:</span>
                          <span className="text-gray-900">{String(valor)}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
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
                  handleEditarProduto(produtoParaVisualizar);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Editar Produto
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal para criar nova cor */}
      <Modal
        isOpen={showCorModal}
        onClose={() => setShowCorModal(false)}
        title="Criar Nova Cor"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Cor
            </label>
            <input
              type="text"
              value={novoCorNome}
              onChange={(e) => setNovoCorNome(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              placeholder="Digite o nome da cor"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => {
                setShowCorModal(false);
                setNovoCorNome("");
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleCriarCor}
              disabled={loadingCreate || !novoCorNome.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingCreate ? "Criando..." : "Criar Cor"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal para criar nova categoria */}
      <Modal
        isOpen={showCategoriaModal}
        onClose={() => setShowCategoriaModal(false)}
        title="Criar Nova Categoria"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Categoria
            </label>
            <input
              type="text"
              value={novaCategoriaNome}
              onChange={(e) => setNovaCategoriaNome(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              placeholder="Digite o nome da categoria"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => {
                setShowCategoriaModal(false);
                setNovaCategoriaNome("");
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleCriarCategoria}
              disabled={loadingCreate || !novaCategoriaNome.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingCreate ? "Criando..." : "Criar Categoria"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal para criar novo tamanho */}
      <Modal
        isOpen={showTamanhoModal}
        onClose={() => setShowTamanhoModal(false)}
        title="Criar Novo Tamanho"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Tamanho
            </label>
            <input
              type="text"
              value={novoTamanhoNome}
              onChange={(e) => setNovoTamanhoNome(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              placeholder="Digite o nome do tamanho"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => {
                setShowTamanhoModal(false);
                setNovoTamanhoNome("");
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleCriarTamanho}
              disabled={loadingCreate || !novoTamanhoNome.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingCreate ? "Criando..." : "Criar Tamanho"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal para criar nova unidade */}
      <Modal
        isOpen={showUnidadeModal}
        onClose={() => setShowUnidadeModal(false)}
        title="Criar Nova Unidade"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Unidade
            </label>
            <input
              type="text"
              value={novaUnidadeNome}
              onChange={(e) => setNovaUnidadeNome(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              placeholder="Digite o nome da unidade"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => {
                setShowUnidadeModal(false);
                setNovaUnidadeNome("");
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleCriarUnidade}
              disabled={loadingCreate || !novaUnidadeNome.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingCreate ? "Criando..." : "Criar Unidade"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
