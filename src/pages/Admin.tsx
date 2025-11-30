import React, { useState, useMemo } from "react";
import '../App.css';
import './Admin.css';
import { gerarRelatorioCompleto, exportarCSV } from '../utils/relatorioUtils';

const Admin: React.FC = () => {
  // Define a data inicial como 7 dias atrás e a final como hoje
  const [dataInicio, setDataInicio] = useState<string>(
    new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]
  );
  const [dataFim, setDataFim] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [abaSelecionada, setAbaSelecionada] = useState<'geral' | 'tipo' | 'guiche' | 'horario'>('geral');
  
  // Adicionei um estado para forçar atualização manual se quiser (botão refresh)
  const [triggerUpdate, setTriggerUpdate] = useState(0);

  // O useMemo recalcula o relatório sempre que as datas mudam ou clicamos em atualizar
const relatorio = useMemo(() => {
    // Passamos a string direto (ex: "2025-11-30")
    // A função lá dentro vai saber lidar com ela
    return gerarRelatorioCompleto(dataInicio, dataFim);
  }, [dataInicio, dataFim, triggerUpdate]);

  const handleExportarCSV = () => {
    const nomeArquivo = `relatorio_${dataInicio}_${dataFim}.csv`;
    exportarCSV(relatorio, nomeArquivo);
  };

  const handleAtualizar = () => {
    setTriggerUpdate(prev => prev + 1);
  };

  return (
    <div className="container-admin">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1>📊 Relatórios de Gestão</h1>
        <button 
          onClick={handleAtualizar}
          style={{padding: '10px', cursor: 'pointer', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px'}}
        >
          🔄 Atualizar Dados
        </button>
      </div>

      {/* Seção de Filtros */}
      <div className="secao-filtros">
        <h2>Filtros</h2>
        <div className="filtros">
          <div className="filtro-item">
            <label>Data Início:</label>
            <input 
              type="date" 
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>
          <div className="filtro-item">
            <label>Data Fim:</label>
            <input 
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>
          <button className="botao-exportar" onClick={handleExportarCSV}>
            📥 Exportar CSV
          </button>
        </div>
      </div>

      {/* Abas de Navegação */}
      <div className="abas">
        <button 
          className={`aba ${abaSelecionada === 'geral' ? 'ativa' : ''}`}
          onClick={() => setAbaSelecionada('geral')}
        >
          Geral
        </button>
        <button 
          className={`aba ${abaSelecionada === 'tipo' ? 'ativa' : ''}`}
          onClick={() => setAbaSelecionada('tipo')}
        >
          Por Tipo
        </button>
        <button 
          className={`aba ${abaSelecionada === 'guiche' ? 'ativa' : ''}`}
          onClick={() => setAbaSelecionada('guiche')}
        >
          Por Guichê
        </button>
        <button 
          className={`aba ${abaSelecionada === 'horario' ? 'ativa' : ''}`}
          onClick={() => setAbaSelecionada('horario')}
        >
          Por Horário
        </button>
      </div>

      {/* Conteúdo das Abas */}
      <div className="conteudo-abas">
        
        {abaSelecionada === 'geral' && (
          <div className="secao-relatorio">
            <h2>Relatório Geral</h2>
            <div className="cartoes-metricas">
              <div className="cartao">
                <h3>Total de Senhas</h3>
                <p className="metrica">{relatorio.geral.totalSenhas}</p>
              </div>
              <div className="cartao">
                <h3>Senhas Atendidas</h3>
                <p className="metrica sucesso">{relatorio.geral.senhasAtendidas}</p>
              </div>
              <div className="cartao">
                <h3>Senhas Não Atendidas</h3>
                <p className="metrica erro">{relatorio.geral.senhasNaoAtendidas}</p>
              </div>
              <div className="cartao">
                <h3>Tempo Médio de Espera</h3>
                <p className="metrica">{relatorio.geral.tempoMedioEspera} min</p>
              </div>
              <div className="cartao">
                <h3>Tempo Médio de Atendimento</h3>
                <p className="metrica">{relatorio.geral.tempoMedioAtendimento} min</p>
              </div>
              <div className="cartao">
                <h3>Taxa de Atendimento</h3>
                <p className="metrica">
                  {relatorio.geral.totalSenhas > 0 
                    ? Math.round((relatorio.geral.senhasAtendidas / relatorio.geral.totalSenhas) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        )}

        {abaSelecionada === 'tipo' && (
          <div className="secao-relatorio">
            <h2>Relatório por Tipo de Senha</h2>
            <div className="tabela-container">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Total</th>
                    <th>Atendidas</th>
                    <th>Não Atendidas</th>
                    <th>Taxa Atendimento</th>
                    <th>TM Espera</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorio.porTipo.map((rel) => (
                    <tr key={rel.tipo}>
                      <td><strong>{rel.tipo}</strong></td>
                      <td>{rel.total}</td>
                      <td className="sucesso">{rel.atendidas}</td>
                      <td className="erro">{rel.naoAtendidas}</td>
                      <td>{rel.percentualAtendimento}%</td>
                      <td>{rel.tempoMedioEspera} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {abaSelecionada === 'guiche' && (
          <div className="secao-relatorio">
            <h2>Relatório por Guichê</h2>
            <div className="tabela-container">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Guichê</th>
                    <th>Total de Atendimentos</th>
                    <th>Tempo Médio Atendimento</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorio.porGuiche.map((rel) => (
                    <tr key={rel.guiche}>
                      <td><strong>{rel.guiche}</strong></td>
                      <td>{rel.totalAtendimentos}</td>
                      <td>{rel.tempoMedioAtendimento} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {abaSelecionada === 'horario' && (
          <div className="secao-relatorio">
            <h2>Relatório por Horário</h2>
            <div className="tabela-container">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Horário</th>
                    <th>Total de Senhas</th>
                    <th>Senhas Atendidas</th>
                    <th>TM Espera</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorio.porHorario.map((rel) => (
                    <tr key={rel.hora}>
                      <td><strong>{rel.hora}</strong></td>
                      <td>{rel.totalSenhas}</td>
                      <td className="sucesso">{rel.senhasAtendidas}</td>
                      <td>{rel.tempoMedioEspera} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;