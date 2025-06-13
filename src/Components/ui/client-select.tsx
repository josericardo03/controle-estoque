"use client";

import { useState } from "react";
import { Cliente, ClienteOption } from "@/types/sale";
import { SelectInput } from "@/Components/ui/select";

interface ClientSelectProps {
  cliente: Cliente | null;
  clientes: ClienteOption[];
  onSelect: (cliente: Cliente | null) => void;
}

export function ClientSelect({
  cliente,
  clientes,
  onSelect,
}: ClientSelectProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Cliente</h2>

      <div className="space-y-4">
        <div>
          <SelectInput
            name="cliente"
            label="Selecione o Cliente"
            options={clientes}
            value={cliente ? { value: cliente.id, label: cliente.nome } : null}
            onChange={(option) => {
              if (option) {
                onSelect({
                  id: option.value,
                  nome: option.label,
                  email: "",
                  telefone: "",
                  cpf: "",
                });
              } else {
                onSelect(null);
              }
            }}
          />
        </div>

        {cliente && (
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700">
                Detalhes do Cliente
              </h3>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-blue-600 hover:text-blue-800"
              >
                {showDetails ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            {showDetails && (
              <div className="mt-2 space-y-2 text-sm">
                <p>
                  <span className="font-medium">Nome:</span> {cliente.nome}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {cliente.email}
                </p>
                <p>
                  <span className="font-medium">Telefone:</span>{" "}
                  {cliente.telefone}
                </p>
                <p>
                  <span className="font-medium">CPF:</span> {cliente.cpf}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
