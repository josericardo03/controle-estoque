"use client";

import { useState } from "react";
import BuscarPessoas from "@/Components/BuscarPessoas";
import DetalhePessoa from "@/Components/DetalhePessoa";

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

export default function PessoasPage() {
  const [pessoaSelecionada, setPessoaSelecionada] = useState<Pessoa | null>(
    null
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Pessoas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BuscarPessoas onPessoaSelecionada={setPessoaSelecionada} />
        <DetalhePessoa pessoa={pessoaSelecionada} />
      </div>
    </div>
  );
}
