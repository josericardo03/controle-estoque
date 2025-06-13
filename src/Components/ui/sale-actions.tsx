"use client";

import { Venda } from "@/types/sale";

interface SaleActionsProps {
  venda: Venda;
  onFinalizar: () => void;
  onCancelar: () => void;
  onSuspender: () => void;
  onImprimir: () => void;
  onEnviarEmail: () => void;
  onEnviarWhatsApp: () => void;
}

export function SaleActions({
  venda,
  onFinalizar,
  onCancelar,
  onSuspender,
  onImprimir,
  onEnviarEmail,
  onEnviarWhatsApp,
}: SaleActionsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onFinalizar}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Finalizar Venda
        </button>
        <button
          onClick={onCancelar}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Cancelar
        </button>
        <button
          onClick={onSuspender}
          className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
        >
          Suspender
        </button>
        <button
          onClick={onImprimir}
          className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Imprimir
        </button>
        <button
          onClick={onEnviarEmail}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Enviar por Email
        </button>
        <button
          onClick={onEnviarWhatsApp}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Enviar por WhatsApp
        </button>
      </div>
    </div>
  );
}
