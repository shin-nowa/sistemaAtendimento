//tipos de senha

export type TipoSenha = 'SP' | 'SG' | 'SE' 

export interface Senha {
    id: string;
    numero: number;
    tipo: TipoSenha;
    dataEmissao: Date;
    dataAtendimento?: Date;
    guiche?: string;
    tempoEspera?: number; // em minutos
}

// Tipos para Relatórios
export interface RelatorioGeral {
    dataInicio: Date;
    dataFim: Date;
    totalSenhas: number;
    senhasAtendidas: number;
    senhasNaoAtendidas: number;
    tempoMedioEspera: number; // em minutos
    tempoMedioAtendimento: number; // em minutes
}

export interface RelatorioPorTipo {
    tipo: TipoSenha;
    total: number;
    atendidas: number;
    naoAtendidas: number;
    percentualAtendimento: number;
    tempoMedioEspera: number;
}

export interface RelatorioGuiche {
    guiche: string;
    totalAtendimentos: number;
    senhasProcessadas: Senha[];
    tempoMedioAtendimento: number;
}

export interface RelatorioHorario {
    hora: string; // formato HH:00
    totalSenhas: number;
    senhasAtendidas: number;
    tempoMedioEspera: number;
}

export interface DadosGrafico {
    labels: string[];
    dados: number[];
}

export interface RelatorioCompleto {
    geral: RelatorioGeral;
    porTipo: RelatorioPorTipo[];
    porGuiche: RelatorioGuiche[];
    porHorario: RelatorioHorario[];
}