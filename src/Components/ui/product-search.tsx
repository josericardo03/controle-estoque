"use client";

import { useState } from "react";
import { Product, ItemVenda } from "@/types/sale";

interface ProductSearchProps {
  onSelect: (item: ItemVenda) => void;
}

export function ProductSearch({ onSelect }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  // Mock data
  const mockProducts: Product[] = [
    {
      id: "1",
      codigo: "001",
      descricao: "Produto 1",
      preco: 10.0,
    },
    {
      id: "2",
      codigo: "002",
      descricao: "Produto 2",
      preco: 20.0,
    },
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length >= 3) {
      const filtered = mockProducts.filter(
        (product) =>
          product.codigo.toLowerCase().includes(term.toLowerCase()) ||
          product.descricao.toLowerCase().includes(term.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  const handleSelect = (product: Product) => {
    const item: ItemVenda = {
      id: Math.random().toString(),
      codigo: product.codigo,
      produto: product.descricao,
      quantidade: 1,
      precoUnitario: product.preco,
      subtotal: product.preco,
    };
    onSelect(item);
    setSearchTerm("");
    setResults([]);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Buscar Produto</h2>

      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Digite o código ou nome do produto..."
          className="w-full p-2 border rounded"
        />

        {results.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
            {results.map((product) => (
              <div
                key={product.id}
                onClick={() => handleSelect(product)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="font-medium">{product.descricao}</div>
                <div className="text-sm text-gray-500">
                  Código: {product.codigo} | Preço: R${" "}
                  {product.preco.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
