// Painel de TV para exibição das últimas senhas chamadas
import React, { useState, useEffect } from "react";
import '../App.css'
import './Painel.css'
import type { Senha } from "../types";
import { lerHistoricoChamadas } from "../utils/filaUtils";

const Painel: React.FC = () => {
    const [ultimasChamadas, setUltimasChamadas] = useState<Senha[]>([]);

    // Atualizar o painel a cada segundo para manter sincronizado
    useEffect(() => {
        const atualizarPainel = () => {
            const historico = lerHistoricoChamadas();
            // Garante que mostra apenas as 5 últimas senhas chamadas
            setUltimasChamadas(historico.slice(0, 5));
        };

        // Atualizar imediatamente
        atualizarPainel();

        // Atualizar a cada 500ms para resposta mais rápida
        const interval = setInterval(atualizarPainel, 500);

        // Listener para mudanças no localStorage (quando outra aba atualiza)
        const handleStorageChange = () => {
            setTimeout(atualizarPainel, 50);
        };
        window.addEventListener('storage', handleStorageChange);

        // Listener customizado para quando uma senha é chamada
        const handleSenhaChamada = () => {
            atualizarPainel();
        };
        window.addEventListener('senhaChamada', handleSenhaChamada);

        // Listener customizado para quando uma senha é gerada (atualiza imediatamente)
        const handleSenhaGerada = () => {
            // Atualiza imediatamente quando nova senha é gerada
            atualizarPainel();
        };
        window.addEventListener('senhaGerada', handleSenhaGerada);

        // Polling alternativo: verifica mudanças no tamanho da fila
        let ultimoTamanhoFila = 0;
        const verificarMudancas = () => {
            try {
                const fila = JSON.parse(localStorage.getItem('fila_espera') || '[]');
                if (fila.length !== ultimoTamanhoFila) {
                    ultimoTamanhoFila = fila.length;
                    atualizarPainel();
                }
            } catch (e) {
                // Ignora erros de parsing
            }
        };
        const intervalFila = setInterval(verificarMudancas, 300);

        return () => {
            clearInterval(interval);
            clearInterval(intervalFila);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('senhaChamada', handleSenhaChamada);
            window.removeEventListener('senhaGerada', handleSenhaGerada);
        };
    }, []);

    // Função para obter cor baseada no tipo de senha (cores mais suaves e hospitalares)
    const getCorTipo = (tipo: string) => {
        switch (tipo) {
            case 'SP':
                return '#e74c3c'; // Vermelho para Prioritário
            case 'SE':
                return '#27ae60'; // Verde para Exames
            case 'SG':
                return '#3498db'; // Azul para Geral
            default:
                return '#95a5a6';
        }
    };

    // Função para obter nome completo do tipo
    const getNomeTipo = (tipo: string) => {
        switch (tipo) {
            case 'SP':
                return 'PRIORITÁRIO';
            case 'SE':
                return 'EXAMES';
            case 'SG':
                return 'GERAL';
            default:
                return tipo;
        }
    };

    return (
        <div className="painel-tv-container">
            <header className="painel-header">
                <h1 className="painel-titulo">ATENDIMENTO</h1>
                <div className="painel-subtitulo">Aguarde a chamada da sua senha</div>
            </header>

            <div className="painel-conteudo">
                {ultimasChamadas.length === 0 ? (
                    <div className="painel-aguardando">
                        <div className="painel-mensagem-vazia">
                            <span className="painel-icone">📋</span>
                            <h2>Aguardando chamadas...</h2>
                            <p>As senhas chamadas aparecerão aqui</p>
                        </div>
                    </div>
                ) : (
                    <div className="painel-lista-chamadas">
                        {ultimasChamadas.slice(0, 5).map((senha, index) => (
                            <div 
                                key={`${senha.id}-${index}`} 
                                className="painel-item-chamada"
                                style={{ 
                                    borderLeftColor: getCorTipo(senha.tipo),
                                    animationDelay: `${index * 0.08}s`
                                }}
                            >
                                <div className="painel-item-header">
                                    <div className="painel-tipo-senha" style={{ backgroundColor: getCorTipo(senha.tipo) }}>
                                        {getNomeTipo(senha.tipo)}
                                    </div>
                                    <div className="painel-timestamp">
                                        {senha.dataAtendimento 
                                            ? new Date(senha.dataAtendimento).toLocaleTimeString('pt-BR', { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                              })
                                            : 'Agora'
                                        }
                                    </div>
                                </div>
                                <div className="painel-numero-senha">
                                    {senha.id}
                                </div>
                                {senha.guiche && (
                                    <div className="painel-item-info">
                                        <div className="painel-guiche">
                                            Guichê: <strong>{senha.guiche}</strong>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <footer className="painel-footer">
                <div className="painel-legenda">
                    <div className="painel-legenda-item">
                        <span className="painel-legenda-cor" style={{ backgroundColor: getCorTipo('SP') }}></span>
                        <span>Prioritário</span>
                    </div>
                    <div className="painel-legenda-item">
                        <span className="painel-legenda-cor" style={{ backgroundColor: getCorTipo('SE') }}></span>
                        <span>Exames</span>
                    </div>
                    <div className="painel-legenda-item">
                        <span className="painel-legenda-cor" style={{ backgroundColor: getCorTipo('SG') }}></span>
                        <span>Geral</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Painel;
