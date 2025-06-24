import api from "./api";

export interface Estado {
  id: number;
  nome: string;
}

export interface Cidade {
  id: number;
  nome: string;
  fkEstado: Estado;
}

export interface Bairro {
  id: number;
  nome: string;
  fkCidade: Cidade;
}

export interface Endereco {
  id?: number;
  logradouro: string;
  numero: string;
  complemento?: string;
  cep: string;
  bairro: Bairro;
}

// Interfaces para criação (apenas IDs)
export interface CriarBairroPayload {
  nome: string;
  fkCidade: { id: number };
}

export interface CriarEnderecoPayload {
  logradouro: string;
  numero: string;
  complemento?: string;
  cep: string;
  bairro: { id: number };
}

export const enderecoService = {
  listarEstados: async (): Promise<Estado[]> => {
    const response = await api.get<Estado[]>("/estados");
    return response.data;
  },

  listarCidades: async (): Promise<Cidade[]> => {
    const response = await api.get<Cidade[]>("/cidades");
    return response.data;
  },

  listarBairros: async (): Promise<Bairro[]> => {
    const response = await api.get<Bairro[]>("/bairros");
    return response.data;
  },

  criarBairro: async (bairro: CriarBairroPayload): Promise<Bairro> => {
    const response = await api.post<Bairro>("/bairros", bairro);
    return response.data;
  },

  criarEndereco: async (endereco: CriarEnderecoPayload): Promise<Endereco> => {
    const response = await api.post<Endereco>("/enderecos", endereco);
    return response.data;
  },
};
