"use client";

import { useState } from "react";

interface SaleSummaryProps {
  subtotal: number;
  desconto: number;
  total: number;
  troco: number;
  onDescontoChange: (desconto: number) => void;
}

export function SaleSummary({
  subtotal,
  desconto,
  total,
  troco,
  onDescontoChange,
}: SaleSummaryProps) {
  const [descontoInput, setDescontoInput] = useState("");

  const handleDescontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setDescontoInput(valor);
    const descontoValue = parseFloat(valor) || 0;
    onDescontoChange(descontoValue);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Resumo da Venda</h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">
            {subtotal.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Desconto
          </label>
          <input
            type="number"
            value={descontoInput}
            onChange={handleDescontoChange}
            placeholder="R$ 0,00"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Total:</span>
          <span className="font-medium">
            {total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Troco:</span>
          <span className="font-medium">
            {troco.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
