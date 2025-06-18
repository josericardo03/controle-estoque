"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { SaleHeader } from "@/Components/ui/sale-header";
import { ProductSearch } from "@/Components/ui/product-search";
import { ProductArea } from "@/Components/ui/product-area";
import { SaleSummary } from "@/Components/ui/sale-summary";
import { PaymentForm } from "@/Components/ui/payment-form";
import { ClientSelect } from "@/Components/ui/client-select";
import { FornecedorSelect } from "@/Components/ui/fornecedor-select";
import { CaixaSearch } from "@/Components/ui/caixa-search";
import {
  Venda,
  Vendedor,
  VendedorOption,
  Caixa,
  CaixaOption,
  Cliente,
  ClienteOption,
  Fornecedor,
  FornecedorOption,
  ItemVenda,
  OperacaoCaixa,
  CaixaFechado,
  Pagamento,
} from "@/types/sale";

// Mock data
const mockVendedores: VendedorOption[] = [
  { value: "1", label: "João Silva" },
  { value: "2", label: "Maria Santos" },
];

const mockCaixas: Caixa[] = [
  {
    id: "1",
    numero: "1",
    descricao: "Caixa Principal",
    saldo: 1000,
    status: "aberto",
    dataAbertura: "01/03/2024 08:00",
    operacoes: [],
    sangrias: 0,
    suprimentos: 0,
  },
  {
    id: "2",
    numero: "2",
    descricao: "Caixa Secundário",
    saldo: 500,
    status: "fechado",
    dataAbertura: "01/03/2024 08:00",
    dataFechamento: "01/03/2024 18:00",
    operacoes: [],
    sangrias: 0,
    suprimentos: 0,
  },
  {
    id: "3",
    numero: "3",
    descricao: "Caixa Expresso",
    saldo: 750,
    status: "aberto",
    dataAbertura: "01/03/2024 09:00",
    operacoes: [],
    sangrias: 0,
    suprimentos: 0,
  },
  {
    id: "4",
    numero: "4",
    descricao: "Caixa VIP",
    saldo: 2000,
    status: "fechado",
    dataAbertura: "28/02/2024 10:00",
    dataFechamento: "28/02/2024 20:00",
    operacoes: [],
    sangrias: 0,
    suprimentos: 0,
  },
  {
    id: "5",
    numero: "5",
    descricao: "Caixa Atendimento",
    saldo: 300,
    status: "aberto",
    dataAbertura: "01/03/2024 07:30",
    operacoes: [],
    sangrias: 0,
    suprimentos: 0,
  },
];

const mockClientes: ClienteOption[] = [
  { value: "1", label: "Cliente 1", bonus: 100 },
  { value: "2", label: "Cliente 2", bonus: 50 },
];

const mockFornecedores: FornecedorOption[] = [
  { value: "1", label: "Fornecedor A" },
  { value: "2", label: "Fornecedor B" },
  { value: "3", label: "Fornecedor C" },
];

const formasPagamento = [
  { value: "dinheiro", label: "Dinheiro" },
  { value: "cartao_credito", label: "Cartão de Crédito" },
  { value: "cartao_debito", label: "Cartão de Débito" },
  { value: "pix", label: "PIX" },
  { value: "boleto", label: "Boleto" },
  { value: "bonus", label: "Bônus" },
];

export default function CaixaPage() {
  const [caixas, setCaixas] = useState<Caixa[]>(mockCaixas);
  const [caixaSelecionado, setCaixaSelecionado] = useState<Caixa | null>(null);
  const [showModalOperacao, setShowModalOperacao] = useState(false);
  const [caixasFiltrados, setCaixasFiltrados] = useState<Caixa[]>(mockCaixas);
  const [dataHora, setDataHora] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(
    null
  );
  const [fornecedorSelecionado, setFornecedorSelecionado] =
    useState<Fornecedor | null>(null);
  const [itensOperacao, setItensOperacao] = useState<ItemVenda[]>([]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [formaPagamentoAtual, setFormaPagamentoAtual] = useState("");
  const [valorPagamentoAtual, setValorPagamentoAtual] = useState("");
  const [parcelasAtuais, setParcelasAtuais] = useState(1);
  const [bonusUtilizado, setBonusUtilizado] = useState(0);
  const [novoBonus, setNovoBonus] = useState("");
  const [tipoOperacao, setTipoOperacao] = useState<"compra" | "venda">("venda");
  const [operacaoEditando, setOperacaoEditando] =
    useState<OperacaoCaixa | null>(null);

  useEffect(() => {
    const data = new Date();
    setDataHora(
      data.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
  }, []);

  const handleSelecionarCaixa = (caixa: Caixa) => {
    setCaixaSelecionado(caixa);
  };

  const handleAbrirCaixa = (caixa: Caixa) => {
    const caixasAtualizados = caixas.map((c) =>
      c.id === caixa.id
        ? {
            ...c,
            status: "aberto" as const,
            dataAbertura: new Date().toLocaleString("pt-BR"),
            operacoes: [],
          }
        : c
    );
    setCaixas(caixasAtualizados);
    setCaixaSelecionado(
      caixasAtualizados.find((c) => c.id === caixa.id) || null
    );
  };

  const handleFecharCaixa = (caixa: Caixa) => {
    const caixasAtualizados = caixas.map((c) =>
      c.id === caixa.id
        ? {
            ...c,
            status: "fechado" as const,
            dataFechamento: new Date().toLocaleString("pt-BR"),
          }
        : c
    );
    setCaixas(caixasAtualizados);
    setCaixaSelecionado(null);
  };

  const handleAddItem = (item: ItemVenda) => {
    setItensOperacao((prev) => [...prev, item]);
  };

  const handleRemoveItem = (itemId: string) => {
    setItensOperacao((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleAdicionarPagamento = () => {
    if (!formaPagamentoAtual) {
      alert("Selecione uma forma de pagamento");
      return;
    }

    const valor = parseFloat(valorPagamentoAtual);
    if (isNaN(valor) || valor <= 0) {
      alert("Informe um valor válido");
      return;
    }

    if (formaPagamentoAtual === "bonus") {
      if (!clienteSelecionado) {
        alert("Selecione um cliente para usar bônus");
        return;
      }
      if (valor > (clienteSelecionado.bonus || 0)) {
        alert("Bônus insuficiente");
        return;
      }
    }

    const novoPagamento: Pagamento = {
      forma: formaPagamentoAtual,
      valor,
      ...(formaPagamentoAtual === "cartao_credito" && {
        parcelas: parcelasAtuais,
      }),
      ...(formaPagamentoAtual === "bonus" && { bonus: valor }),
    };

    setPagamentos((prev) => [...prev, novoPagamento]);
    setFormaPagamentoAtual("");
    setValorPagamentoAtual("");
    setParcelasAtuais(1);
  };

  const handleRemoverPagamento = (index: number) => {
    setPagamentos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdicionarBonus = () => {
    if (!clienteSelecionado) {
      alert("Selecione um cliente para adicionar bônus");
      return;
    }

    const valor = parseFloat(novoBonus);
    if (isNaN(valor) || valor <= 0) {
      alert("Informe um valor válido");
      return;
    }

    const clienteAtualizado = {
      ...clienteSelecionado,
      bonus: (clienteSelecionado.bonus || 0) + valor,
    };
    setClienteSelecionado(clienteAtualizado);
    setNovoBonus("");
  };

  const handleEditarOperacao = (operacao: OperacaoCaixa) => {
    setOperacaoEditando(operacao);
    setTipoOperacao(operacao.tipo);
    setClienteSelecionado(operacao.cliente || null);
    setFornecedorSelecionado(operacao.fornecedor || null);
    setItensOperacao(operacao.itens);
    setPagamentos(operacao.pagamentos);
    setShowModalOperacao(true);
  };

  const handleFinalizarOperacao = () => {
    if (!caixaSelecionado) return;

    if (itensOperacao.length === 0) {
      alert("Adicione pelo menos um item à operação");
      return;
    }

    if (pagamentos.length === 0) {
      alert("Adicione pelo menos uma forma de pagamento");
      return;
    }

    const total = itensOperacao.reduce((acc, item) => acc + item.subtotal, 0);
    const totalPago = pagamentos.reduce((acc, pag) => acc + pag.valor, 0);

    if (totalPago < total) {
      alert("Valor total pago insuficiente");
      return;
    }

    const novaOperacao: OperacaoCaixa = {
      id: operacaoEditando?.id || Date.now().toString(),
      tipo: tipoOperacao,
      data: operacaoEditando?.data || new Date().toLocaleString("pt-BR"),
      cliente:
        tipoOperacao === "venda" ? clienteSelecionado || undefined : undefined,
      fornecedor:
        tipoOperacao === "compra"
          ? fornecedorSelecionado || undefined
          : undefined,
      itens: itensOperacao,
      pagamentos,
      total,
    };

    const caixasAtualizados = caixas.map((c) =>
      c.id === caixaSelecionado.id
        ? {
            ...c,
            operacoes: operacaoEditando
              ? c.operacoes.map((op) =>
                  op.id === operacaoEditando.id ? novaOperacao : op
                )
              : [...c.operacoes, novaOperacao],
            saldo: operacaoEditando
              ? c.saldo - (operacaoEditando.total - total)
              : tipoOperacao === "venda"
              ? c.saldo + total
              : c.saldo - total,
          }
        : c
    );
    setCaixas(caixasAtualizados);
    setCaixaSelecionado(
      caixasAtualizados.find((c) => c.id === caixaSelecionado.id) || null
    );

    setShowModalOperacao(false);
    setOperacaoEditando(null);
    setClienteSelecionado(null);
    setFornecedorSelecionado(null);
    setItensOperacao([]);
    setPagamentos([]);
    setFormaPagamentoAtual("");
    setValorPagamentoAtual("");
    setParcelasAtuais(1);
    setBonusUtilizado(0);
    setNovoBonus("");
  };

  const handleNovaOperacao = () => {
    setOperacaoEditando(null);
    setTipoOperacao("venda");
    setClienteSelecionado(null);
    setFornecedorSelecionado(null);
    setItensOperacao([]);
    setPagamentos([]);
    setFormaPagamentoAtual("");
    setValorPagamentoAtual("");
    setParcelasAtuais(1);
    setBonusUtilizado(0);
    setNovoBonus("");
    setShowModalOperacao(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Caixas</h1>

      {!caixaSelecionado ? (
        // Lista de Caixas com Busca Integrada
        <div>
          <CaixaSearch
            caixas={caixas}
            onSelect={handleSelecionarCaixa}
            onFilterChange={setCaixasFiltrados}
          />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {caixasFiltrados.map((caixa) => (
              <div
                key={caixa.id}
                className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg"
                onClick={() => handleSelecionarCaixa(caixa)}
              >
                <h3 className="font-semibold">
                  Caixa {caixa.numero} - {caixa.descricao}
                </h3>
                <p className="text-sm text-gray-600">
                  Status: {caixa.status === "aberto" ? "Aberto" : "Fechado"}
                </p>
                <p className="text-sm text-gray-600">
                  Saldo: R$ {caixa.saldo.toFixed(2)}
                </p>
                {caixa.status === "aberto" && caixa.dataAbertura && (
                  <p className="text-sm text-gray-600">
                    Aberto em: {caixa.dataAbertura}
                  </p>
                )}
                {caixa.status === "fechado" && caixa.dataFechamento && (
                  <p className="text-sm text-gray-600">
                    Fechado em: {caixa.dataFechamento}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Detalhes do Caixa Selecionado
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              Caixa {caixaSelecionado.numero} - {caixaSelecionado.descricao}
            </h2>
            <div className="flex gap-2">
              {caixaSelecionado.status === "aberto" ? (
                <>
                  <button
                    onClick={handleNovaOperacao}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Nova Operação
                  </button>
                  <button
                    onClick={() => handleFecharCaixa(caixaSelecionado)}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                  >
                    Fechar Caixa
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleAbrirCaixa(caixaSelecionado)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Abrir Caixa
                </button>
              )}
              <button
                onClick={() => setCaixaSelecionado(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Voltar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Resumo do Caixa */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">Resumo do Caixa</h2>
              <div className="space-y-2">
                <p>
                  Status:{" "}
                  {caixaSelecionado.status === "aberto" ? "Aberto" : "Fechado"}
                </p>
                <p>Saldo Atual: R$ {caixaSelecionado.saldo.toFixed(2)}</p>
                {caixaSelecionado.status === "aberto" &&
                  caixaSelecionado.dataAbertura && (
                    <p>Aberto em: {caixaSelecionado.dataAbertura}</p>
                  )}
                {caixaSelecionado.status === "fechado" &&
                  caixaSelecionado.dataFechamento && (
                    <p>Fechado em: {caixaSelecionado.dataFechamento}</p>
                  )}
                <p>Data/Hora: {dataHora}</p>
              </div>
            </div>

            {/* Operações do Dia */}
            <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">Operações do Dia</h2>
              <div className="space-y-2">
                {caixaSelecionado.operacoes.map((op) => (
                  <div
                    key={op.id}
                    className={`p-2 rounded ${
                      op.tipo === "venda" ? "bg-green-50" : "bg-blue-50"
                    }`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          {op.tipo === "venda" ? "Venda" : "Compra"}
                        </p>
                        {op.cliente && (
                          <p className="text-sm text-gray-600">
                            Cliente: {op.cliente.nome}
                          </p>
                        )}
                        {op.fornecedor && (
                          <p className="text-sm text-gray-600">
                            Fornecedor: {op.fornecedor.nome}
                          </p>
                        )}
                        <div className="text-sm text-gray-600">
                          {op.pagamentos.map((pag, index) => (
                            <p key={index}>
                              {
                                formasPagamento.find(
                                  (f) => f.value === pag.forma
                                )?.label
                              }
                              {pag.parcelas && ` (${pag.parcelas}x)`}
                              {pag.bonus && " (Bônus)"}: R${" "}
                              {pag.valor.toFixed(2)}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-medium ${
                            op.tipo === "venda"
                              ? "text-green-600"
                              : "text-blue-600"
                          }`}
                        >
                          {op.tipo === "venda" ? "+" : "-"} R${" "}
                          {op.total.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">{op.data}</p>
                        {caixaSelecionado.status === "aberto" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditarOperacao(op)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => {
                                const email =
                                  op.cliente?.email || op.fornecedor?.email;
                                if (email) {
                                  window.location.href = `mailto:${email}?subject=Detalhes da ${
                                    op.tipo === "venda" ? "Venda" : "Compra"
                                  }&body=Detalhes da operação:%0D%0A%0D%0A${op.itens
                                    .map(
                                      (item) =>
                                        `- ${item.produto}: ${
                                          item.quantidade
                                        }x R$ ${item.subtotal.toFixed(2)}`
                                    )
                                    .join(
                                      "%0D%0A"
                                    )}%0D%0A%0D%0ATotal: R$ ${op.total.toFixed(
                                    2
                                  )}`;
                                } else {
                                  alert(
                                    "Email não disponível para esta operação"
                                  );
                                }
                              }}
                              className="text-green-600 hover:text-green-800 text-sm"
                            >
                              Email
                            </button>
                            <button
                              onClick={() => {
                                // Aqui você pode implementar a lógica para gerar a nota fiscal
                                alert(
                                  "Funcionalidade de emissão de nota fiscal será implementada em breve"
                                );
                              }}
                              className="text-purple-600 hover:text-purple-800 text-sm"
                            >
                              NF
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Operação */}
      {showModalOperacao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {operacaoEditando ? "Editar Operação" : "Nova Operação"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Operação
                </label>
                <select
                  value={tipoOperacao}
                  onChange={(e) =>
                    setTipoOperacao(e.target.value as "compra" | "venda")
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="venda">Venda</option>
                  <option value="compra">Compra</option>
                </select>
              </div>

              {tipoOperacao === "venda" ? (
                <ClientSelect
                  cliente={clienteSelecionado}
                  clientes={mockClientes}
                  onSelect={setClienteSelecionado}
                />
              ) : (
                <FornecedorSelect
                  fornecedor={fornecedorSelecionado}
                  fornecedores={mockFornecedores}
                  onSelect={setFornecedorSelecionado}
                />
              )}

              {tipoOperacao === "venda" && clienteSelecionado && (
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-medium">
                    Bônus disponível: R${" "}
                    {clienteSelecionado.bonus?.toFixed(2) || "0,00"}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="number"
                      value={novoBonus}
                      onChange={(e) => setNovoBonus(e.target.value)}
                      placeholder="Valor do bônus"
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      onClick={handleAdicionarBonus}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Adicionar Bônus
                    </button>
                  </div>
                </div>
              )}

              <ProductSearch onSelect={handleAddItem} />
              <ProductArea
                itens={itensOperacao}
                onRemoveItem={handleRemoveItem}
              />

              {/* Formas de Pagamento */}
              <div className="space-y-4">
                <h3 className="font-medium">Formas de Pagamento</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Forma de Pagamento
                    </label>
                    <select
                      value={formaPagamentoAtual}
                      onChange={(e) => setFormaPagamentoAtual(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Selecione...</option>
                      {formasPagamento.map((forma) => (
                        <option key={forma.value} value={forma.value}>
                          {forma.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Valor
                    </label>
                    <input
                      type="number"
                      value={valorPagamentoAtual}
                      onChange={(e) => setValorPagamentoAtual(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  {formaPagamentoAtual === "cartao_credito" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Parcelas
                      </label>
                      <select
                        value={parcelasAtuais}
                        onChange={(e) =>
                          setParcelasAtuais(Number(e.target.value))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                          <option key={num} value={num}>
                            {num}x
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAdicionarPagamento}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Adicionar Pagamento
                </button>

                {/* Lista de Pagamentos */}
                {pagamentos.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Pagamentos Adicionados</h4>
                    <div className="space-y-2">
                      {pagamentos.map((pag, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-gray-50 p-2 rounded"
                        >
                          <div>
                            <p className="font-medium">
                              {
                                formasPagamento.find(
                                  (f) => f.value === pag.forma
                                )?.label
                              }
                              {pag.parcelas && ` (${pag.parcelas}x)`}
                              {pag.bonus && " (Bônus)"}
                            </p>
                            <p className="text-sm text-gray-600">
                              R$ {pag.valor.toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoverPagamento(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowModalOperacao(false);
                    setOperacaoEditando(null);
                  }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleFinalizarOperacao}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {operacaoEditando
                    ? "Salvar Alterações"
                    : "Finalizar Operação"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
