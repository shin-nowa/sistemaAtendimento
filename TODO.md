# TODO - Sistema de Atendimento

## 1. Estruturação e configuração
- [x] Configurar Vite + React + Typescript + SWC
- [x] Configurar React Router (Rotas em App.tsx)
- [x] Definir a tipagem global (index.ts)
- [x] Implementar banco de dados via localstorage (`storage.ts`)

## 2. Componente Totem
- [x] Interface com botões para a retirada de senhas
- [x] Lógica de senha para ser impressa no formato correto9 (`YYMMDD-PPSQ`)
- [x] Salvar na fila de espera e no histórico geral
- [ ] Simular um papelzinho na tela (imprimir)
- [ ] Reiniciar a sequência para cada dia que passar

## 3. Componente Painel
- [x] Atualização em tempo real
- [x] Exibir senha da vez destacada
- [ ] Aprimorar a animação da senha chamada
- [ ] Tocar um som para cada nova senha chamada

## 4. Componente Atendente
- [x] Seleção de guichê
- [x] Botão para chamar próximo
- [x] Botão de cliente ausente
- [x] Botão de finalizar atendimento

## 5. Componente Admin
- [x] Dashboard intuitivo
- [x] Filtro por data (inicio e fim)
- [x] Relatório Geral (TM Espera e atendimento)
- [x] Relatório por guichê
- [x] Relatório por horário
- [x] Exportação para csv
- [ ] Botão de resetar banco de dados
- [ ] Melhorar responsividade em telas menores

**Legenda:**
- [x] Concluído
- [ ] Pendente