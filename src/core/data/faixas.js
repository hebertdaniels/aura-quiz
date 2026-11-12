/**
 * DADOS: Faixas de Aura
 * ---------------------
 * Cada faixa cobre uma dezena de pontos. A pontuação vai de -75 a +75.
 *
 * Como funciona o "minimo": o app procura, de cima para baixo,
 * a primeira faixa em que a pontuação seja MAIOR OU IGUAL ao mínimo.
 * Por isso a lista precisa ficar em ordem, da maior para a menor.
 *
 * Quer mudar uma mensagem? É só editar o texto aqui!
 */

import { criarFaixa } from '../entities/FaixaDeAura.js';

const dados = [
  {
    minimo: 60, // 60 a 75
    titulo: 'Aura Lendária',
    emoji: '👑',
    cor: '#f59e0b',
    mensagem: 'Você não tem aura, você É a aura. Quando você chega, até o Wi-Fi fica mais forte.',
  },
  {
    minimo: 50, // 50 a 59
    titulo: 'Aura Divina',
    emoji: '🌟',
    cor: '#eab308',
    mensagem: 'Velhinhas te elogiam, crianças te admiram e o sol nasce só pra te ver passar.',
  },
  {
    minimo: 40, // 40 a 49
    titulo: 'Aura Radiante',
    emoji: '☀️',
    cor: '#84cc16',
    mensagem: 'Sua presença ilumina o ambiente. Dá até pra economizar na conta de luz.',
  },
  {
    minimo: 30, // 30 a 39
    titulo: 'Aura Brilhante',
    emoji: '✨',
    cor: '#22c55e',
    mensagem: 'Você brilha muito! Mais um pouquinho e vira personagem principal.',
  },
  {
    minimo: 20, // 20 a 29
    titulo: 'Aura em Alta',
    emoji: '📈',
    cor: '#14b8a6',
    mensagem: 'Sua aura está subindo igual foguete. A galera já percebeu.',
  },
  {
    minimo: 10, // 10 a 19
    titulo: 'Aura Positiva',
    emoji: '🙂',
    cor: '#06b6d4',
    mensagem: 'Aura do bem confirmada. Nada de exagero, só boas vibrações.',
  },
  {
    minimo: -9, // -9 a 9
    titulo: 'Aura Equilibrada',
    emoji: '⚖️',
    cor: '#8b5cf6',
    mensagem: 'Nem muito, nem pouco. Sua aura é zen igual monge em dia de folga.',
  },
  {
    minimo: -19, // -10 a -19
    titulo: 'Aura Oscilando',
    emoji: '🌗',
    cor: '#a1a1aa',
    mensagem: 'Sua aura está tipo sinal de celular no elevador: some e volta.',
  },
  {
    minimo: -29, // -20 a -29
    titulo: 'Aura em Baixa',
    emoji: '📉',
    cor: '#fb923c',
    mensagem: 'Alerta amarelo! Sua aura precisa de um café e de um elogio de velhinha.',
  },
  {
    minimo: -39, // -30 a -39
    titulo: 'Aura Apagada',
    emoji: '🕯️',
    cor: '#f97316',
    mensagem: 'Sua aura está em modo economia de bateria. Bora recarregar!',
  },
  {
    minimo: -49, // -40 a -49
    titulo: 'Aura no Vermelho',
    emoji: '🚨',
    cor: '#ef4444',
    mensagem: 'Cuidado para não negativar! Sua aura está devendo pro banco da moral.',
  },
  {
    minimo: -59, // -50 a -59
    titulo: 'Aura Negativada',
    emoji: '💸',
    cor: '#dc2626',
    mensagem: 'Sua aura entrou no SPC. Negocie a dívida com boas ações.',
  },
  {
    minimo: -Infinity, // -60 a -75 (e qualquer coisa abaixo)
    titulo: 'Aura no Cheque Especial',
    emoji: '🕳️',
    cor: '#b91c1c',
    mensagem: 'Aura no cheque especial, com juros! Mas relaxa: todo mundo merece uma segunda chance.',
  },
];

export const FAIXAS = Object.freeze(dados.map(criarFaixa));
