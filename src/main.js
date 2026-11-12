/**
 * MAESTRO: main.js
 * ----------------
 * É aqui que tudo se conecta:
 *   1. pega os dados do jogo (core)
 *   2. cria a memória da partida (state)
 *   3. desenha a tela certa (components) sempre que algo muda
 */

import { PERGUNTAS } from './core/data/perguntas.js';
import { FAIXAS } from './core/data/faixas.js';
import { QuizState } from './state/QuizState.js';
import { SplashScreen } from './components/SplashScreen.js';
import { NameInput } from './components/NameInput.js';
import { QuestionCard } from './components/QuestionCard.js';
import { ResultScreen } from './components/ResultScreen.js';
import { ThemeToggle } from './components/ThemeToggle.js';

const quiz = new QuizState(PERGUNTAS, FAIXAS);
const raiz = document.getElementById('app');
let destruirTelaAnterior = null;

/** Decide qual tela mostrar, de acordo com o estado atual. */
function criarTela(estado) {
  switch (estado.tela) {
    case 'splash':
      return SplashScreen({ aoTerminar: () => quiz.irParaNome() });

    case 'nome':
      return NameInput({
        totalPrincipais: quiz.totalPrincipais,
        aoConfirmar: (nome) => quiz.comecar(nome),
      });

    case 'quiz':
      return QuestionCard({
        pergunta: quiz.perguntaAtual,
        indice: estado.indiceAtual,
        totalPrincipais: quiz.totalPrincipais,
        totalDePerguntas: quiz.totalDePerguntas,
        aoResponder: (opcao) => quiz.responder(opcao),
        aoVoltar: () => quiz.voltar(),
      });

    case 'resultado':
      return ResultScreen({
        nome: estado.nome,
        ...quiz.resultado,
        aoJogarDeNovo: () => quiz.jogarDeNovo(),
      });

    default:
      throw new Error(`Tela desconhecida: ${estado.tela}`);
  }
}

/** Troca a tela: limpa a anterior e desenha a nova. */
function desenhar(estado) {
  destruirTelaAnterior?.();

  const { elemento, destruir } = criarTela(estado);
  raiz.replaceChildren(elemento);
  destruirTelaAnterior = destruir ?? null;

  // No resultado, o brilho do fundo da página ganha a cor da faixa de aura.
  if (estado.tela === 'resultado') {
    document.body.style.setProperty('--cor-fundo', quiz.resultado.faixa.cor);
  } else {
    document.body.style.removeProperty('--cor-fundo');
  }

  // Acessibilidade: leva o foco para o elemento principal da nova tela.
  elemento.matches('[data-foco]')
    ? elemento.focus({ preventScroll: true })
    : elemento.querySelector('[data-foco]')?.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

// ---------- Início ----------
document.body.prepend(ThemeToggle());
quiz.assinar(desenhar);
desenhar(quiz.estado);

// ---------- Modo offline (PWA) ----------
// No computador local (localhost) não ativamos, para as mudanças no código
// aparecerem na hora. Na hospedagem, o app passa a funcionar sem internet.
const ehLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
if ('serviceWorker' in navigator && !ehLocal && window.isSecureContext) {
  navigator.serviceWorker.register('./sw.js').catch(() => {
    /* se falhar, o app continua funcionando normalmente online */
  });
}
