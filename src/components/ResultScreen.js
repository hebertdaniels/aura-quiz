/**
 * TELA: Resultado
 * ---------------
 * Mostra a pontuação (com animação contando), a faixa de aura,
 * a mensagem e um medidor de -75 a +75.
 */

import { el, prefereMenosAnimacao } from './dom.js';

const DURACAO_CONTAGEM_MS = 1400;

const comSinal = (numero) => (numero > 0 ? `+${numero}` : String(numero));

export function ResultScreen({ nome, pontos, faixa, limites, aoJogarDeNovo }) {
  const numero = el('span', { class: 'resultado__pontos', 'aria-hidden': 'true' }, '0');

  // Posição do marcador no medidor (0% = aura mínima, 100% = máxima)
  const posicao = ((pontos - limites.minimo) / (limites.maximo - limites.minimo)) * 100;

  const avisoCompartilhar = el('p', { class: 'texto-suave texto-pequeno centro', role: 'status' });

  const elemento = el(
    'section',
    { class: 'tela pilha', style: { '--cor-faixa': faixa.cor } },
    el(
      'div',
      { class: 'card card--resultado pilha centro' },
      el('p', { class: 'texto-suave', tabindex: '-1', 'data-foco': true }, `${nome}, sua aura é…`),
      el('span', { class: 'sr-only' }, `${comSinal(pontos)} pontos.`),
      numero,
      el(
        'div',
        { class: 'pilha pilha--curta' },
        el('span', { class: 'resultado__emoji', 'aria-hidden': 'true' }, faixa.emoji),
        el('h2', { class: 'resultado__titulo' }, faixa.titulo),
        el('p', { class: 'resultado__mensagem' }, faixa.mensagem),
      ),
      el(
        'div',
        { class: 'medidor', 'aria-hidden': 'true' },
        el('div', { class: 'medidor__trilho' }, el('div', { class: 'medidor__marcador', style: { left: `${posicao}%` } })),
        el(
          'div',
          { class: 'medidor__legenda' },
          el('span', {}, comSinal(limites.minimo)),
          el('span', {}, '0'),
          el('span', {}, comSinal(limites.maximo)),
        ),
      ),
    ),
    el(
      'div',
      { class: 'acoes' },
      el('button', { type: 'button', class: 'btn btn--lg', onclick: aoJogarDeNovo }, 'Jogar de novo'),
      el(
        'button',
        { type: 'button', class: 'btn btn--outline btn--lg', onclick: () => compartilhar(nome, pontos, faixa, avisoCompartilhar) },
        'Compartilhar',
      ),
    ),
    avisoCompartilhar,
  );

  const pararContagem = animarContagem(numero, pontos);

  return { elemento, destruir: pararContagem };
}

/** Faz o número "correr" de 0 até a pontuação final. */
function animarContagem(alvo, pontosFinais) {
  if (prefereMenosAnimacao()) {
    alvo.textContent = comSinal(pontosFinais);
    return () => {};
  }

  let quadro;
  const inicio = performance.now();

  const passo = (agora) => {
    const progresso = Math.min((agora - inicio) / DURACAO_CONTAGEM_MS, 1);
    const suavizado = 1 - (1 - progresso) ** 3; // começa rápido e freia no final
    alvo.textContent = comSinal(Math.round(pontosFinais * suavizado));
    if (progresso < 1) quadro = requestAnimationFrame(passo);
  };
  quadro = requestAnimationFrame(passo);

  // Garantia: se a animação não rodar (aba em segundo plano, por exemplo),
  // o número final aparece mesmo assim.
  const garantia = setTimeout(() => {
    alvo.textContent = comSinal(pontosFinais);
  }, DURACAO_CONTAGEM_MS + 100);

  return () => {
    cancelAnimationFrame(quadro);
    clearTimeout(garantia);
  };
}

async function compartilhar(nome, pontos, faixa, aviso) {
  const texto = `${faixa.emoji} ${nome} tirou ${comSinal(pontos)} no Aura Quiz: ${faixa.titulo}! Descubra a sua:`;
  const url = window.location.href.split('#')[0];

  try {
    if (navigator.share) {
      await navigator.share({ title: 'Aura Quiz', text: texto, url });
      return;
    }
    await navigator.clipboard.writeText(`${texto} ${url}`);
    aviso.textContent = 'Resultado copiado! É só colar onde quiser.';
  } catch (erro) {
    if (erro?.name !== 'AbortError') {
      aviso.textContent = 'Não deu para compartilhar daqui. Que tal um print? 📸';
    }
  }
}
