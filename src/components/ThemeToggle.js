/**
 * COMPONENTE: Botão de tema (claro / escuro)
 * ------------------------------------------
 * Por padrão o app segue o tema do aparelho.
 * Se a pessoa trocar, a escolha fica lembrada neste navegador.
 */

import { el } from './dom.js';

const CHAVE = 'aura-quiz:tema';
const raiz = document.documentElement;
const sistemaEscuro = window.matchMedia('(prefers-color-scheme: dark)');

function lerPreferencia() {
  try {
    return localStorage.getItem(CHAVE);
  } catch {
    return null; // navegação anônima ou armazenamento bloqueado
  }
}

function salvarPreferencia(tema) {
  try {
    localStorage.setItem(CHAVE, tema);
  } catch {
    /* sem problema: só não vai lembrar da próxima vez */
  }
}

const temaAtual = () => raiz.dataset.theme ?? (sistemaEscuro.matches ? 'dark' : 'light');

export function ThemeToggle() {
  const salvo = lerPreferencia();
  if (salvo === 'light' || salvo === 'dark') raiz.dataset.theme = salvo;

  const botao = el('button', { type: 'button', class: 'btn btn--ghost btn--icone botao-tema' });

  const atualizarRotulo = () => {
    const escuro = temaAtual() === 'dark';
    botao.textContent = escuro ? '☀️' : '🌙';
    botao.setAttribute('aria-label', escuro ? 'Mudar para tema claro' : 'Mudar para tema escuro');
  };

  botao.addEventListener('click', () => {
    const novo = temaAtual() === 'dark' ? 'light' : 'dark';
    raiz.dataset.theme = novo;
    salvarPreferencia(novo);
    atualizarRotulo();
  });
  sistemaEscuro.addEventListener('change', atualizarRotulo);

  atualizarRotulo();
  return botao;
}
