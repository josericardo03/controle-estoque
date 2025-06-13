"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Breadcrumb } from "@/Components/ui/breadcrumb";
import { SaleHeader } from "@/Components/ui/sale-header";
import { ProductSearch } from "@/Components/ui/product-search";
import { ProductArea } from "@/Components/ui/product-area";
import { SaleSummary } from "@/Components/ui/sale-summary";
import { PaymentForm } from "@/Components/ui/payment-form";
import { SaleActions } from "@/Components/ui/sale-actions";
import { ClientSelect } from "@/Components/ui/client-select";
import {
  Venda,
  Vendedor,
  VendedorOption,
  StatusVendaOption,
  Caixa,
  CaixaOption,
  Cliente,
  ClienteOption,
  ItemVenda,
} from "@/types/sale";

// Mock data
const mockVendedores: VendedorOption[] = [
  { value: "1", label: "João Silva" },
  { value: "2", label: "Maria Santos" },
];

const mockCaixas: CaixaOption[] = [
  { value: "1", label: "1 - Caixa Principal" },
  { value: "2", label: "2 - Caixa Secundário" },
];

const mockClientes: ClienteOption[] = [
  { value: "1", label: "Cliente 1" },
  { value: "2", label: "Cliente 2" },
];

const mockStatusVenda: StatusVendaOption[] = [
  { value: "pendente", label: "Pendente" },
  { value: "em_andamento", label: "Em Andamento" },
  { value: "finalizada", label: "Finalizada" },
  { value: "cancelada", label: "Cancelada" },
  { value: "suspensa", label: "Suspensa" },
];

const vendaInicial: Venda = {
  id: "1",
  numero: "001",
  data: new Date().toISOString(),
  cliente: null,
  vendedor: {
    id: "1",
    nome: "João Silva",
    email: "joao@email.com",
    telefone: "123456789",
  },
  caixa: {
    id: "1",
    numero: "1",
    descricao: "Caixa Principal",
    saldo: 1000,
  },
  itens: [],
  subtotal: 0,
  desconto: 0,
  total: 0,
  formaPagamento: "",
  valorPagamento: 0,
  troco: 0,
  bonus: 0,
  status: "em_andamento",
};

export default function VendasPage() {
  const [showModal, setShowModal] = useState(false);
  const [venda, setVenda] = useState<Venda>(vendaInicial);
  const [valorRecebido, setValorRecebido] = useState("0,00");
  const [bonusUtilizado, setBonusUtilizado] = useState(0);
  const [observacoes, setObservacoes] = useState("");
  const [formasPagamentoSelecionadas, setFormasPagamentoSelecionadas] =
    useState<string[]>([]);
  const [valoresPagamento, setValoresPagamento] = useState<
    Record<string, number>
  >({});
  const [dataHora, setDataHora] = useState("");
  const [historicoPagamentos, setHistoricoPagamentos] = useState<
    Array<{
      forma: string;
      valor: number;
      data: string;
      bonus?: string;
    }>
  >([]);
  const methods = useForm();

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

  const handleVendedorChange = (vendedor: Vendedor) => {
    setVenda((prev) => ({ ...prev, vendedor }));
  };

  const handleCaixaChange = (caixa: Caixa) => {
    setVenda((prev) => ({ ...prev, caixa }));
  };

  const handleAbrirFecharCaixa = () => {
    // TODO: Implementar lógica de abrir/fechar caixa
    console.log("Abrir/Fechar Caixa");
  };

  const handleSangriaSuprimento = (
    valor: number,
    tipo: "sangria" | "suprimento"
  ) => {
    // TODO: Implementar lógica de sangria/suprimento
    console.log(`${tipo}: ${valor}`);
  };

  const handleAddItem = (item: ItemVenda) => {
    setVenda((prev) => {
      const itens = [...prev.itens, item];
      const subtotal = itens.reduce((acc, item) => acc + item.subtotal, 0);
      const total = subtotal - prev.desconto;
      return { ...prev, itens, subtotal, total };
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setVenda((prev) => {
      const itens = prev.itens.filter((item) => item.id !== itemId);
      const subtotal = itens.reduce((acc, item) => acc + item.subtotal, 0);
      const total = subtotal - prev.desconto;
      return { ...prev, itens, subtotal, total };
    });
  };

  const handleDescontoChange = (desconto: number) => {
    setVenda((prev) => {
      const total = prev.subtotal - desconto;
      return { ...prev, desconto, total };
    });
  };

  const handleFormaPagamentoChange = (formaPagamento: string) => {
    setVenda((prev) => ({ ...prev, formaPagamento }));
  };

  const handleValorPagamentoChange = (valorPagamento: number) => {
    setVenda((prev) => {
      const troco = valorPagamento - prev.total;
      return { ...prev, valorPagamento, troco };
    });
  };

  const handleAdicionarPagamento = (pagamento: {
    forma: string;
    valor: number;
    data: string;
    bonus?: string;
  }) => {
    setHistoricoPagamentos((prev) => [...prev, pagamento]);
    setVenda((prev) => ({
      ...prev,
      bonus: prev.bonus + (pagamento.forma === "bonus" ? pagamento.valor : 0),
    }));
  };

  const handleClienteSelect = (cliente: Cliente | null) => {
    setVenda((prev) => ({ ...prev, cliente }));
  };

  const handleFinalizar = () => {
    if (!venda.cliente) {
      alert("Selecione um cliente para finalizar a venda");
      return;
    }

    if (venda.itens.length === 0) {
      alert("Adicione pelo menos um item à venda");
      return;
    }

    if (historicoPagamentos.length === 0) {
      alert("Adicione pelo menos uma forma de pagamento");
      return;
    }

    const valorTotalPago = historicoPagamentos.reduce(
      (acc, pagamento) => acc + pagamento.valor,
      0
    );

    if (valorTotalPago < venda.total) {
      alert("Valor total pago insuficiente");
      return;
    }

    setVenda((prev) => ({ ...prev, status: "finalizada" }));
    // TODO: Implementar lógica de finalização da venda
    console.log("Venda finalizada:", venda);
  };

  const handleCancelar = () => {
    if (confirm("Tem certeza que deseja cancelar a venda?")) {
      setVenda((prev) => ({ ...prev, status: "cancelada" }));
      // TODO: Implementar lógica de cancelamento da venda
      console.log("Venda cancelada:", venda);
    }
  };

  const handleSuspender = () => {
    if (confirm("Tem certeza que deseja suspender a venda?")) {
      setVenda((prev) => ({ ...prev, status: "suspensa" }));
      // TODO: Implementar lógica de suspensão da venda
      console.log("Venda suspensa:", venda);
    }
  };

  const handleImprimir = () => {
    // TODO: Implementar lógica de impressão
    console.log("Imprimir venda:", venda);
  };

  const handleEnviarEmail = () => {
    if (!venda.cliente?.email) {
      alert("Cliente não possui email cadastrado");
      return;
    }
    // TODO: Implementar lógica de envio por email
    console.log("Enviar por email:", venda);
  };

  const handleEnviarWhatsApp = () => {
    if (!venda.cliente?.telefone) {
      alert("Cliente não possui telefone cadastrado");
      return;
    }
    // TODO: Implementar lógica de envio por WhatsApp
    console.log("Enviar por WhatsApp:", venda);
  };

  return (
    <div className="container mx-auto p-4">
      <SaleHeader
        numero={venda.numero}
        dataHora={dataHora}
        vendedor={venda.vendedor}
        vendedores={mockVendedores}
        caixa={venda.caixa}
        caixas={mockCaixas}
        statusVenda={mockStatusVenda}
        onVendedorChange={handleVendedorChange}
        onCaixaChange={handleCaixaChange}
        onAbrirFecharCaixa={handleAbrirFecharCaixa}
        onSangriaSuprimento={handleSangriaSuprimento}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <ClientSelect
            cliente={venda.cliente}
            clientes={mockClientes}
            onSelect={handleClienteSelect}
          />
          <ProductSearch onSelect={handleAddItem} />
          <ProductArea itens={venda.itens} onRemoveItem={handleRemoveItem} />
        </div>

        <div>
          <SaleSummary
            subtotal={venda.subtotal}
            desconto={venda.desconto}
            total={venda.total}
            troco={venda.troco}
            onDescontoChange={handleDescontoChange}
          />

          <PaymentForm
            formaPagamento={venda.formaPagamento}
            valorPagamento={venda.valorPagamento}
            troco={venda.troco}
            historicoPagamentos={historicoPagamentos}
            onFormaPagamentoChange={handleFormaPagamentoChange}
            onValorPagamentoChange={handleValorPagamentoChange}
            onAdicionarPagamento={handleAdicionarPagamento}
          />

          <SaleActions
            venda={venda}
            onFinalizar={handleFinalizar}
            onCancelar={handleCancelar}
            onSuspender={handleSuspender}
            onImprimir={handleImprimir}
            onEnviarEmail={handleEnviarEmail}
            onEnviarWhatsApp={handleEnviarWhatsApp}
          />
        </div>
      </div>
    </div>
  );
}
