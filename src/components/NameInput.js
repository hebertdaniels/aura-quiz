/**
 * TELA: Nome do jogador
 * ---------------------
 * Pede o nome só para deixar o resultado mais pessoal.
 * O nome NÃO é salvo nem enviado para lugar nenhum.
 */

import { el } from './dom.js';

const TAMANHO_MAXIMO = 20;

export function NameInput({ totalPrincipais, aoConfirmar }) {
  const campo = el('input', {
    id: 'nome',
    class: 'input',
    type: 'text',
    name: 'nome',
    maxlength: TAMANHO_MAXIMO,
    autocomplete: 'off',
    autocapitalize: 'words',
    enterkeyhint: 'go',
    placeholder: 'Ex.: Lucas',
    required: true,
    'data-foco': true,
  });

  const botao = el('button', { type: 'submit', class: 'btn btn--lg btn--bloco', disabled: true }, 'Começar o quiz');

  campo.addEventListener('input', () => {
    botao.disabled = campo.value.trim().length === 0;
  });

  const formulario = el(
    'form',
    {
      class: 'card pilha',
      novalidate: true,
      onsubmit: (evento) => {
        evento.preventDefault();
        const nome = campo.value.trim();
        if (nome) aoConfirmar(nome);
      },
    },
    el(
      'div',
      { class: 'pilha pilha--curta' },
      el('h2', { class: 'card__titulo' }, 'Quem vai medir a aura?'),
      el(
        'p',
        { class: 'texto-suave' },
        `São ${totalPrincipais} perguntas + 1 bônus. Responda com sinceridade 😉`,
      ),
    ),
    el(
      'div',
      { class: 'pilha pilha--curta' },
      el('label', { class: 'rotulo', for: 'nome' }, 'Seu nome'),
      campo,
    ),
    botao,
  );

  return { elemento: el('section', { class: 'tela' }, formulario) };
}
