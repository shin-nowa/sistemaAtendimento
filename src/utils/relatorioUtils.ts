import type { Senha, RelatorioGeral, RelatorioPorTipo, RelatorioGuiche, RelatorioHorario, RelatorioCompleto } from '../types/index';

// Simular dados de senhassd
export const gerarDadosMock = (): Senha[] => {
  const tipos: ('SP' | 'SG' | 'SE')[] = ['SP', 'SG', 'SE'];
  const guiches = ['G1', 'G2', 'G3', 'G4', 'G5'];
  const senhas: Senha[] = [];
  
  // Gerar 100 senhas paara demonstração
  for (let i = 0; i < 100; i++) {
    const dataEmissao = new Date();
    dataEmissao.setHours(Math.floor(Math.random() * 24));
    dataEmissao.setMinutes(Math.floor(Math.random() * 60));
    dataEmissao.setSeconds(0);

    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    const dataAtendimento = new Date(dataEmissao);
    dataAtendimento.setMinutes(dataAtendimento.getMinutes() + Math.floor(Math.random() * 30) + 1);
    const tempoEspera = Math.floor((dataAtendimento.getTime() - dataEmissao.getTime()) / (1000 * 60));

    senhas.push({
      id: `SENHA-${i + 1}`,
      numero: 1001 + i,
      tipo,
      dataEmissao,
      dataAtendimento: Math.random() > 0.1 ? dataAtendimento : undefined,
      guiche: Math.random() > 0.1 ? guiches[Math.floor(Math.random() * guiches.length)] : undefined,
      tempoEspera: tempoEspera > 0 ? tempoEspera : 0,
    });
  }

  return senhas;
};

// Recuperar dados do localStorage
export const obterDadosSenhas = (): Senha[] => {
  const dados = localStorage.getItem('senhas');
  if (dados) {
    try {
      return JSON.parse(dados);
    } catch {
      return gerarDadosMock();
    }
  }
  return gerarDadosMock();
};

// Gerar relatório geral
export const gerarRelatorioGeral = (senhas: Senha[], dataInicio: Date, dataFim: Date): RelatorioGeral => {
  const senhasFiltradas = senhas.filter(s => {
    const data = new Date(s.dataEmissao);
    return data >= dataInicio && data <= dataFim;
  });

  const atendidas = senhasFiltradas.filter(s => s.dataAtendimento).length;
  const naoAtendidas = senhasFiltradas.length - atendidas;
  
  const tempoMedioEspera = senhasFiltradas.length > 0
    ? senhasFiltradas.reduce((acc, s) => acc + (s.tempoEspera || 0), 0) / senhasFiltradas.length
    : 0;

  const tempoMedioAtendimento = atendidas > 0
    ? senhasFiltradas
        .filter(s => s.dataAtendimento)
        .reduce((acc, s) => {
          if (s.dataAtendimento) {
            const tempo = (new Date(s.dataAtendimento).getTime() - new Date(s.dataEmissao).getTime()) / (1000 * 60);
            return acc + tempo;
          }
          return acc;
        }, 0) / atendidas
    : 0;

  return {
    dataInicio,
    dataFim,
    totalSenhas: senhasFiltradas.length,
    senhasAtendidas: atendidas,
    senhasNaoAtendidas: naoAtendidas,
    tempoMedioEspera: Math.round(tempoMedioEspera * 10) / 10,
    tempoMedioAtendimento: Math.round(tempoMedioAtendimento * 10) / 10,
  };
};

// Gerar relatório por tipo de senha
export const gerarRelatorioPorTipo = (senhas: Senha[]): RelatorioPorTipo[] => {
  const tipos: ('SP' | 'SG' | 'SE')[] = ['SP', 'SG', 'SE'];
  
  return tipos.map(tipo => {
    const senhasTipo = senhas.filter(s => s.tipo === tipo);
    const atendidas = senhasTipo.filter(s => s.dataAtendimento).length;
    
    const tempoMedioEspera = senhasTipo.length > 0
      ? senhasTipo.reduce((acc, s) => acc + (s.tempoEspera || 0), 0) / senhasTipo.length
      : 0;

    return {
      tipo,
      total: senhasTipo.length,
      atendidas,
      naoAtendidas: senhasTipo.length - atendidas,
      percentualAtendimento: senhasTipo.length > 0 ? Math.round((atendidas / senhasTipo.length) * 100) : 0,
      tempoMedioEspera: Math.round(tempoMedioEspera * 10) / 10,
    };
  });
};

// Gerar relatório por guichê
export const gerarRelatorioPorGuiche = (senhas: Senha[]): RelatorioGuiche[] => {
  const guiches = new Set(senhas.map(s => s.guiche).filter(g => g !== undefined) as string[]);
  
  return Array.from(guiches).map(guiche => {
    const senhasGuiche = senhas.filter(s => s.guiche === guiche);
    
    const tempoMedioAtendimento = senhasGuiche.length > 0
      ? senhasGuiche.reduce((acc, s) => acc + (s.tempoEspera || 0), 0) / senhasGuiche.length
      : 0;

    return {
      guiche,
      totalAtendimentos: senhasGuiche.length,
      senhasProcessadas: senhasGuiche,
      tempoMedioAtendimento: Math.round(tempoMedioAtendimento * 10) / 10,
    };
  });
};

// Gerar relatório por horário
export const gerarRelatorioPorHorario = (senhas: Senha[]): RelatorioHorario[] => {
  const horarios: { [key: string]: Senha[] } = {};
  
  senhas.forEach(senha => {
    const hora = new Date(senha.dataEmissao).getHours().toString().padStart(2, '0');
    const chave = `${hora}:00`;
    
    if (!horarios[chave]) {
      horarios[chave] = [];
    }
    horarios[chave].push(senha);
  });

  return Object.keys(horarios)
    .sort()
    .map(hora => {
      const senhasHora = horarios[hora];
      const atendidas = senhasHora.filter(s => s.dataAtendimento).length;
      const tempoMedioEspera = senhasHora.length > 0
        ? senhasHora.reduce((acc, s) => acc + (s.tempoEspera || 0), 0) / senhasHora.length
        : 0;

      return {
        hora,
        totalSenhas: senhasHora.length,
        senhasAtendidas: atendidas,
        tempoMedioEspera: Math.round(tempoMedioEspera * 10) / 10,
      };
    });
};

// Gerar relatório completo
export const gerarRelatorioCompleto = (dataInicio: Date, dataFim: Date): RelatorioCompleto => {
  const senhas = obterDadosSenhas();
  
  const senhasFiltradas = senhas.filter(s => {
    const data = new Date(s.dataEmissao);
    return data >= dataInicio && data <= dataFim;
  });

  return {
    geral: gerarRelatorioGeral(senhasFiltradas, dataInicio, dataFim),
    porTipo: gerarRelatorioPorTipo(senhasFiltradas),
    porGuiche: gerarRelatorioPorGuiche(senhasFiltradas),
    porHorario: gerarRelatorioPorHorario(senhasFiltradas),
  };
};

// Exportar relatório como CSV
export const exportarCSV = (relatorio: RelatorioCompleto, nomeArquivo: string = 'relatorio.csv') => {
  let csv = 'RELATÓRIO GERAL\n';
  csv += `Data Início,${relatorio.geral.dataInicio}\n`;
  csv += `Data Fim,${relatorio.geral.dataFim}\n`;
  csv += `Total de Senhas,${relatorio.geral.totalSenhas}\n`;
  csv += `Senhas Atendidas,${relatorio.geral.senhasAtendidas}\n`;
  csv += `Senhas Não Atendidas,${relatorio.geral.senhasNaoAtendidas}\n`;
  csv += `Tempo Médio Espera,${relatorio.geral.tempoMedioEspera} min\n`;
  csv += `Tempo Médio Atendimento,${relatorio.geral.tempoMedioAtendimento} min\n\n`;

  csv += 'RELATÓRIO POR TIPO\n';
  csv += 'Tipo,Total,Atendidas,Não Atendidas,Percentual Atendimento,Tempo Médio Espera\n';
  relatorio.porTipo.forEach(r => {
    csv += `${r.tipo},${r.total},${r.atendidas},${r.naoAtendidas},${r.percentualAtendimento}%,${r.tempoMedioEspera} min\n`;
  });

  csv += '\nRELATÓRIO POR GUICHÊ\n';
  csv += 'Guichê,Total de Atendimentos,Tempo Médio Atendimento\n';
  relatorio.porGuiche.forEach(r => {
    csv += `${r.guiche},${r.totalAtendimentos},${r.tempoMedioAtendimento} min\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nomeArquivo;
  a.click();
  window.URL.revokeObjectURL(url);
};

// Exportar como PDF (usando HTML2PDF)
export const exportarPDF = (relatorio: RelatorioCompleto) => {
  // Nota: Para usar esta função, você precisará instalar html2pdf com npm
  console.log('Para exportar PDF, instale: npm install html2pdf.js');
  console.log('Relatório pronto para exportação:', relatorio);
};
