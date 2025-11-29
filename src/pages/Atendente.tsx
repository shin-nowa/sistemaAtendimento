import React, { useState } from 'react';
import "../App.css";
import './Atendente.css';
import { atualizarSenha } from "../utils/storage"; 
import type { Senha } from '../types';
import { buscarProximaSenha } from '../utils/filaUtils';

const GUICHES_DISPONIVEIS = ['01', '02', '03', '04', '05'];

const Atendente: React.FC = () => {
  const [senhaAtual, setSenhaAtual] = useState<Senha | null>(null);
  const [guicheSelecionado, setGuicheSelecionado] = useState<string>('01');

  const handleChamarProximo = () => {
    const proxima = buscarProximaSenha(guicheSelecionado);
    if (proxima) {
      setSenhaAtual(proxima);
      const senhaIniciada = {
        ...proxima,
        dataInicioAtendimento: new Date() 
      };
      setSenhaAtual(senhaIniciada);
    } else {
      alert("Não há ninguém na fila");
    }

  };

  const handleFinalizar = () => {
    if (senhaAtual) {
      const senhaFinalizada = {
        ...senhaAtual,
        dataAtendimento: new Date(),
        guiche: guicheSelecionado
      };
      atualizarSenha(senhaFinalizada);
      setSenhaAtual(null);
    }
  };

  return (
    <div className="atendente-container">
      <header className="header-guiche">
        <h1>Módulo de Atendimento</h1>
        
        {/* NOVO SELETOR DE BOTÕES */}
        <div className="container-selecao-guiche">
          <span className="label-guiche">Guichê Atual:</span>
          <div className="lista-guiches">
            {GUICHES_DISPONIVEIS.map(num => (
              <button
                key={num}
                // Se for o guichê atual, ganha a classe 'ativo'
                className={`btn-guiche ${guicheSelecionado === num ? 'ativo' : ''}`}
                onClick={() => setGuicheSelecionado(num)}
                disabled={!!senhaAtual} // Trava se estiver atendendo
              >
                {num}
              </button>
            ))}
          </div>
        </div>

      </header>

      <main className="area-trabalho">
        {senhaAtual ? (
          <div className="cartao-atendimento-ativo">
            <h2>Em atendimento no Guichê {guicheSelecionado}</h2>
            <div className="numero-senha">{senhaAtual.id}</div>
            <p>Tipo: {senhaAtual.tipo}</p>
            <div className="acoes-atendimento">
              <button onClick={handleFinalizar} className="btn-finalizar">
                Finalizar Atendimento
              </button>
              <button onClick={handleFinalizar} className="btn-ausente">
                Cliente Ausente
              </button>
            </div>
          </div>
        ) : (
          <div className="estado-livre">
            <h2>Guichê {guicheSelecionado} Livre</h2>
            <p>Aguardando chamada...</p>
            <button onClick={handleChamarProximo} className="btn-chamar">
              Chamar Próximo
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Atendente;