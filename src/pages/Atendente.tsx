//tela do atendente com os controles etc
import React, { useState } from 'react';
import "../App.css"
import './Atendente.css'
import type { Senha } from '../types';
import { buscarProximaSenha } from '../utils/filaUtils';

const Atendente: React.FC = () => {
  const [senhaAtual, setSenhaAtual] = useState<Senha | null>(null)
  // const [cronometro, setCronometro] = useState<number>(0); // TODO: implementar cronômetro para tempo médio

  const handleChamarProximo = () =>{
    const proxima = buscarProximaSenha('01'); // Passa o número do guichê
    if (proxima) {
      setSenhaAtual(proxima)
      // setCronometro(0) // reseta o cronômetro
      
      // Dispara evento customizado para atualizar o painel na mesma janela
      window.dispatchEvent(new CustomEvent('senhaChamada', { detail: proxima }));
      
      // Dispara evento storage para atualizar outras abas/janelas
      window.dispatchEvent(new Event('storage'));
    } else {
      alert("Não há ninguém na fila")
    }
  }
  const handleFinalizar = () => {
    setSenhaAtual(null) // finaliza o atendimento 
  }
  return (
    <div className="atendente-container">
      <header className="header-guiche">
        <h1>Módulo de atendimentoo</h1>
        <span className="guiche-badge">Guichê 01</span>
      </header>

      <main className="area-trabalho">
        {senhaAtual ? (
          <div className="cartao-atendimento-ativo">
            <h2>Em atendimento</h2>
            <div className="numero-senha">
              {senhaAtual.id}
            </div>
            <div className="acoes-atendimento">
              <button onClick={handleFinalizar}>Finalizar atendimento</button>
              <button onClick={handleFinalizar}>Cliente Ausente</button>
            </div>
          </div>
        ) : (
          <div className="estado-livre">
            <h2>Guichê Livre</h2>
            <button onClick={handleChamarProximo}>Chamar próximo</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Atendente;