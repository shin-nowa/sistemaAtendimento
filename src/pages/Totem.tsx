// tela do totem onde os clientes tiram a ficha
import React from "react";
import './Totem.css'
import type { Senha, TipoSenha } from "../types";
import { gerarNovaSenha } from "../utils/geradorSenha";
import { entrarNaFila } from "../utils/filaUtils";
import { salvarNovaSenha } from "../utils/storage";

const Totem: React.FC = () => {

    const handleGerarSenha = (tipo: TipoSenha) => {
        const codigoSenha = gerarNovaSenha(tipo);
        
        const objetoSenha: Senha = {
            id: codigoSenha,
            tipo: tipo,
            numero: parseInt(codigoSenha.slice(-2)), // aq ta pegando os dois ultimos numeros (ver o geradorSenha na utils)
            dataEmissao: new Date(),
        }
        entrarNaFila(objetoSenha)
        salvarNovaSenha(objetoSenha)

        // Dispara evento customizado para atualizar o painel quando senha é gerada
        window.dispatchEvent(new CustomEvent('senhaGerada', { detail: objetoSenha }));
        
        // Dispara evento storage para atualizar outras abas/janelas
        window.dispatchEvent(new Event('storage'));

        alert(`Senha Gerada: ${codigoSenha}`);
    }
    return (
        <div className = "container-pagina">
            <h1>Retire sua senha</h1>
            <p>Toque em uma das opções abaixo</p>
            <div>
                <button onClick = {() => handleGerarSenha('SP')}>Prioritário (SP)</button>
                <button onClick = {() => handleGerarSenha('SG')}>Geral (SG)</button>
                <button onClick = {() => handleGerarSenha('SE')}>Exames (SE)</button>
            </div>
        </div>
    )
}

export default Totem;