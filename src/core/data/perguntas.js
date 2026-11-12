/**
 * DADOS: Perguntas do quiz
 * ------------------------
 * Quer mudar uma pergunta, uma resposta ou os pontos? É só editar aqui!
 * Nenhum outro arquivo precisa ser alterado.
 *
 * A última pergunta tem "bonus: true" e vale muito mais pontos.
 */

import { criarPergunta } from '../entities/Pergunta.js';

const dados = [
  {
    id: 1,
    texto: 'Você é constantemente elogiado por velhinhas?',
    opcoes: [
      { texto: 'Sô chad fi', pontos: 3 },
      { texto: 'Nem minha vó', pontos: -3 },
      { texto: 'Às vezes', pontos: 0 },
    ],
  },
  {
    id: 2,
    texto: 'Você é bom em algum esporte?',
    opcoes: [
      { texto: 'Muitos', pontos: 5 },
      { texto: 'Alguns', pontos: 0 },
      { texto: 'Nenhum', pontos: -5 },
    ],
  },
  {
    id: 3,
    texto: 'Você iria numa batalha de farmar aura?',
    opcoes: [
      { texto: 'Por dinheiro', pontos: 7 },
      { texto: 'Nada a vê, seloko', pontos: 0 },
      { texto: 'Iria e ganharia', pontos: -7 },
    ],
  },
  {
    id: 4,
    texto: 'Você ouve phonk?',
    opcoes: [
      { texto: 'Muito e ativo a adrenalina', pontos: -8 },
      { texto: 'Tá tirano', pontos: 8 },
      { texto: 'Só pela música', pontos: 0 },
    ],
  },
  {
    id: 5,
    texto: 'Você é constantemente elogiado por crianças?',
    opcoes: [
      { texto: 'Direto, sou sigma', pontos: 4 },
      { texto: 'As criança tem medo de mim', pontos: -4 },
      { texto: 'Às vezes', pontos: 0 },
    ],
  },
  {
    id: 6,
    texto: 'Você tem medo de alguém?',
    opcoes: [
      { texto: 'Morro de medo de ser mogado', pontos: -2 },
      { texto: 'Não tenho medo de betinha', pontos: 2 },
      { texto: 'Apenas autoridades', pontos: 0 },
    ],
  },
  {
    id: 7,
    texto: 'Você tem amigos?',
    opcoes: [
      { texto: 'Muitos', pontos: 1 },
      { texto: 'Nenhum', pontos: -1 },
      { texto: '1 ou 2', pontos: 0 },
    ],
  },
  {
    id: 8,
    texto: 'Você já comprou curso de algum coach?',
    opcoes: [
      { texto: 'Acho ridículo', pontos: 9 },
      { texto: 'Não', pontos: 0 },
      { texto: 'Com certeza', pontos: -9 },
    ],
  },
  {
    id: 9,
    texto: 'Você se acha parecido com o Mentalista ou algum personagem de anime?',
    opcoes: [
      { texto: 'Sou o próprio', pontos: -6 },
      { texto: 'Apenas personalidade', pontos: 0 },
      { texto: 'Nada a ver', pontos: 6 },
    ],
  },
  {
    id: 10,
    texto: 'Você acha que está numa edit?',
    opcoes: [
      { texto: 'Sai fora, nengue', pontos: 10 },
      { texto: 'Não', pontos: 0 },
      { texto: 'Óbvio, sou aurudo', pontos: -10 },
    ],
  },
  {
    id: 11,
    bonus: true,
    texto: 'Você prefere Neymar, Messi ou CR7?',
    opcoes: [
      { texto: 'Neymar', pontos: -20 },
      { texto: 'Messi', pontos: 0 },
      { texto: 'CR7', pontos: 20 },
    ],
  },
];

export const PERGUNTAS = Object.freeze(dados.map(criarPergunta));
