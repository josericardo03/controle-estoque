import api from "./api";

export interface Pessoa {
  id?: number;
  nome: string;
  email: string;
  cpf?: string;
  cnpj?: string;
  dataNascimento?: string;
  telefone?: string;
  fkEndereco: {
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

// Interfaces para criação e atualização (apenas IDs para relacionamentos)
export interface CriarPessoaPayload {
  nome: string;
  email: string;
  cpf?: string | null;
  cnpj?: string | null;
  dataNascimento?: string;
  telefone?: string;
  fkEndereco: {
    id?: number;
    logradouro: string;
    numero: string;
    complemento?: string;
    cep: string;
    bairro: { id: number };
  };
}

export interface AtualizarPessoaPayload {
  nome: string;
  email: string;
  cpf?: string | null;
  cnpj?: string | null;
  dataNascimento?: string;
  telefone?: string;
  fkEndereco: {
    id?: number;
    logradouro: string;
    numero: string;
    complemento?: string;
    cep: string;
    bairro: { id: number };
  };
}

export const pessoaService = {
  listar: async () => {
    const response = await api.get<Pessoa[]>("/pessoas");
    return response.data;
  },

  buscarPorId: async (id: number) => {
    const response = await api.get<Pessoa>(`/pessoas/${id}`);
    return response.data;
  },

  criar: async (pessoa: CriarPessoaPayload) => {
    const response = await api.post<Pessoa>("/pessoas", pessoa);
    return response.data;
  },

  atualizar: async (id: number, pessoa: AtualizarPessoaPayload) => {
    const response = await api.put<Pessoa>(`/pessoas/${id}`, pessoa);
    return response.data;
  },

  excluir: async (id: number) => {
    await api.delete(`/pessoas/${id}`);
  },
};
