export type StatusVenda =
  | "pendente"
  | "em_andamento"
  | "finalizada"
  | "cancelada"
  | "suspensa";

export interface Vendedor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}

export interface VendedorOption {
  value: string;
  label: string;
}

export interface StatusVendaOption {
  value: StatusVenda;
  label: string;
}

export interface FormaPagamentoOption {
  value: string;
  label: string;
}

export interface HistoricoPagamento {
  forma: string;
  valor: number;
  data: string;
}

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
}

export interface ClienteOption {
  value: string;
  label: string;
}

export interface Product {
  id: string;
  codigo: string;
  descricao: string;
  preco: number;
}

export interface ItemVenda {
  id: string;
  codigo: string;
  produto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Caixa {
  id: string;
  numero: string;
  descricao: string;
  saldo: number;
}

export interface CaixaOption {
  value: string;
  label: string;
}

export interface Venda {
  id: string;
  numero: string;
  data: string;
  cliente: Cliente | null;
  vendedor: Vendedor;
  caixa: Caixa;
  itens: ItemVenda[];
  subtotal: number;
  desconto: number;
  total: number;
  formaPagamento: string;
  valorPagamento: number;
  troco: number;
  bonus: number;
  status: StatusVenda;
}
