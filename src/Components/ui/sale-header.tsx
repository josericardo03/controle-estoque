"use client";

import { useState } from "react";
import {
  Vendedor,
  VendedorOption,
  StatusVendaOption,
  Caixa,
  CaixaOption,
} from "@/types/sale";
import { SelectInput } from "@/Components/ui/select";

interface SaleHeaderProps {
  numero: string;
  dataHora: string;
  vendedor: Vendedor;
  vendedores: VendedorOption[];
  caixa: Caixa;
  caixas: CaixaOption[];
  statusVenda: StatusVendaOption[];
  onVendedorChange: (vendedor: Vendedor) => void;
  onCaixaChange: (caixa: Caixa) => void;
  onAbrirFecharCaixa: () => void;
  onSangriaSuprimento: (valor: number, tipo: "sangria" | "suprimento") => void;
}

export function SaleHeader({
  numero,
  dataHora,
  vendedor,
  vendedores,
  caixa,
  caixas,
  statusVenda,
  onVendedorChange,
  onCaixaChange,
  onAbrirFecharCaixa,
  onSangriaSuprimento,
}: SaleHeaderProps) {
  const [showSangriaModal, setShowSangriaModal] = useState(false);
  const [showSuprimentoModal, setShowSuprimentoModal] = useState(false);
  const [valorSangria, setValorSangria] = useState("");
  const [valorSuprimento, setValorSuprimento] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState<StatusVendaOption>(
    statusVenda[0]
  );

  const handleSangria = () => {
    const valor = parseFloat(valorSangria);
    if (valor > 0) {
      onSangriaSuprimento(valor, "sangria");
      setShowSangriaModal(false);
      setValorSangria("");
    }
  };

  const handleSuprimento = () => {
    const valor = parseFloat(valorSuprimento);
    if (valor > 0) {
      onSangriaSuprimento(valor, "suprimento");
      setShowSuprimentoModal(false);
      setValorSuprimento("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Venda {numero}</h1>
          <p className="text-gray-500">{dataHora}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-48">
            <SelectInput
              name="caixa"
              label="Caixa"
              options={caixas}
              value={{
                value: caixa.id,
                label: `${caixa.numero} - ${caixa.descricao}`,
              }}
              onChange={(option) => {
                if (option) {
                  onCaixaChange({
                    id: option.value,
                    numero: option.label.split(" - ")[0],
                    descricao: option.label.split(" - ")[1],
                    saldo: 0,
                  });
                }
              }}
            />
          </div>

          <div className="w-48">
            <SelectInput
              name="vendedor"
              label="Vendedor"
              options={vendedores}
              value={{ value: vendedor.id, label: vendedor.nome }}
              onChange={(option) => {
                if (option) {
                  onVendedorChange({
                    id: option.value,
                    nome: option.label,
                    email: "",
                    telefone: "",
                  });
                }
              }}
            />
          </div>

          <div className="w-48">
            <SelectInput
              name="status"
              label="Status"
              options={statusVenda}
              value={statusSelecionado}
              onChange={(option) => {
                if (option) {
                  setStatusSelecionado(option as StatusVendaOption);
                }
              }}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={onAbrirFecharCaixa}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Abrir/Fechar Caixa
            </button>
            <button
              onClick={() => setShowSangriaModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Sangria
            </button>
            <button
              onClick={() => setShowSuprimentoModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Suprimento
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Sangria */}
      {showSangriaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Realizar Sangria</h2>
            <input
              type="number"
              value={valorSangria}
              onChange={(e) => setValorSangria(e.target.value)}
              placeholder="Valor da sangria"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSangriaModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSangria}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Suprimento */}
      {showSuprimentoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Realizar Suprimento</h2>
            <input
              type="number"
              value={valorSuprimento}
              onChange={(e) => setValorSuprimento(e.target.value)}
              placeholder="Valor do suprimento"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSuprimentoModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSuprimento}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
