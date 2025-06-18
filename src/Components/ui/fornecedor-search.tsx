"use client";

import { useState, ChangeEvent } from "react";
import { Input } from "@/Components/ui/input";

interface Fornecedor {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  cnpj: string;
}

interface FornecedorSearchProps {
  onSelect: (fornecedor: Fornecedor) => void;
}

export function FornecedorSearch({ onSelect }: FornecedorSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<Fornecedor[]>([]);

  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    if (value.length >= 3) {
      // TODO: Implementar busca real de fornecedores
      setResults([
        {
          id: "1",
          nome: "Fornecedor A",
          telefone: "(11) 99999-9999",
          email: "fornecedorA@email.com",
          cnpj: "12.345.678/0001-90",
        },
        {
          id: "2",
          nome: "Fornecedor B",
          telefone: "(11) 98888-8888",
          email: "fornecedorB@email.com",
          cnpj: "98.765.432/0001-10",
        },
        {
          id: "3",
          nome: "Fornecedor C",
          telefone: "(11) 97777-7777",
          email: "fornecedorC@email.com",
          cnpj: "11.222.333/0001-44",
        },
      ]);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleSelect = (fornecedor: Fornecedor) => {
    onSelect(fornecedor);
    setSearchTerm("");
    setShowResults(false);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={searchTerm}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleSearch(e.target.value)
        }
        placeholder="Buscar fornecedor por nome, telefone, email ou CNPJ..."
        className="w-full"
      />
      {showResults && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          <ul className="max-h-60 overflow-auto">
            {results.map((fornecedor) => (
              <li
                key={fornecedor.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(fornecedor)}
              >
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <span className="font-medium">{fornecedor.nome}</span>
                    <span className="text-blue-600 text-sm">
                      CNPJ: {fornecedor.cnpj}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span>{fornecedor.telefone}</span>
                    <span className="mx-2">•</span>
                    <span>{fornecedor.email}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
