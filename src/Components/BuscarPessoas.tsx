"use client";

import { useState } from "react";

interface Pessoa {
  id: string;
  nome: string;
  documento: string;
  tipo: "Fornecedor" | "Cliente";
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  compras: Array<{
    id: string;
    data: string;
    valor: number;
    produtos: string[];
  }>;
}

export default function BuscarPessoas({
  onPessoaSelecionada,
}: {
  onPessoaSelecionada: (pessoa: Pessoa) => void;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [filtroDocumento, setFiltroDocumento] = useState("CNPJ");
  const [filtroTipo, setFiltroTipo] = useState("Cliente");
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);

  const handleSearch = () => {
    // Aqui você implementará a lógica de busca real
    // Por enquanto, usando dados mockados
    const pessoasMock: Pessoa[] = [
      {
        id: "1",
        nome: "João Silva",
        documento: "123.456.789-00",
        tipo: "Cliente",
        endereco: {
          rua: "Rua das Flores",
          numero: "123",
          bairro: "Centro",
          cidade: "São Paulo",
          estado: "SP",
          cep: "01234-567",
        },
        compras: [
          {
            id: "1",
            data: "2024-03-20",
            valor: 150.0,
            produtos: ["Produto 1", "Produto 2"],
          },
        ],
      },
      {
        id: "2",
        nome: "Empresa XYZ",
        documento: "12.345.678/0001-90",
        tipo: "Fornecedor",
        endereco: {
          rua: "Avenida Principal",
          numero: "456",
          bairro: "Industrial",
          cidade: "São Paulo",
          estado: "SP",
          cep: "04567-890",
        },
        compras: [
          {
            id: "2",
            data: "2024-03-19",
            valor: 1500.0,
            produtos: ["Produto 3", "Produto 4"],
          },
        ],
      },
    ];
    setPessoas(pessoasMock);
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Buscar Pessoas</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Valor a ser pesquisado"
          className="flex-1 p-2 border rounded"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <select
          className="p-2 border rounded"
          value={filtroDocumento}
          onChange={(e) => setFiltroDocumento(e.target.value)}
        >
          <option value="CNPJ">CNPJ</option>
          <option value="CPF">CPF</option>
          <option value="NOME">NOME</option>
        </select>

        <select
          className="p-2 border rounded"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="Fornecedor">Fornecedor</option>
          <option value="Cliente">Cliente</option>
        </select>

        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Buscar
        </button>
      </div>

      <div className="border rounded">
        {pessoas.map((pessoa) => (
          <div
            key={pessoa.id}
            className="p-3 border-b hover:bg-gray-50 cursor-pointer"
            onClick={() => onPessoaSelecionada(pessoa)}
          >
            <p className="font-semibold">{pessoa.nome}</p>
            <p className="text-sm text-gray-600">
              {pessoa.documento} - {pessoa.tipo}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
