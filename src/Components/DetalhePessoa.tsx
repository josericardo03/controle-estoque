"use client";

interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface Compra {
  id: string;
  data: string;
  valor: number;
  produtos: string[];
}

interface Pessoa {
  id: string;
  nome: string;
  documento: string;
  tipo: "Fornecedor" | "Cliente";
  endereco: Endereco;
  compras: Compra[];
}

export default function DetalhePessoa({ pessoa }: { pessoa: Pessoa | null }) {
  if (!pessoa) {
    return (
      <div className="p-4 border rounded-lg shadow-sm">
        <p className="text-gray-500">
          Selecione uma pessoa para ver os detalhes
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">
        {pessoa.tipo === "Cliente" ? "Cliente" : "Fornecedor"}
      </h2>

      <div className="space-y-6">
        {/* Dados da Pessoa */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Dados da Pessoa</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Nome:</span> {pessoa.nome}
            </p>
            <p>
              <span className="font-medium">Documento:</span> {pessoa.documento}
            </p>
            <p>
              <span className="font-medium">Tipo:</span> {pessoa.tipo}
            </p>
          </div>
        </div>

        {/* Dados do Endereço */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Dados do Endereço</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Rua:</span> {pessoa.endereco.rua},{" "}
              {pessoa.endereco.numero}
            </p>
            <p>
              <span className="font-medium">Bairro:</span>{" "}
              {pessoa.endereco.bairro}
            </p>
            <p>
              <span className="font-medium">Cidade:</span>{" "}
              {pessoa.endereco.cidade} - {pessoa.endereco.estado}
            </p>
            <p>
              <span className="font-medium">CEP:</span> {pessoa.endereco.cep}
            </p>
          </div>
        </div>

        {/* Histórico de Compras */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Histórico de Compras</h3>
          <div className="space-y-4">
            {pessoa.compras.map((compra) => (
              <div key={compra.id} className="border-b pb-2">
                <p>
                  <span className="font-medium">Data:</span> {compra.data}
                </p>
                <p>
                  <span className="font-medium">Valor:</span> R${" "}
                  {compra.valor.toFixed(2)}
                </p>
                <p>
                  <span className="font-medium">Produtos:</span>
                </p>
                <ul className="list-disc list-inside pl-4">
                  {compra.produtos.map((produto, index) => (
                    <li key={index}>{produto}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
