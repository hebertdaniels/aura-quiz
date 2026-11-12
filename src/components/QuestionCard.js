/**
 * TELA: Pergunta
 * --------------
 * Mostra uma pergunta, o progresso e as opções de resposta.
 * Dá para responder tocando, clicando ou apertando 1, 2 ou 3 no teclado.
 */

import { el, prefereMenosAnimacao } from './dom.js';

// Pequena pausa para a pessoa VER qual opção escolheu antes de avançar.
const PAUSA_MS = 260;

export function QuestionCard({ pergunta, indice, totalPrincipais, totalDePerguntas, aoResponder, aoVoltar }) {
  let respondeu = false;

  const botoes = pergunta.opcoes.map((opcao, i) =>
    el(
      'button',
      { type: 'button', class: 'btn btn--outline btn--lg opcao', onclick: () => escolher(i) },
      el('kbd', { class: 'opcao__tecla', 'aria-hidden': 'true' }, String(i + 1)),
      el('span', {}, opcao.texto),
    ),
  );

  function escolher(i) {
    if (respondeu) return;
    respondeu = true;
    botoes.forEach((botao, j) => {
      botao.setAttribute('aria-disabled', 'true');
      if (j === i) botao.classList.add('opcao--escolhida');
    });
    setTimeout(() => aoResponder(i), prefereMenosAnimacao() ? 0 : PAUSA_MS);
  }

  function aoApertarTecla(evento) {
    const numero = Number.parseInt(evento.key, 10);
    if (numero >= 1 && numero <= botoes.length) escolher(numero - 1);
  }
  document.addEventListener('keydown', aoApertarTecla);

  const porcentagem = Math.round((indice / totalDePerguntas) * 100);
  const textoProgresso = pergunta.bonus
    ? 'Pergunta bônus'
    : `Pergunta ${indice + 1} de ${totalPrincipais}`;

  const elemento = el(
    'section',
    { class: `tela pilha ${pergunta.bonus ? 'tela--bonus' : ''}` },
    el(
      'div',
      { class: 'pilha pilha--curta' },
      el(
        'div',
        { class: 'linha' },
        el('span', { class: 'texto-suave texto-pequeno' }, textoProgresso),
        pergunta.bonus ? el('span', { class: 'badge badge--bonus' }, '⚡ Vale muito!') : null,
      ),
      el(
        'div',
        {
          class: 'progresso',
          role: 'progressbar',
          'aria-label': 'Progresso do quiz',
          'aria-valuemin': 0,
          'aria-valuemax': 100,
          'aria-valuenow': porcentagem,
        },
        el('div', { class: 'progresso__barra', style: { width: `${porcentagem}%` } }),
      ),
    ),
    el(
      'div',
      { class: 'card pilha' },
      el('h2', { class: 'pergunta__texto', tabindex: '-1', 'data-foco': true }, pergunta.texto),
      el('div', { class: 'opcoes', role: 'group', 'aria-label': 'Opções de resposta' }, botoes),
    ),
    indice > 0
      ? el('button', { type: 'button', class: 'btn btn--ghost voltar', onclick: aoVoltar }, '← Voltar')
      : null,
  );

  return {
    elemento,
    destruir: () => document.removeEventListener('keydown', aoApertarTecla),
  };
}
