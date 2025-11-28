// Este arquivo contém funções auxiliares para popular o localStorage com dados de teste
import type { Senha } from '../types/index';

/**
 * Gera dados de teste e os salva no localStorage
 * Execute esta função uma vez para populando os dados
 */
export const inicializarDadosTeste = () => {
  const senhas: Senha[] = [];
  const tipos: ('SP' | 'SG' | 'SE')[] = ['SP', 'SG', 'SE'];
  const guiches = ['G1', 'G2', 'G3', 'G4', 'G5'];
  
  const hoje = new Date();
  
  // Gerar senhas para os últimos 7 dias
  for (let dia = 0; dia < 7; dia++) {
    const dataBase = new Date(hoje);
    dataBase.setDate(dataBase.getDate() - dia);
    
    // Gerar 15-20 senhas por dia
    const quantidadePorDia = Math.floor(Math.random() * 6) + 15;
    
    for (let i = 0; i < quantidadePorDia; i++) {
      const tipo = tipos[Math.floor(Math.random() * tipos.length)];
      const horaAleatoria = Math.floor(Math.random() * 24);
      const minutoAleatorio = Math.floor(Math.random() * 60);
      
      const dataEmissao = new Date(dataBase);
      dataEmissao.setHours(horaAleatoria, minutoAleatorio, 0);
      
      const tempoEsperaMinutos = Math.floor(Math.random() * 30) + 1;
      const dataAtendimento = new Date(dataEmissao);
      dataAtendimento.setMinutes(dataAtendimento.getMinutes() + tempoEsperaMinutos);
      
      const foiAtendida = Math.random() > 0.1; // 90% de taxa de atendimento
      
      senhas.push({
        id: `SENHA-${senhas.length + 1}`,
        numero: 1000 + senhas.length + 1,
        tipo,
        dataEmissao,
        dataAtendimento: foiAtendida ? dataAtendimento : undefined,
        guiche: foiAtendida ? guiches[Math.floor(Math.random() * guiches.length)] : undefined,
        tempoEspera: foiAtendida ? tempoEsperaMinutos : 0,
      });
    }
  }
  
  localStorage.setItem('senhas', JSON.stringify(senhas));
  console.log(`✅ ${senhas.length} senhas de teste foram carregadas no localStorage`);
};

/**
 * Limpa os dados de teste do localStorage
 */
export const limparDadosTeste = () => {
  localStorage.removeItem('senhas');
  console.log('✅ Dados de teste removidos');
};

/**
 * Obtém informações sobre os dados de teste
 */
export const infoTeste = () => {
  const dados = localStorage.getItem('senhas');
  if (dados) {
    const senhas = JSON.parse(dados);
    console.log(`📊 Total de senhas: ${senhas.length}`);
    console.log(`📊 Senhas por tipo:`);
    
    const porTipo: { [key: string]: number } = {};
    senhas.forEach((s: Senha) => {
      porTipo[s.tipo] = (porTipo[s.tipo] || 0) + 1;
    });
    Object.entries(porTipo).forEach(([tipo, quantidade]) => {
      console.log(`   ${tipo}: ${quantidade}`);
    });
  } else {
    console.log('❌ Nenhum dado de teste encontrado');
  }
};
