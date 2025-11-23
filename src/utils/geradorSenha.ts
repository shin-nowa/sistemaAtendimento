import type { TipoSenha } from "../types";

export const gerarNovaSenha = (tipo: TipoSenha): string => {
    const hoje = new Date();

    const ano = hoje.getFullYear().toString().slice(-2);
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
    const dia = hoje.getDate().toString().padStart(2, '0');
    const prefixoData = `${ano}${mes}${dia}`;

    const chaveStorage = `sequencia_${tipo}_${prefixoData}`;

    const sequenciaAtual = localStorage.getItem(chaveStorage);
    let proximoNumero = 1;

    if (sequenciaAtual){
        proximoNumero = parseInt(sequenciaAtual) + 1;
    }

    localStorage.setItem(chaveStorage, proximoNumero.toString());
    const sequenciaFormatada = proximoNumero.toString().padStart(2, '0');
    return `${prefixoData}-${tipo}${sequenciaFormatada}`;
}