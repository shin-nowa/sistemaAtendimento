import type { Senha, TipoSenha } from "../types";

const CHAVE_FILA = 'fila_espera'
const CHAVE_ULTIMA_CHAMADA = 'historico_chamada'

// salvando senha na fila de espera
export const entrarNaFila = (senha: Senha) => {
    const filaAtual = lerFila();
    filaAtual.push(senha)
    localStorage.setItem(CHAVE_FILA, JSON.stringify(filaAtual))
};

export const lerFila = (): Senha [] => {
    const dados = localStorage.getItem(CHAVE_FILA)
    return dados ? JSON.parse(dados) : []
}

// logica pra prioridade

export const buscarProximaSenha = (): Senha | null => {
    let fila = lerFila()
    if (fila.length === 0) return null

    // separando o tipo da ssenhas
    const sp = fila.filter(s => s.tipo === 'SP')
    const se = fila.filter(s => s.tipo === 'SE')
    const sg = fila.filter(s => s.tipo === 'SG')

    let proxima: Senha | undefined
    if (sp.length > 0) {
        proxima = sp[0];
    } else if (se.length > 0) {
        proxima = se[0]
    } else if (sg.length > 0){
        proxima = sg[0]
    }
    if (proxima){
        const novaFila = fila.filter(s => s.id !== proxima!.id) // filter é pra filtrar e criar um arrayg novop de acordo com o teste feito, aq a gente ta removendo a senha chamada da fila de esprea
        localStorage.setItem(CHAVE_FILA, JSON.stringify(novaFila))
    
        adicionarAoHistorico(proxima)
    return proxima
    }
    return null
}
const adicionarAoHistorico = (senha: Senha) => {
    const historico = JSON.parse(localStorage.getItem(CHAVE_ULTIMA_CHAMADA) || '[]')
    const novoHistorico = [senha, ...historico].slice(0, 5);
    localStorage.setItem(CHAVE_ULTIMA_CHAMADA, JSON.stringify(novoHistorico))
}

