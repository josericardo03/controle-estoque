"use client";

import { useState, ChangeEvent } from "react";
import { Input } from "@/Components/ui/input";

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  bonus: number;
}

interface ClientSearchProps {
  onSelect: (cliente: Cliente) => void;
}

export function ClientSearch({ onSelect }: ClientSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<Cliente[]>([]);

  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    if (value.length >= 3) {
      // TODO: Implementar busca real de clientes
      setResults([
        {
          id: "1",
          nome: "João Silva",
          telefone: "(11) 99999-9999",
          email: "joao@email.com",
          bonus: 50.0,
        },
        {
          id: "2",
          nome: "Maria Santos",
          telefone: "(11) 98888-8888",
          email: "maria@email.com",
          bonus: 100.0,
        },
      ]);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleSelect = (cliente: Cliente) => {
    onSelect(cliente);
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
        placeholder="Buscar cliente por nome, telefone ou email..."
        className="w-full"
      />
      {showResults && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          <ul className="max-h-60 overflow-auto">
            {results.map((cliente) => (
              <li
                key={cliente.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(cliente)}
              >
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <span className="font-medium">{cliente.nome}</span>
                    <span className="text-green-600">
                      Bônus:{" "}
                      {cliente.bonus.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span>{cliente.telefone}</span>
                    <span className="mx-2">•</span>
                    <span>{cliente.email}</span>
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
