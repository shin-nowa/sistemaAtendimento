//tela do atendente com os controles etc
import React from 'react';
import "../App.css"

const Atendente: React.FC = () => {
  return (
    <div className="container-pagina">
      <h1>Módulo do Atendente</h1>
      <p>Guichê: 01</p>
      <button style={{ padding: '10px 20px', fontSize: '1.2rem' }}>
        Chamar Próximo
      </button>
    </div>
  );
};

export default Atendente;