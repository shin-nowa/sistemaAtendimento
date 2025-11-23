// tela do totem onde os clientes tiram a ficha
import React from "react";
import './Totem.css'
import type { TipoSenha } from "../types";
import { gerarNovaSenha } from "../utils/geradorSenha";

const Totem: React.FC = () => {

    const handleGerarSenha = (tipo: TipoSenha) => {
        const novaSenha = gerarNovaSenha(tipo);

    alert(`Senha Gerada: ${novaSenha}`);
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