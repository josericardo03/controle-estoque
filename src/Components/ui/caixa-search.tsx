"use client";

import { useState, useEffect } from "react";
import { Input } from "@/Components/ui/input";
import { Caixa } from "@/types/sale";

interface CaixaSearchProps {
  caixas: Caixa[];
  onSelect: (caixa: Caixa) => void;
  onFilterChange: (filteredCaixas: Caixa[]) => void;
}

interface Filtros {
  numero: string;
  descricao: string;
  status: "todos" | "aberto" | "fechado";
  dataInicio: string;
  dataFim: string;
}

export function CaixaSearch({
  caixas,
  onSelect,
  onFilterChange,
}: CaixaSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtros, setFiltros] = useState<Filtros>({
    numero: "",
    descricao: "",
    status: "todos",
    dataInicio: "",
    dataFim: "",
  });

  // Aplicar filtros
  useEffect(() => {
    let resultado = caixas.filter((caixa) => {
      const matchNumero = caixa.numero
        .toLowerCase()
        .includes(filtros.numero.toLowerCase());
      const matchDescricao = caixa.descricao
        .toLowerCase()
        .includes(filtros.descricao.toLowerCase());
      const matchStatus =
        filtros.status === "todos" || caixa.status === filtros.status;

      // Filtro por data (se implementado)
      let matchData = true;
      if (filtros.dataInicio && filtros.dataFim && caixa.dataAbertura) {
        const dataAbertura = new Date(caixa.dataAbertura);
        const inicio = new Date(filtros.dataInicio);
        const fim = new Date(filtros.dataFim);
        matchData = dataAbertura >= inicio && dataAbertura <= fim;
      }

      return matchNumero && matchDescricao && matchStatus && matchData;
    });

    // Busca por termo geral
    if (searchTerm) {
      resultado = resultado.filter(
        (caixa) =>
          caixa.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
          caixa.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    onFilterChange(resultado);
  }, [caixas, filtros, searchTerm, onFilterChange]);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Buscar e Filtrar Caixas</h2>

      <div className="space-y-4">
        {/* Campo de busca geral */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar Caixas
          </label>
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por número ou descrição..."
            className="w-full"
          />
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número
            </label>
            <Input
              type="text"
              value={filtros.numero}
              onChange={(e) =>
                setFiltros({ ...filtros, numero: e.target.value })
              }
              placeholder="Número do caixa"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <Input
              type="text"
              value={filtros.descricao}
              onChange={(e) =>
                setFiltros({ ...filtros, descricao: e.target.value })
              }
              placeholder="Descrição"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filtros.status}
              onChange={(e) =>
                setFiltros({ ...filtros, status: e.target.value as any })
              }
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="todos">Todos</option>
              <option value="aberto">Aberto</option>
              <option value="fechado">Fechado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Início
            </label>
            <Input
              type="date"
              value={filtros.dataInicio}
              onChange={(e) =>
                setFiltros({ ...filtros, dataInicio: e.target.value })
              }
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Fim
          </label>
          <Input
            type="date"
            value={filtros.dataFim}
            onChange={(e) =>
              setFiltros({ ...filtros, dataFim: e.target.value })
            }
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
