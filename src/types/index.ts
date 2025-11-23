//tipos de senha

export type TipoSenha = 'SP' | 'SG' | 'SE' 

export interface Senha {
    id: string;
    numero: number;
    tipo: TipoSenha;
    dataEmissao: Date;
    dataAtendimento: Date;
    guiche?: string;
}