// aq é onde vai as chamadas no telao
import React from "react";
import '../App.css'

const Painel: React.FC = () => {
    return (
        <div className="container-pagina">
            <h1>Painel de chamada</h1>
            <div style = {{ border: '2px solid black', padding: '40px', margin: '20px 0', fontSize: '2rem'}}>
                Aguardando chamada...
            </div>
            <h3>Últimas chamadas</h3>
            <ul>
                <li>---</li>
            </ul>
        </div>
    );
};

export default Painel;