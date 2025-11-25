import { useState } from 'react'
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import './App.css'
import Totem from './pages/Totem';
import Painel from './pages/Painel';
import Atendente from './pages/Atendente';
import Admin from './pages/Admin';

function App() {
  return (
   <BrowserRouter>
      <div style={{width: '100%', minHeight: '100vh', backgroundColor: '#ffffff'}}>
        {/* Menu navegação*/}
        <nav>
          <Link to="/totem">🖥️ Totem</Link>
          <Link to="/painel">📺 Painel TV</Link>
          <Link to="/guiche">👨‍💼 Atendente</Link>
          <Link to="/admin">📊 Relatórios</Link>
        </nav>

        <Routes>
          <Route path="/totem" element={<Totem />} />
          <Route path="/painel" element={<Painel />} />
          <Route path="/guiche" element={<Atendente />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={
            <div style={{textAlign: 'center', padding: '50px', color: 'var(--cor-texto)', backgroundColor: '#ffffff'}}>
              <h1>Sistema de Atendimento</h1>
              <p>Selecione um módulo acima para começar.</p>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App