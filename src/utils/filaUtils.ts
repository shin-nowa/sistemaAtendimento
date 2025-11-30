import type { Senha, TipoSenha } from "../types";
import { atualizarSenha } from "./storage";

const CHAVE_FILA = 'fila_espera';
const CHAVE_ULTIMA_CHAMADA = 'historico_chamada';
const CHAVE_ULTIMO_TIPO_ATENDIDO = 'ultimo_tipo_atendido'; // Nova chave pra lembrar quem foi o último

// salvando senha na fila de espera
export const entrarNaFila = (senha: Senha) => {
    const filaAtual = lerFila();
    filaAtual.push(senha);
    localStorage.setItem(CHAVE_FILA, JSON.stringify(filaAtual));
};

export const lerFila = (): Senha[] => {
    const dados = localStorage.getItem(CHAVE_FILA);
    return dados ? JSON.parse(dados) : [];
};

// logica pra prioridade (Agora com intercalação SP -> SE/SG -> SP)
export const buscarProximaSenha = (guiche?: string): Senha | null => {
    let fila = lerFila();
    if (fila.length === 0) return null;

    // separando o tipo da ssenhas
    const sp = fila.filter(s => s.tipo === 'SP');
    const se = fila.filter(s => s.tipo === 'SE');
    const sg = fila.filter(s => s.tipo === 'SG');

    // Recupera quem foi o último atendido pra decidir a vez
    const ultimoTipo = localStorage.getItem(CHAVE_ULTIMO_TIPO_ATENDIDO) as TipoSenha | null;

    let proxima: Senha | undefined;
    //     if (sp.length > 0) {
    //     proxima = sp[0];
    // } else if (se.length > 0) {
    //     proxima = se[0]
    // } else if (sg.length > 0){
    //     proxima = sg[0]
    // } logica antiga sem seugir oq ta no pdf
    // REGRA DO DOCUMENTO: Se o último foi SP, agora tenta um Normal (SE ou SG)
    if (ultimoTipo === 'SP') {
        // Tenta SE (Exame) primeiro, depois SG (Geral). 
        // Se não tiver nenhum normal, volta pro SP pra não parar o atendimento.
        proxima = se[0] || sg[0] || sp[0];
    } 
    // Se o último foi Normal (ou é o primeiro do dia), a vez é do Prioritário
    else {
        // Tenta SP. Se não tiver, tenta SE, depois SG.
        proxima = sp[0] || se[0] || sg[0];
    }

    if (proxima) {
        // filter é pra filtrar e criar um arrayg novop de acordo com o teste feito, aq a gente ta removendo a senha chamada da fila de esprea
        const novaFila = fila.filter(s => s.id !== proxima!.id);
        localStorage.setItem(CHAVE_FILA, JSON.stringify(novaFila));
    
        // Salva o tipo atual pra próxima vez saber quem chamar (Flip-Flop)
        localStorage.setItem(CHAVE_ULTIMO_TIPO_ATENDIDO, proxima.tipo);

        // Adiciona informações de atendimento quando a senha é chamada
        const senhaChamada: Senha = {
            ...proxima,
            dataAtendimento: new Date(),
            guiche: guiche || '01'
        };
        
        adicionarAoHistorico(senhaChamada);
        atualizarSenha(senhaChamada);

        // Dispara evento pro painel atualizar na hora
        window.dispatchEvent(new CustomEvent('senhaChamada', { detail: senhaChamada }));

        return senhaChamada;
    }
    return null;
};

const adicionarAoHistorico = (senha: Senha) => {
    const historico = JSON.parse(localStorage.getItem(CHAVE_ULTIMA_CHAMADA) || '[]');
    const novoHistorico = [senha, ...historico].slice(0, 5);
    localStorage.setItem(CHAVE_ULTIMA_CHAMADA, JSON.stringify(novoHistorico));
};

// ler histórico das últimas 5 senhas chamadas
export const lerHistoricoChamadas = (): Senha[] => {
    const dados = localStorage.getItem(CHAVE_ULTIMA_CHAMADA);
    if (!dados) return [];
    
    const historico = JSON.parse(dados);
    // Converter dataAtendimento de string para Date se necessário
    return historico.map((senha: any) => ({
        ...senha,
        dataEmissao: new Date(senha.dataEmissao),
        dataAtendimento: senha.dataAtendimento ? new Date(senha.dataAtendimento) : undefined
    }));
};