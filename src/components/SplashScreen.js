/**
 * TELA: Abertura (Splash)
 * -----------------------
 * Mostra a marca do app por alguns segundos.
 * Tocar na tela (ou apertar Enter) pula a abertura.
 */

import { el } from './dom.js';

const DURACAO_MS = 4000;

export function SplashScreen({ aoTerminar }) {
  let terminou = false;
  const terminar = () => {
    if (terminou) return;
    terminou = true;
    aoTerminar();
  };

  const elemento = el(
    'button',
    {
      type: 'button',
      class: 'tela splash',
      'aria-label': 'Aura Quiz. Toque para começar.',
      'data-foco': true,
      onclick: terminar,
    },
    // Símbolo da marca (o infinito). O nome fica em texto para se adaptar ao tema claro/escuro.
    el('img', {
      class: 'simbolo',
      src: 'assets/brand/simbolo.png',
      alt: '',
      width: 320,
      height: 180,
      decoding: 'async',
    }),
    el('h1', { class: 'splash__titulo' }, 'Aura ', el('span', { class: 'marca__quiz' }, 'Quiz')),
    el('p', { class: 'splash__subtitulo' }, 'Descubra o nível da sua aura'),
    el('span', { class: 'splash__dica' }, 'Toque para começar'),
  );

  const temporizador = setTimeout(terminar, DURACAO_MS);

  return {
    elemento,
    destruir: () => clearTimeout(temporizador),
  };
}
