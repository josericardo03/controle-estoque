"use client";

import { useState } from "react";

interface HistoricoPagamento {
  forma: string;
  valor: number;
  data: string;
  bonus?: string;
}

interface PaymentFormProps {
  formaPagamento: string;
  valorPagamento: number;
  troco: number;
  historicoPagamentos: HistoricoPagamento[];
  onFormaPagamentoChange: (formaPagamento: string) => void;
  onValorPagamentoChange: (valorPagamento: number) => void;
  onAdicionarPagamento: (pagamento: HistoricoPagamento) => void;
}

export function PaymentForm({
  formaPagamento,
  valorPagamento,
  troco,
  historicoPagamentos,
  onFormaPagamentoChange,
  onValorPagamentoChange,
  onAdicionarPagamento,
}: PaymentFormProps) {
  const [showBonusField, setShowBonusField] = useState(false);
  const [descricaoBonus, setDescricaoBonus] = useState("");

  const formasPagamento = [
    { value: "dinheiro", label: "Dinheiro" },
    { value: "cartao_credito", label: "Cartão de Crédito" },
    { value: "cartao_debito", label: "Cartão de Débito" },
    { value: "pix", label: "PIX" },
    { value: "bonus", label: "Bônus" },
  ];

  const handleFormaPagamentoChange = (forma: string) => {
    onFormaPagamentoChange(forma);
    setShowBonusField(forma === "bonus");
    if (forma !== "bonus") {
      setDescricaoBonus("");
    }
  };

  const handleAdicionarPagamento = () => {
    if (!formaPagamento || valorPagamento <= 0) {
      alert("Selecione uma forma de pagamento e informe um valor válido");
      return;
    }

    if (formaPagamento === "bonus" && !descricaoBonus) {
      alert("Informe a descrição do bônus");
      return;
    }

    const pagamento: HistoricoPagamento = {
      forma: formaPagamento,
      valor: valorPagamento,
      data: new Date().toLocaleString("pt-BR"),
      ...(formaPagamento === "bonus" && { bonus: descricaoBonus }),
    };

    onAdicionarPagamento(pagamento);
    onFormaPagamentoChange("");
    onValorPagamentoChange(0);
    setDescricaoBonus("");
    setShowBonusField(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
      <h2 className="text-lg font-semibold mb-4">Pagamento</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Forma de Pagamento
          </label>
          <select
            value={formaPagamento}
            onChange={(e) => handleFormaPagamentoChange(e.target.value)}
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
            Valor Pago
          </label>
          <input
            type="number"
            value={valorPagamento}
            onChange={(e) => onValorPagamentoChange(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {showBonusField && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descrição do Bônus
            </label>
            <textarea
              value={descricaoBonus}
              onChange={(e) => setDescricaoBonus(e.target.value)}
              placeholder="Descreva o motivo do bônus..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Troco
          </label>
          <input
            type="number"
            value={troco}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
          />
        </div>

        <button
          onClick={handleAdicionarPagamento}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Adicionar Pagamento
        </button>

        {historicoPagamentos.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Histórico de Pagamentos
            </h3>
            <div className="space-y-2">
              {historicoPagamentos.map((pagamento, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded"
                >
                  <div>
                    <span className="font-medium">
                      {formasPagamento.find((f) => f.value === pagamento.forma)
                        ?.label || pagamento.forma}
                    </span>
                    {pagamento.bonus && (
                      <p className="text-gray-500 text-xs">{pagamento.bonus}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-medium">
                      {pagamento.valor.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                    <p className="text-gray-500 text-xs">{pagamento.data}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
