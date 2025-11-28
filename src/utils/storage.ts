import type { Senha } from '../types';

const CHAVE_DB = 'db_historico_completo';

// LÊ TUDO (Trata a conversão de string para Date)
export const lerTodasAsSenhas = (): Senha[] => {
  const dados = localStorage.getItem(CHAVE_DB);
  if (!dados) return [];

  const lista = JSON.parse(dados);
  return lista.map((item: any) => ({
    ...item,
    dataEmissao: new Date(item.dataEmissao),
    dataAtendimento: item.dataAtendimento ? new Date(item.dataAtendimento) : undefined
  }));
};

// SALVA UMA NOVA (Create)
export const salvarNovaSenha = (senha: Senha) => {
  const db = lerTodasAsSenhas();
  db.push(senha);
  localStorage.setItem(CHAVE_DB, JSON.stringify(db));
};

// ATUALIZA UMA EXISTENTE (Update)
export const atualizarSenha = (senhaAtualizada: Senha) => {
  const db = lerTodasAsSenhas();
  const index = db.findIndex(s => s.id === senhaAtualizada.id);
  
  if (index !== -1) {
    db[index] = senhaAtualizada;
    localStorage.setItem(CHAVE_DB, JSON.stringify(db));
  }
};