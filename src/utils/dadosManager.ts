// Integração com localStorage e dados reais
import type { Senha } from '../types/index';
import { gerarDadosMock } from './relatorioUtils';

/**
 * Inicializa o sistema de dados na primeira execução
 */
export const inicializarSistema = () => {
  const chaveInicializacao = 'sistemainiciado';
  const jaFoiInicializado = localStorage.getItem(chaveInicializacao);
  
  if (!jaFoiInicializado) {
    const dadosIniciais = gerarDadosMock();
    localStorage.setItem('senhas', JSON.stringify(dadosIniciais));
    localStorage.setItem(chaveInicializacao, 'true');
    console.log('✅ Sistema inicializado com dados de teste');
    return true;
  }
  
  return false;
};

/**
 * Adiciona uma nova senha ao localStorage
 */
export const adicionarSenha = (senha: Senha) => {
  inicializarSistema();
  const senhas = JSON.parse(localStorage.getItem('senhas') || '[]') as Senha[];
  senhas.push(senha);
  localStorage.setItem('senhas', JSON.stringify(senhas));
};

/**
 * Atualiza uma senha existente
 */
export const atualizarSenha = (senhaId: string, dadosAtualizados: Partial<Senha>) => {
  const senhas = JSON.parse(localStorage.getItem('senhas') || '[]') as Senha[];
  const indice = senhas.findIndex(s => s.id === senhaId);
  
  if (indice !== -1) {
    senhas[indice] = { ...senhas[indice], ...dadosAtualizados };
    localStorage.setItem('senhas', JSON.stringify(senhas));
    return true;
  }
  
  return false;
};

/**
 * Remove uma senha
 */
export const removerSenha = (senhaId: string) => {
  const senhas = JSON.parse(localStorage.getItem('senhas') || '[]') as Senha[];
  const senhasFiltradas = senhas.filter(s => s.id !== senhaId);
  localStorage.setItem('senhas', JSON.stringify(senhasFiltradas));
};

/**
 * Obtém todas as senhas
 */
export const obterTodasSenhas = (): Senha[] => {
  inicializarSistema();
  return JSON.parse(localStorage.getItem('senhas') || '[]') as Senha[];
};

/**
 * Obtém uma senha específica
 */
export const obterSenha = (senhaId: string): Senha | null => {
  const senhas = obterTodasSenhas();
  return senhas.find(s => s.id === senhaId) || null;
};

/**
 * Obtém senhas em aberto (não atendidas)
 */
export const obterSenhasEmAberto = (): Senha[] => {
  const senhas = obterTodasSenhas();
  return senhas.filter(s => !s.dataAtendimento);
};

/**
 * Estatísticas rápidas
 */
export const obterEstatisticasRapidas = () => {
  const senhas = obterTodasSenhas();
  const atendidas = senhas.filter(s => s.dataAtendimento).length;
  
  return {
    total: senhas.length,
    atendidas,
    emAberto: senhas.length - atendidas,
    taxaAtendimento: senhas.length > 0 ? (atendidas / senhas.length * 100).toFixed(1) : '0',
  };
};

/**
 * Limpa todos os dados (cuidado!)
 */
export const limparTodosDados = () => {
  localStorage.removeItem('senhas');
  localStorage.removeItem('sistemainiciado');
  console.log('⚠️ Todos os dados foram removidos');
};

/**
 * Obtém tamanho dos dados em localStorage
 */
export const obterTamanhoDados = () => {
  const dados = localStorage.getItem('senhas');
  if (!dados) return 0;
  
  const bytes = new Blob([dados]).size;
  return `${(bytes / 1024).toFixed(2)} KB`;
};
