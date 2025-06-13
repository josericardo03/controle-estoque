"use client";

import { ItemVenda } from "@/types/sale";
import { DataTable } from "@/Components/ui/data-table";

interface ProductAreaProps {
  itens: ItemVenda[];
  onRemoveItem: (itemId: string) => void;
}

export function ProductArea({ itens, onRemoveItem }: ProductAreaProps) {
  const columns = [
    {
      header: "Código",
      accessorKey: "codigo",
    },
    {
      header: "Produto",
      accessorKey: "produto",
    },
    {
      header: "Qtd",
      accessorKey: "quantidade",
    },
    {
      header: "Preço Unit.",
      accessorKey: "precoUnitario",
    },
    {
      header: "Subtotal",
      accessorKey: "subtotal",
    },
    {
      header: "Ações",
      cell: ({ row }: any) => (
        <button
          onClick={() => onRemoveItem(row.original.id)}
          className="text-red-600 hover:text-red-800"
        >
          Remover
        </button>
      ),
    },
  ];

  return (
    <div className="mt-4">
      <DataTable columns={columns} data={itens} />
    </div>
  );
}
