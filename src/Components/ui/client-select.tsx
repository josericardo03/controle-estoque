"use client";

import { useState } from "react";
import { Cliente, ClienteOption } from "@/types/sale";
import { SelectInput } from "@/Components/ui/select";
import { ClientSearch } from "./client-search";

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
  const [useSearch, setUseSearch] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Cliente</h2>

      <div className="space-y-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setUseSearch(false)}
            className={`px-3 py-1 rounded text-sm ${
              !useSearch
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Selecionar
          </button>
          <button
            onClick={() => setUseSearch(true)}
            className={`px-3 py-1 rounded text-sm ${
              useSearch ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Buscar
          </button>
        </div>

        {!useSearch ? (
          <div>
            <SelectInput
              name="cliente"
              label="Selecione o Cliente"
              options={clientes}
              value={
                cliente ? { value: cliente.id, label: cliente.nome } : null
              }
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
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Cliente
            </label>
            {cliente ? (
              <div className="mb-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-green-800">
                        Cliente Selecionado:
                      </p>
                      <p className="text-sm text-green-700">{cliente.nome}</p>
                      {cliente.email && (
                        <p className="text-xs text-green-600">
                          {cliente.email}
                        </p>
                      )}
                      {cliente.telefone && (
                        <p className="text-xs text-green-600">
                          {cliente.telefone}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onSelect(null)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <ClientSearch
                onSelect={(cliente) => {
                  onSelect({
                    id: cliente.id,
                    nome: cliente.nome,
                    email: cliente.email,
                    telefone: cliente.telefone,
                    cpf: "",
                  });
                }}
              />
            )}
          </div>
        )}

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
