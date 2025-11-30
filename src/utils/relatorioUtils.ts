import type { Senha, RelatorioGeral, RelatorioPorTipo, RelatorioGuiche, RelatorioHorario, RelatorioCompleto } from '../types/index';
import { lerTodasAsSenhas } from './storage'; 

// Função auxiliar para calcular diferença em minutos com segurança
const diffMinutos = (inicio: Date | string, fim: Date | string): number => {
  const dInicio = new Date(inicio).getTime();
  const dFim = new Date(fim).getTime();
  if (isNaN(dInicio) || isNaN(dFim)) return 0;
  return (dFim - dInicio) / (1000 * 60);
};

export const gerarRelatorioGeral = (senhas: Senha[], dataInicio: Date, dataFim: Date): RelatorioGeral => {
    const atendidas = senhas.filter(s => s.dataAtendimento);
    const countAtendidas = atendidas.length;
    const countNaoAtendidas = senhas.length - countAtendidas;
  
    let somaEspera = 0;
    let somaAtendimento = 0;
    let countComTempoAtendimento = 0;
  
    atendidas.forEach(s => {
      if (s.dataInicioAtendimento) {
         somaEspera += diffMinutos(s.dataEmissao, s.dataInicioAtendimento);
      } else if (s.dataAtendimento) {
         somaEspera += diffMinutos(s.dataAtendimento, s.dataEmissao); // Correção da ordem para não dar negativo se usar fallback
      }
  
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
      tempoMedioEspera: parseFloat(Math.abs(tempoMedioEspera).toFixed(1)),
      tempoMedioAtendimento: parseFloat(Math.abs(tempoMedioAtendimento).toFixed(1))
    };
};

export const gerarRelatorioPorTipo = (senhas: Senha[]): RelatorioPorTipo[] => {
    const tipos: ('SP' | 'SG' | 'SE')[] = ['SP', 'SG', 'SE'];
    return tipos.map(tipo => {
      const senhasDoTipo = senhas.filter(s => s.tipo === tipo);
      const atendidas = senhasDoTipo.filter(s => s.dataAtendimento);
      let somaEspera = 0;
      atendidas.forEach(s => {
        // Usa dataInicioAtendimento se existir, senão usa dataAtendimento como fallback
        const fimEspera = s.dataInicioAtendimento || s.dataAtendimento;
        if (fimEspera) somaEspera += diffMinutos(s.dataEmissao, fimEspera);
      });
      const mediaEspera = atendidas.length > 0 ? somaEspera / atendidas.length : 0;
      const percentual = senhasDoTipo.length > 0 ? (atendidas.length / senhasDoTipo.length) * 100 : 0;
      return {
        tipo,
        total: senhasDoTipo.length,
        atendidas: atendidas.length,
        naoAtendidas: senhasDoTipo.length - atendidas.length,
        percentualAtendimento: Math.round(percentual),
        tempoMedioEspera: parseFloat(Math.abs(mediaEspera).toFixed(1)),
      };
    });
};

export const gerarRelatorioPorGuiche = (senhas: Senha[]): RelatorioGuiche[] => {
    const senhasComGuiche = senhas.filter(s => s.guiche);
    const guichesUnicos = Array.from(new Set(senhasComGuiche.map(s => s.guiche as string)));
    return guichesUnicos.map(guiche => {
      const senhasDoGuiche = senhasComGuiche.filter(s => s.guiche === guiche);
      let somaAtendimento = 0;
      let countAtendimento = 0;
      senhasDoGuiche.forEach(s => {
        if (s.dataInicioAtendimento && s.dataAtendimento) {
          somaAtendimento += diffMinutos(s.dataInicioAtendimento, s.dataAtendimento);
          countAtendimento++;
        }
      });
      const media = countAtendimento > 0 ? somaAtendimento / countAtendimento : 0;
      return {
        guiche,
        totalAtendimentos: senhasDoGuiche.length,
        senhasProcessadas: senhasDoGuiche,
        tempoMedioAtendimento: parseFloat(Math.abs(media).toFixed(1)),
      };
    });
};

export const gerarRelatorioPorHorario = (senhas: Senha[]): RelatorioHorario[] => {
    const horarios: { [key: string]: Senha[] } = {};
    senhas.forEach(senha => {
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
          const fimEspera = s.dataInicioAtendimento || s.dataAtendimento;
          if (fimEspera) somaEspera += diffMinutos(s.dataEmissao, fimEspera);
      });
      const media = atendidas.length > 0 ? somaEspera / atendidas.length : 0;
      return {
        hora,
        totalSenhas: lista.length,
        senhasAtendidas: atendidas.length,
        tempoMedioEspera: parseFloat(Math.abs(media).toFixed(1))
      };
    });
};

export const gerarRelatorioCompleto = (dataInicio: string | Date, dataFim: string | Date): RelatorioCompleto => {
  // 1. Converte qualquer coisa que chegou para string YYYY-MM-DD
  const strInicio = dataInicio instanceof Date ? dataInicio.toISOString().split('T')[0] : dataInicio;
  const strFim = dataFim instanceof Date ? dataFim.toISOString().split('T')[0] : dataFim;

  // 2. Força o horário local colando a hora na string manualmente
  // Isso impede que o navegador converta para UTC e volte para o dia anterior
  const inicio = new Date(strInicio + 'T00:00:00');
  const fim = new Date(strFim + 'T23:59:59.999');

  console.log("Datas Interpretadas:", inicio.toLocaleString(), "até", fim.toLocaleString());
  
  const todasSenhas = lerTodasAsSenhas();
  
  const senhasFiltradas = todasSenhas.filter(s => {
    const dataEmissao = new Date(s.dataEmissao);
    return dataEmissao >= inicio && dataEmissao <= fim;
  });

  return {
    geral: gerarRelatorioGeral(senhasFiltradas, inicio, fim),
    porTipo: gerarRelatorioPorTipo(senhasFiltradas),
    porGuiche: gerarRelatorioPorGuiche(senhasFiltradas),
    porHorario: gerarRelatorioPorHorario(senhasFiltradas),
  };
};

export const exportarCSV = (relatorio: RelatorioCompleto, nomeArquivo: string = 'relatorio.csv') => {
    let csv = 'RELATORIO GERAL\n';
    csv += `Periodo,${relatorio.geral.dataInicio.toLocaleDateString()} ate ${relatorio.geral.dataFim?.toLocaleDateString()}\n`;
    csv += `Total Senhas,${relatorio.geral.totalSenhas}\n`;
    csv += `Atendidas,${relatorio.geral.senhasAtendidas}\n`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nomeArquivo;
    a.click();
    window.URL.revokeObjectURL(url);
};