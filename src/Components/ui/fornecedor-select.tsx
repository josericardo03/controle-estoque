"use client";

import { useState } from "react";
import { Fornecedor, FornecedorOption } from "@/types/sale";
import { SelectInput } from "@/Components/ui/select";
import { FornecedorSearch } from "./fornecedor-search";

interface FornecedorSelectProps {
  fornecedor: Fornecedor | null;
  fornecedores: FornecedorOption[];
  onSelect: (fornecedor: Fornecedor | null) => void;
}

export function FornecedorSelect({
  fornecedor,
  fornecedores,
  onSelect,
}: FornecedorSelectProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [useSearch, setUseSearch] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Fornecedor</h2>

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
              name="fornecedor"
              label="Selecione o Fornecedor"
              options={fornecedores}
              value={
                fornecedor
                  ? { value: fornecedor.id, label: fornecedor.nome }
                  : null
              }
              onChange={(option) => {
                if (option) {
                  onSelect({
                    id: option.value,
                    nome: option.label,
                    email: "",
                    telefone: "",
                    cnpj: "",
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
              Buscar Fornecedor
            </label>
            {fornecedor ? (
              <div className="mb-4">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-blue-800">
                        Fornecedor Selecionado:
                      </p>
                      <p className="text-sm text-blue-700">{fornecedor.nome}</p>
                      {fornecedor.email && (
                        <p className="text-xs text-blue-600">
                          {fornecedor.email}
                        </p>
                      )}
                      {fornecedor.telefone && (
                        <p className="text-xs text-blue-600">
                          {fornecedor.telefone}
                        </p>
                      )}
                      {fornecedor.cnpj && (
                        <p className="text-xs text-blue-600">
                          CNPJ: {fornecedor.cnpj}
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
              <FornecedorSearch
                onSelect={(fornecedor) => {
                  onSelect({
                    id: fornecedor.id,
                    nome: fornecedor.nome,
                    email: fornecedor.email,
                    telefone: fornecedor.telefone,
                    cnpj: fornecedor.cnpj,
                  });
                }}
              />
            )}
          </div>
        )}

        {fornecedor && (
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700">
                Detalhes do Fornecedor
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
                  <span className="font-medium">Nome:</span> {fornecedor.nome}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {fornecedor.email}
                </p>
                <p>
                  <span className="font-medium">Telefone:</span>{" "}
                  {fornecedor.telefone}
                </p>
                <p>
                  <span className="font-medium">CNPJ:</span> {fornecedor.cnpj}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
