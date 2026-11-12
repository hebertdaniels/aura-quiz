# ✨ Aura Quiz

Responda 10 perguntas + 1 bônus e descubra o nível da sua **aura**!

Projeto feito para a Feira de Ciências. O app foi construído com a ajuda de
Inteligência Artificial: o **Gemini** atuou como gerente de produto (ajudou a
pensar a ideia e escrever os requisitos) e o **Claude** atuou como programador.

---

## ▶️ Como rodar no computador

1. Abra a pasta do projeto.
2. Dê **dois cliques** em `iniciar.bat`.
3. O navegador abre sozinho em `http://localhost:8080`.
4. Para desligar, feche a janela preta.

> Não precisa instalar nada: o servidor usa o PowerShell, que já vem no Windows.
> Abrir o `index.html` direto não funciona: navegadores bloqueiam apps modernos abertos assim.

## 🧪 Testes automáticos

Com o servidor ligado, abra `http://localhost:8080/testes/`.
Os testes conferem se as regras do jogo continuam certas. Tudo verde = tudo funcionando.

## 🌐 Como publicar na internet

Envie **todos os arquivos** da pasta para a hospedagem (menos a pasta `.git`).
Depois, gere um QR Code com o endereço do site e pronto: qualquer pessoa joga pelo celular.

Na versão publicada, o app funciona **até sem internet** depois do primeiro acesso
e pode ser **instalado na tela inicial** do celular, como um aplicativo de verdade.

> Publicou uma versão nova? Abra `sw.js` e aumente o número em `VERSAO`
> (ex.: `aura-quiz-v1` → `aura-quiz-v2`), senão os celulares continuam com a versão antiga.

---

## 🏗️ Como o app é organizado

O app segue a **Clean Architecture** (Arquitetura Limpa). A ideia é separar o
código em camadas, cada uma com uma única responsabilidade, como num restaurante:

| Camada | No restaurante | No app | Pasta |
|---|---|---|---|
| **Core** | 🧑‍🍳 A cozinha e as receitas | As regras do jogo: perguntas, pontos e faixas de aura | `src/core/` |
| **State** | 🧾 O garçom com o bloco de pedidos | Lembra o nome, a pergunta atual e as respostas | `src/state/` |
| **Components** | 🍽️ O salão, onde o cliente fica | As telas que a pessoa vê e toca | `src/components/` |

**A regra de ouro:** as setas só apontam para dentro.
O salão conversa com o garçom, o garçom conversa com a cozinha,
mas **a cozinha não sabe que o salão existe**.

```
components  ──►  state  ──►  core
 (telas)        (memória)    (regras)
```

Por que isso é bom? Se um dia o Aura Quiz virar um app da Play Store ou da
App Store, as telas mudam, mas **a cozinha (core) continua exatamente igual**.

```
aura-quiz/
├── index.html              ← a página principal
├── manifest.webmanifest    ← "carteira de identidade" do app (nome, ícone, cores)
├── sw.js                   ← faz o app funcionar sem internet
├── iniciar.bat             ← liga o servidor local
├── assets/
│   ├── brand/              ← logotipo e símbolo do infinito
│   └── icons/              ← ícones do app (tela inicial do celular)
├── testes/                 ← testes automáticos
└── src/
    ├── main.js             ← o maestro: liga todas as partes
    ├── core/
    │   ├── entities/       ← moldes: como é uma Pergunta e uma Faixa
    │   ├── usecases/       ← ações: calcular e classificar a aura
    │   └── data/           ← as perguntas e as faixas (edite aqui!)
    ├── state/
    │   └── QuizState.js    ← a memória da partida
    ├── components/         ← as telas: abertura, nome, pergunta, resultado
    └── styles/
        ├── tokens.css      ← o design system: cores, cantos, sombras
        ├── base.css        ← regras gerais e responsividade
        └── components.css  ← botões, cards e o visual de cada tela
```

## 🎨 Design System

O visual segue o estilo do **shadcn/ui**, um design system muito usado por
empresas de tecnologia. Ele é baseado em **design tokens**: em vez de espalhar
cores pelo código, todas as decisões de design ficam em variáveis no arquivo
`src/styles/tokens.css`.

### Identidade visual

| Cor | Código | Onde aparece |
|---|---|---|
| 🟣 Roxo Aura | `#8B5CF6` | Cor principal, campo de nome, foco |
| 🩷 Rosa Elétrico | `#EC4899` | Destaque e diversão: "Quiz" no logo, pergunta bônus |
| 🩵 Azul Cósmico | `#06B6D4` | Cor secundária |
| 🌈 Gradiente Aura | roxo → rosa → azul | Símbolo do infinito, botões, barra de progresso |
| ⬛ Fundo | `#0F0E17` | Fundo do tema escuro |
| ◼️ Card | `#1E1B29` | Cartões do tema escuro |
| ⬜ Texto | `#FFFFFF` | Texto do tema escuro |

Quer mudar uma cor da marca no app inteiro? Mude **uma linha** em `tokens.css`
(`--roxo-aura`, `--rosa-eletrico` ou `--azul-cosmico`).

## ✏️ Quero mudar...

- **Uma pergunta ou os pontos** → `src/core/data/perguntas.js`
- **As mensagens do resultado** → `src/core/data/faixas.js`
- **As cores** → `src/styles/tokens.css`

Depois de mudar, rode os testes para conferir se nada quebrou.

## 📊 Faixas de aura

A pontuação vai de **-75 a +75**.

| Pontos | Faixa |
|---|---|
| 60 a 75 | 👑 Aura Lendária |
| 50 a 59 | 🌟 Aura Divina |
| 40 a 49 | ☀️ Aura Radiante |
| 30 a 39 | ✨ Aura Brilhante |
| 20 a 29 | 📈 Aura em Alta |
| 10 a 19 | 🙂 Aura Positiva |
| -9 a 9 | ⚖️ Aura Equilibrada |
| -10 a -19 | 🌗 Aura Oscilando |
| -20 a -29 | 📉 Aura em Baixa |
| -30 a -39 | 🕯️ Aura Apagada |
| -40 a -49 | 🚨 Aura no Vermelho |
| -50 a -59 | 💸 Aura Negativada |
| -60 a -75 | 🕳️ Aura no Cheque Especial |

## 🔒 Privacidade

O nome digitado serve só para deixar o resultado mais pessoal.
Ele **não é salvo e não é enviado** para lugar nenhum.
