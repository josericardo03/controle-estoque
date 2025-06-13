"use client";

import { InputMask } from "./input-mask";

interface FormaPagamento {
  value: string;
  label: string;
}

interface PaymentAreaProps {
  formasPagamento: FormaPagamento[];
  observacoes: string;
  onObservacoesChange: (value: string) => void;
}

export function PaymentArea({
  formasPagamento,
  observacoes,
  onObservacoesChange,
}: PaymentAreaProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Formas de Pagamento</h3>
      <div className="space-y-4">
        {formasPagamento.map((forma) => (
          <div key={forma.value} className="flex items-center gap-4">
            <input
              type="checkbox"
              id={forma.value}
              className="rounded border-gray-300"
            />
            <label htmlFor={forma.value} className="flex-1">
              {forma.label}
            </label>
            <InputMask
              name={`valor_${forma.value}`}
              mask="telefone"
              className="w-32"
            />
            {forma.value === "credito" && (
              <select className="rounded-md border-gray-300">
                <option value="1">1x</option>
                <option value="2">2x</option>
                <option value="3">3x</option>
              </select>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Observações
        </label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300"
          rows={3}
          value={observacoes}
          onChange={(e) => onObservacoesChange(e.target.value)}
        />
      </div>
    </div>
  );
}
