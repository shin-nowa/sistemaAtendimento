// tela do totem onde os clientes tiram a ficha
import React from "react";
import '../App.css'

const Totem: React.FC = () => {
    return (
        <div className = "container-pagina">
            <h1>Retire sua senha</h1>
            <p>Toque em uma das opções abaixo</p>
            <div style = {{ display: 'flex', gap: '20px', marginTop: '20px'}}>
                <button style={{ padding: '20px', backgroundColor: 'red', color: 'white' }}>Prioritário (SP)</button>
                <button style={{ padding: '20px', backgroundColor: 'blue', color: 'white' }}>Geral (SG)</button>
                <button style={{ padding: '20px', backgroundColor: 'green', color: 'white' }}>Exames (SE)</button>
            </div>
        </div>
    )
}

export default Totem;