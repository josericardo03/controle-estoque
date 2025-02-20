// Adicione após a definição de topClientes
const vendedores = [
    {
      nome: 'Carlos',
      totalProdutos: 150,
      faturado: 45000,
      detalhes: {
        totalProdutos: 150,
        totalFaturado: 45000,
        ticketMedio: 300
      }
    },
    {
      nome: 'Maria',
      totalProdutos: 120,
      faturado: 36000,
      detalhes: {
        totalProdutos: 120,
        totalFaturado: 36000,
        ticketMedio: 300
      }
    },
    {
      nome: 'João',
      totalProdutos: 100,
      faturado: 30000,
      detalhes: {
        totalProdutos: 100,
        totalFaturado: 30000,
        ticketMedio: 300
      }
    }
  ];
  
  const Caixa1: React.FC = () => {
    // ... código anterior ...
  
    return (
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
          {/* ... códigos anteriores ... */}
  
          {/* Seção de Vendedores */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold mb-4">Desempenho de Vendedores</h4>
              {vendedores.map((vendedor, index) => (
                <div 
                  key={index} 
                  className="flex justify-between py-2 border-b items-center"
                >
                  <div>
                    <span className="font-bold">{vendedor.nome}</span>
                    <p className="text-sm text-gray-600">
                      Total Produtos: {vendedor.totalProdutos}
                    </p>
                  </div>
                  <span className="font-bold">
                    R$ {vendedor.faturado.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold mb-4">Detalhes do Vendedor</h4>
              {vendedores.map((vendedor, index) => (
                <div 
                  key={index} 
                  className="grid grid-cols-3 gap-4 py-2 border-b"
                >
                  <div>
                    <p className="text-sm text-gray-600">Total Produtos</p>
                    <span className="font-bold">
                      {vendedor.detalhes.totalProdutos}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Faturado</p>
                    <span className="font-bold">
                      R$ {vendedor.detalhes.totalFaturado.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ticket Médio</p>
                    <span className="font-bold">
                      R$ {vendedor.detalhes.ticketMedio.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Caixa1;