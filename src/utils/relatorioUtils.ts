import type { Senha, RelatorioGeral, RelatorioPorTipo, RelatorioGuiche, RelatorioHorario, RelatorioCompleto } from '../types/index';
import { lerTodasAsSenhas } from './storage'; 

// Função auxiliar para calcular diferença em minutos com segurança
const diffMinutos = (inicio: Date | string, fim: Date | string): number => {
  const dInicio = new Date(inicio).getTime();
  const dFim = new Date(fim).getTime();
  if (isNaN(dInicio) || isNaN(dFim)) return 0;
  return (dFim - dInicio) / (1000 * 60);
};

// 1. GERAR RELATÓRIO GERAL

export const gerarRelatorioGeral = (senhas: Senha[], dataInicio: Date, dataFim: Date): RelatorioGeral => {

  const atendidas = senhas.filter(s => s.dataAtendimento);
  const countAtendidas = atendidas.length;
  const countNaoAtendidas = senhas.length - countAtendidas;

  let somaEspera = 0;
  let somaAtendimento = 0;
  let countComTempoAtendimento = 0;

  atendidas.forEach(s => {
    // 1. Cálculo Real do Tempo de Espera (Chegada até ser chamado)
    if (s.dataInicioAtendimento) {
       somaEspera += diffMinutos(s.dataEmissao, s.dataInicioAtendimento);
    } else if (s.dataAtendimento) {
       // Fallback se for uma senha antiga sem data de início
       somaEspera += diffMinutos(s.dataAtendimento, s.dataEmissao);
    }

    // 2. Cálculo Tempo de Atendimento (Início até Fim)
    if (s.dataInicioAtendimento && s.dataAtendimento) {
      somaAtendimento += diffMinutos(s.dataInicioAtendimento, s.dataAtendimento);
      countComTempoAtendimento++;
    }
  });

  const tempoMedioEspera = countAtendidas > 0 ? somaEspera / countAtendidas : 0;
  const tempoMedioAtendimento = countComTempoAtendimento > 0 ? somaAtendimento / countComTempoAtendimento : 0;

  return {
    dataInicio,
    dataFim,
    totalSenhas: senhas.length,
    senhasAtendidas: countAtendidas,
    senhasNaoAtendidas: countNaoAtendidas,
    tempoMedioEspera: parseFloat(tempoMedioEspera.toFixed(1)),
    tempoMedioAtendimento: parseFloat(tempoMedioAtendimento.toFixed(1))
  };
};

// 2. GERAR RELATÓRIO POR TIPO (SP, SG, SE)

export const gerarRelatorioPorTipo = (senhas: Senha[]): RelatorioPorTipo[] => {
  const tipos: ('SP' | 'SG' | 'SE')[] = ['SP', 'SG', 'SE'];
  
  return tipos.map(tipo => {
    const senhasDoTipo = senhas.filter(s => s.tipo === tipo);
    const atendidas = senhasDoTipo.filter(s => s.dataAtendimento);
    
    let somaEspera = 0;
    atendidas.forEach(s => {
      if (s.dataAtendimento) {
        somaEspera += diffMinutos(s.dataEmissao, s.dataAtendimento);
      }
    });

    const mediaEspera = atendidas.length > 0 ? somaEspera / atendidas.length : 0;
    const percentual = senhasDoTipo.length > 0 ? (atendidas.length / senhasDoTipo.length) * 100 : 0;

    return {
      tipo,
      total: senhasDoTipo.length,
      atendidas: atendidas.length,
      naoAtendidas: senhasDoTipo.length - atendidas.length,
      percentualAtendimento: Math.round(percentual),
      tempoMedioEspera: parseFloat(mediaEspera.toFixed(1)),
    };
  });
};

// ==========================================
// 3. GERAR RELATÓRIO POR GUICHÊ
// ==========================================
export const gerarRelatorioPorGuiche = (senhas: Senha[]): RelatorioGuiche[] => {
  // Pega apenas senhas que têm guichê definido e foram atendidas
  const senhasComGuiche = senhas.filter(s => s.guiche);
  
  // Cria um Set para pegar guichês únicos (Ex: "01", "02")
  const guichesUnicos = Array.from(new Set(senhasComGuiche.map(s => s.guiche as string)));

  return guichesUnicos.map(guiche => {
    // Filtra senhas deste guichê específico
    const senhasDoGuiche = senhasComGuiche.filter(s => s.guiche === guiche);
    
    //LÓGICA DE CÁLCULO
    let somaAtendimento = 0;
    let countAtendimento = 0;

    senhasDoGuiche.forEach(s => {
      // Verifica se tem Início E Fim para calcular a duração
      if (s.dataInicioAtendimento && s.dataAtendimento) {
        somaAtendimento += diffMinutos(s.dataInicioAtendimento, s.dataAtendimento);
        countAtendimento++;
      }
    });

    const media = countAtendimento > 0 ? somaAtendimento / countAtendimento : 0;
    // -------------------------------

    return {
      guiche,
      totalAtendimentos: senhasDoGuiche.length,
      senhasProcessadas: senhasDoGuiche,
      tempoMedioAtendimento: parseFloat(media.toFixed(1)), // Agora retorna o decimal correto (ex: 2.2)
    };
  });
};


// 4. GERAR RELATÓRIO POR HORÁRIO
export const gerarRelatorioPorHorario = (senhas: Senha[]): RelatorioHorario[] => {
  const horarios: { [key: string]: Senha[] } = {};
  
  senhas.forEach(senha => {
    // Extrai a hora (08, 09, 14...)
    const hora = new Date(senha.dataEmissao).getHours().toString().padStart(2, '0');
    const chave = `${hora}:00`;
    
    if (!horarios[chave]) horarios[chave] = [];
    horarios[chave].push(senha);
  });

  return Object.keys(horarios).sort().map(hora => {
    const lista = horarios[hora];
    const atendidas = lista.filter(s => s.dataAtendimento);
    
    let somaEspera = 0;
    atendidas.forEach(s => {
        if (s.dataAtendimento) somaEspera += diffMinutos(s.dataEmissao, s.dataAtendimento);
    });

    const media = atendidas.length > 0 ? somaEspera / atendidas.length : 0;

    return {
      hora,
      totalSenhas: lista.length,
      senhasAtendidas: atendidas.length,
      tempoMedioEspera: parseFloat(media.toFixed(1))
    };
  });
};

// ==========================================
// FUNÇÃO PRINCIPAL (CHAMADA PELO ADMIN)
// ==========================================
export const gerarRelatorioCompleto = (dataInicio: Date, dataFim: Date): RelatorioCompleto => {
  console.group("🔎 Debug Relatório");
  console.log("1. Buscando dados do Storage...");
  
  const todasSenhas = lerTodasAsSenhas();
  console.log(`   Encontradas ${todasSenhas.length} senhas no total.`);

  // AJUSTE DE DATAS (CRUCIAL)
  // Data Inicio vira 00:00:00.000 do dia selecionado
  const inicio = new Date(dataInicio);
  inicio.setHours(0, 0, 0, 0);

  // Data Fim vira 23:59:59.999 do dia selecionado
  const fim = new Date(dataFim);
  fim.setHours(23, 59, 59, 999);

  console.log("2. Filtrando por data:", { inicio: inicio.toLocaleString(), fim: fim.toLocaleString() });

  const senhasFiltradas = todasSenhas.filter(s => {
    const dataEmissao = new Date(s.dataEmissao);
    return dataEmissao >= inicio && dataEmissao <= fim;
  });

  console.log(`   Senhas após filtro: ${senhasFiltradas.length}`);
  console.groupEnd();

  return {
    geral: gerarRelatorioGeral(senhasFiltradas, inicio, fim),
    porTipo: gerarRelatorioPorTipo(senhasFiltradas),
    porGuiche: gerarRelatorioPorGuiche(senhasFiltradas),
    porHorario: gerarRelatorioPorHorario(senhasFiltradas),
  };
};

// ==========================================
// EXPORTAÇÃO CSV
// ==========================================
export const exportarCSV = (relatorio: RelatorioCompleto, nomeArquivo: string = 'relatorio.csv') => {
  let csv = 'RELATORIO GERAL\n';
  csv += `Periodo,${relatorio.geral.dataInicio.toLocaleDateString()} ate ${relatorio.geral.dataFim?.toLocaleDateString()}\n`;
  csv += `Total Senhas,${relatorio.geral.totalSenhas}\n`;
  csv += `Atendidas,${relatorio.geral.senhasAtendidas}\n`;
  csv += `Nao Atendidas,${relatorio.geral.senhasNaoAtendidas}\n`;
  csv += `TM Espera (min),${relatorio.geral.tempoMedioEspera}\n\n`;

  csv += 'POR TIPO\nTipo,Total,Atendidas,TM Espera\n';
  relatorio.porTipo.forEach(r => {
    csv += `${r.tipo},${r.total},${r.atendidas},${r.tempoMedioEspera}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nomeArquivo;
  a.click();
  window.URL.revokeObjectURL(url);
};