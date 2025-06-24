import api from "./api";

export interface Cor {
  id: number;
  nome: string;
}

export interface Categoria {
  id: number;
  nome: string;
}

export interface Tamanho {
  id: number;
  nome: string;
}

export interface Unidade {
  id: number;
  nome: string;
}

export interface Produto {
  id: number;
  nome: string;
  codigoBarra: string;
  descricao: string;
  valor: number;
  especificacoes: Record<string, any>;
  fkTamanho: Tamanho;
  fkUnidade: Unidade;
  listaCores?: Cor[];
  listaCategorias?: Categoria[];
}

export interface CriarProdutoPayload {
  nome: string;
  codigoBarra: string;
  descricao: string;
  valor: number;
  especificacoes: Record<string, any>;
  fkTamanho: { id: number };
  fkUnidade: { id: number };
}

export interface AtualizarProdutoPayload extends CriarProdutoPayload {}

export const produtoService = {
  // Cores
  listarCores: (): Promise<Cor[]> => api.get("/cores").then((res) => res.data),

  criarCor: (data: { nome: string }): Promise<Cor> =>
    api.post("/cores", data).then((res) => res.data),

  // Categorias
  listarCategorias: (): Promise<Categoria[]> =>
    api.get("/categorias").then((res) => res.data),

  criarCategoria: (data: { nome: string }): Promise<Categoria> =>
    api.post("/categorias", data).then((res) => res.data),

  // Tamanhos
  listarTamanhos: (): Promise<Tamanho[]> =>
    api.get("/tamanhos").then((res) => res.data),

  criarTamanho: (data: { nome: string }): Promise<Tamanho> =>
    api.post("/tamanhos", data).then((res) => res.data),

  // Unidades
  listarUnidades: (): Promise<Unidade[]> =>
    api.get("/unidades").then((res) => res.data),

  criarUnidade: (data: { nome: string }): Promise<Unidade> =>
    api.post("/unidades", data).then((res) => res.data),

  // Produtos
  listar: (): Promise<Produto[]> =>
    api.get("/produtos").then((res) => res.data),

  buscarPorId: (id: number): Promise<Produto> =>
    api.get(`/produtos/${id}`).then((res) => res.data),

  criar: (data: CriarProdutoPayload): Promise<Produto> =>
    api.post("/produtos", data).then((res) => res.data),

  atualizar: (id: number, data: AtualizarProdutoPayload): Promise<Produto> =>
    api.put(`/produtos/${id}`, data).then((res) => res.data),

  excluir: (id: number): Promise<void> =>
    api.delete(`/produtos/${id}`).then((res) => res.data),

  // Lista Cores - Buscar todas as listas
  listarListaCores: (): Promise<any[]> =>
    api.get("/lista-cores").then((res) => res.data),

  // Lista Categorias - Buscar todas as listas
  listarListaCategorias: (): Promise<any[]> =>
    api.get("/lista-categorias").then((res) => res.data),

  // Lista Cores - Só precisa dos IDs
  criarListaCor: (corId: number, produtoId: number): Promise<any> =>
    api
      .post("/lista-cores", {
        fkCor: { id: corId },
        fkProduto: { id: produtoId },
      })
      .then((res) => res.data),

  excluirListaCor: (corId: number, produtoId: number): Promise<void> =>
    api
      .delete("/lista-cores", {
        data: {
          fkCor: { id: corId },
          fkProduto: { id: produtoId },
        },
      })
      .then((res) => res.data),

  // Lista Categorias - Só precisa dos IDs
  criarListaCategoria: (categoriaId: number, produtoId: number): Promise<any> =>
    api
      .post("/lista-categorias", {
        fkCategoria: { id: categoriaId },
        fkProduto: { id: produtoId },
      })
      .then((res) => res.data),

  excluirListaCategoria: (
    categoriaId: number,
    produtoId: number
  ): Promise<void> =>
    api
      .delete("/lista-categorias", {
        data: {
          fkCategoria: { id: categoriaId },
          fkProduto: { id: produtoId },
        },
      })
      .then((res) => res.data),
};
