/**
 * TESTES AUTOMÁTICOS
 * ------------------
 * Abra http://localhost:8080/testes/ com o servidor ligado.
 * Cada teste diz o que ESPERAMOS que aconteça e confere se aconteceu.
 */

import { PERGUNTAS } from '../src/core/data/perguntas.js';
import { FAIXAS } from '../src/core/data/faixas.js';
import { criarPergunta } from '../src/core/entities/Pergunta.js';
import { calcularAura, calcularLimites } from '../src/core/usecases/calcularAura.js';
import { classificarAura } from '../src/core/usecases/classificarAura.js';
import { QuizState } from '../src/state/QuizState.js';

const resultados = [];

function teste(descricao, verificar) {
  try {
    verificar();
    resultados.push({ descricao, passou: true });
  } catch (erro) {
    resultados.push({ descricao, passou: false, motivo: erro.message });
  }
}

function esperar(valor, esperado) {
  if (valor !== esperado) throw new Error(`esperava ${esperado}, veio ${valor}`);
}

// ---------- Perguntas ----------

teste('O quiz tem 10 perguntas principais + 1 bônus', () => {
  esperar(PERGUNTAS.filter((p) => !p.bonus).length, 10);
  esperar(PERGUNTAS.filter((p) => p.bonus).length, 1);
  esperar(PERGUNTAS.at(-1).bonus, true);
});

teste('Pergunta sem opções é recusada', () => {
  let recusou = false;
  try {
    criarPergunta({ id: 99, texto: 'Teste?', opcoes: [] });
  } catch {
    recusou = true;
  }
  esperar(recusou, true);
});

// ---------- Cálculo ----------

teste('A pontuação vai de -75 a +75', () => {
  const { minimo, maximo } = calcularLimites(PERGUNTAS);
  esperar(minimo, -75);
  esperar(maximo, 75);
});

teste('Escolher sempre a melhor opção dá +75', () => {
  const melhores = PERGUNTAS.map((p) => {
    const pontos = p.opcoes.map((o) => o.pontos);
    return pontos.indexOf(Math.max(...pontos));
  });
  esperar(calcularAura(PERGUNTAS, melhores), 75);
});

teste('Responder só "neutro" dá 0', () => {
  const neutras = PERGUNTAS.map((p) => p.opcoes.findIndex((o) => o.pontos === 0));
  esperar(calcularAura(PERGUNTAS, neutras), 0);
});

// ---------- Faixas ----------

const casos = [
  [75, 'Aura Lendária'],
  [60, 'Aura Lendária'],
  [59, 'Aura Divina'],
  [20, 'Aura em Alta'],
  [10, 'Aura Positiva'],
  [9, 'Aura Equilibrada'],
  [0, 'Aura Equilibrada'],
  [-9, 'Aura Equilibrada'],
  [-10, 'Aura Oscilando'],
  [-19, 'Aura Oscilando'],
  [-20, 'Aura em Baixa'],
  [-59, 'Aura Negativada'],
  [-60, 'Aura no Cheque Especial'],
  [-75, 'Aura no Cheque Especial'],
];
for (const [pontos, titulo] of casos) {
  teste(`${pontos} pontos → ${titulo}`, () => esperar(classificarAura(pontos, FAIXAS).titulo, titulo));
}

teste('Toda pontuação de -75 a +75 tem uma faixa', () => {
  for (let pontos = -75; pontos <= 75; pontos++) {
    if (!classificarAura(pontos, FAIXAS)) throw new Error(`${pontos} ficou sem faixa`);
  }
});

teste('As faixas estão em ordem, da maior para a menor', () => {
  FAIXAS.forEach((faixa, i) => {
    if (i > 0 && faixa.minimo >= FAIXAS[i - 1].minimo) throw new Error(`"${faixa.titulo}" está fora de ordem`);
  });
});

// ---------- Estado da partida ----------

teste('Uma partida completa termina na tela de resultado', () => {
  const quiz = new QuizState(PERGUNTAS, FAIXAS);
  quiz.irParaNome();
  quiz.comecar('  Lucas  ');
  esperar(quiz.estado.nome, 'Lucas');
  PERGUNTAS.forEach(() => quiz.responder(0));
  esperar(quiz.estado.tela, 'resultado');
  esperar(quiz.estado.respostas.length, 11);
});

teste('Voltar desfaz a última resposta', () => {
  const quiz = new QuizState(PERGUNTAS, FAIXAS);
  quiz.comecar('Ana');
  quiz.responder(0);
  quiz.responder(1);
  quiz.voltar();
  esperar(quiz.estado.indiceAtual, 1);
  esperar(quiz.estado.respostas.length, 1);
});

teste('Jogar de novo limpa tudo e pede um nome novo', () => {
  const quiz = new QuizState(PERGUNTAS, FAIXAS);
  quiz.comecar('Ana');
  PERGUNTAS.forEach(() => quiz.responder(2));
  quiz.jogarDeNovo();
  esperar(quiz.estado.tela, 'nome');
  esperar(quiz.estado.nome, '');
  esperar(quiz.estado.respostas.length, 0);
});

// ---------- Mostra o resultado na tela ----------

const falhas = resultados.filter((r) => !r.passou);
document.getElementById('resumo').textContent = falhas.length
  ? `❌ ${falhas.length} de ${resultados.length} testes falharam`
  : `✅ Todos os ${resultados.length} testes passaram!`;
document.title = falhas.length ? 'FALHOU' : 'PASSOU';

document.getElementById('lista').append(
  ...resultados.map((r) => {
    const item = document.createElement('li');
    item.className = r.passou ? 'ok' : 'erro';
    item.textContent = `${r.passou ? '✔' : '✘'} ${r.descricao}${r.motivo ? ` (${r.motivo})` : ''}`;
    return item;
  }),
);
