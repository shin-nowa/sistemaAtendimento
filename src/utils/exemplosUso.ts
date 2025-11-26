/**
 * EXEMPLOS DE USO DO SISTEMA DE RELATÓRIOS
 * 
 * Este arquivo contém exemplos práticos de como usar as funções
 * do sistema de relatórios em diferentes contextos.
 */

import { 
  gerarRelatorioCompleto, 
  exportarCSV
} from './relatorioUtils';

import { 
  inicializarSistema,
  adicionarSenha,
  atualizarSenha,
  obterTodasSenhas,
  obterSenhasEmAberto,
  obterEstatisticasRapidas
} from './dadosManager';

import type { Senha } from '../types/index';

// ============================================================
// EXEMPLO 1: Inicializar o sistema
// ============================================================
export function exemplo1_inicializarSistema() {
  const foiPrimeiraVez = inicializarSistema();
  
  if (foiPrimeiraVez) {
    console.log('✅ Sistema inicializado com dados de teste');
  } else {
    console.log('ℹ️ Sistema já estava inicializado');
  }
}

// ============================================================
// EXEMPLO 2: Gerar relatório de um período específico
// ============================================================
export function exemplo2_relatorioPersonalizado() {
  // Relatório do último mês
  const dataFim = new Date();
  const dataInicio = new Date();
  dataInicio.setMonth(dataInicio.getMonth() - 1);
  
  const relatorio = gerarRelatorioCompleto(dataInicio, dataFim);
  
  console.log('📊 Relatório do Mês:');
  console.log(`Total de senhas: ${relatorio.geral.totalSenhas}`);
  console.log(`Taxa de atendimento: ${
    (relatorio.geral.senhasAtendidas / relatorio.geral.totalSenhas * 100).toFixed(1)
  }%`);
  console.log(`Tempo médio de espera: ${relatorio.geral.tempoMedioEspera} min`);
}

// ============================================================
// EXEMPLO 3: Adicionar uma nova senha ao sistema
// ============================================================
export function exemplo3_adicionarSenha() {
  const novaSenha: Senha = {
    id: `SENHA-${Date.now()}`,
    numero: 2000 + Math.floor(Math.random() * 1000),
    tipo: 'SP',
    dataEmissao: new Date(),
    tempoEspera: 0,
  };
  
  adicionarSenha(novaSenha);
  console.log('✅ Senha adicionada:', novaSenha);
}

// ============================================================
// EXEMPLO 4: Atualizar uma senha (marcar como atendida)
// ============================================================
export function exemplo4_marcarAtendida() {
  const senhas = obterTodasSenhas();
  
  if (senhas.length > 0) {
    const senhaParaAtender = senhas[0];
    const tempoEspera = 15; // minutos
    
    atualizarSenha(senhaParaAtender.id, {
      dataAtendimento: new Date(),
      guiche: 'G1',
      tempoEspera: tempoEspera,
    });
    
    console.log('✅ Senha marcada como atendida');
  }
}

// ============================================================
// EXEMPLO 5: Obter senhas em aberto
// ============================================================
export function exemplo5_senhasEmAberto() {
  const senhasEmAberto = obterSenhasEmAberto();
  
  console.log('📋 Senhas em Aberto:');
  senhasEmAberto.forEach(senha => {
    console.log(`  - ${senha.numero} (${senha.tipo})`);
  });
  
  console.log(`Total: ${senhasEmAberto.length}`);
}

// ============================================================
// EXEMPLO 6: Estatísticas rápidas
// ============================================================
export function exemplo6_estatisticasRapidas() {
  const stats = obterEstatisticasRapidas();
  
  console.log('📊 Estatísticas Rápidas:');
  console.log(`  Total: ${stats.total}`);
  console.log(`  Atendidas: ${stats.atendidas}`);
  console.log(`  Em Aberto: ${stats.emAberto}`);
  console.log(`  Taxa: ${stats.taxaAtendimento}%`);
}

// ============================================================
// EXEMPLO 7: Exportar relatório como CSV
// ============================================================
export function exemplo7_exportarCSV() {
  const dataFim = new Date();
  const dataInicio = new Date(dataFim);
  dataInicio.setDate(dataInicio.getDate() - 7); // Últimos 7 dias
  
  const relatorio = gerarRelatorioCompleto(dataInicio, dataFim);
  const nomeArquivo = `relatorio_${dataInicio.toISOString().split('T')[0]}_a_${dataFim.toISOString().split('T')[0]}.csv`;
  
  exportarCSV(relatorio, nomeArquivo);
  console.log('✅ Relatório exportado como CSV');
}

// ============================================================
// EXEMPLO 8: Análise por tipo de senha
// ============================================================
export function exemplo8_analisePorTipo() {
  const dataFim = new Date();
  const dataInicio = new Date(dataFim);
  dataInicio.setDate(dataInicio.getDate() - 30); // Últimos 30 dias
  
  const relatorio = gerarRelatorioCompleto(dataInicio, dataFim);
  
  console.log('📊 Análise por Tipo de Senha (Últimos 30 dias):');
  relatorio.porTipo.forEach(tipo => {
    console.log(`
  ${tipo.tipo}:
    - Total: ${tipo.total}
    - Atendidas: ${tipo.atendidas}
    - Taxa: ${tipo.percentualAtendimento}%
    - Tempo médio espera: ${tipo.tempoMedioEspera} min
    `);
  });
}

// ============================================================
// EXEMPLO 9: Performance por guichê
// ============================================================
export function exemplo9_performanceGuiche() {
  const relatorio = gerarRelatorioCompleto(
    new Date(new Date().setDate(new Date().getDate() - 1)),
    new Date()
  );
  
  console.log('📊 Performance por Guichê (Hoje):');
  relatorio.porGuiche.forEach(guiche => {
    console.log(`
  ${guiche.guiche}:
    - Atendimentos: ${guiche.totalAtendimentos}
    - Tempo médio: ${guiche.tempoMedioAtendimento} min
    `);
  });
}

// ============================================================
// EXEMPLO 10: Picos de atendimento
// ============================================================
export function exemplo10_picosAtendimento() {
  const relatorio = gerarRelatorioCompleto(
    new Date(new Date().setDate(new Date().getDate() - 1)),
    new Date()
  );
  
  console.log('📊 Picos de Atendimento (Hoje):');
  
  const horarioComMaisSenhas = relatorio.porHorario.reduce((max, horario) => 
    horario.totalSenhas > max.totalSenhas ? horario : max
  );
  
  console.log(`
  Horário de Pico: ${horarioComMaisSenhas.hora}
  Total de senhas: ${horarioComMaisSenhas.totalSenhas}
  Tempo médio espera: ${horarioComMaisSenhas.tempoMedioEspera} min
  `);
}

// ============================================================
// COMO EXECUTAR ESTES EXEMPLOS NO CONSOLE DO NAVEGADOR:
// ============================================================
/*

1. Abra o Developer Tools (F12)
2. Vá para a aba "Console"
3. Importe e execute um exemplo:

  // Copie e cole uma dessas linhas no console:

  // Exemplo 1:
  import('./utils/exemplosUso.js').then(m => m.exemplo1_inicializarSistema());

  // Exemplo 2:
  import('./utils/exemplosUso.js').then(m => m.exemplo2_relatorioPersonalizado());

  // Exemplo 6 (ver estatísticas):
  import('./utils/exemplosUso.js').then(m => m.exemplo6_estatisticasRapidas());

  // Exemplo 8 (análise por tipo):
  import('./utils/exemplosUso.js').then(m => m.exemplo8_analisePorTipo());

*/

// ============================================================
// INTEGRAÇÃO COM COMPONENTES REACT
// ============================================================

/*

Exemplo de uso em um componente React:

import { useEffect, useState } from 'react';
import { gerarRelatorioCompleto } from '../utils/relatorioUtils';

function MeuComponente() {
  const [relatorio, setRelatorio] = useState(null);
  
  useEffect(() => {
    const dataFim = new Date();
    const dataInicio = new Date(dataFim);
    dataInicio.setDate(dataInicio.getDate() - 7);
    
    const rel = gerarRelatorioCompleto(dataInicio, dataFim);
    setRelatorio(rel);
  }, []);
  
  if (!relatorio) return <div>Carregando...</div>;
  
  return (
    <div>
      <h1>Total: {relatorio.geral.totalSenhas}</h1>
      <p>Atendidas: {relatorio.geral.senhasAtendidas}</p>
    </div>
  );
}

export default MeuComponente;

*/
