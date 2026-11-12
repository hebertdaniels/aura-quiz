/**
 * ESTADO: QuizState
 * -----------------
 * É a "memória" da partida: em qual tela estamos, qual o nome do jogador,
 * em qual pergunta ele está e o que já respondeu.
 *
 * Funciona como um quadro de avisos: as telas "assinam" o quadro e,
 * sempre que algo muda, todo mundo que assinou é avisado.
 *
 * Telas possíveis: 'splash' → 'nome' → 'quiz' → 'resultado'
 */

import { calcularAura, calcularLimites } from '../core/usecases/calcularAura.js';
import { classificarAura } from '../core/usecases/classificarAura.js';

const estadoInicial = () =>
  Object.freeze({
    tela: 'splash',
    nome: '',
    indiceAtual: 0,
    respostas: [],
  });

export class QuizState {
  #estado = estadoInicial();
  #ouvintes = new Set();
  #perguntas;
  #faixas;

  constructor(perguntas, faixas) {
    this.#perguntas = perguntas;
    this.#faixas = faixas;
  }

  // ---------- Leitura (só olhar, sem mudar nada) ----------

  get estado() {
    return this.#estado;
  }

  get perguntaAtual() {
    return this.#perguntas[this.#estado.indiceAtual];
  }

  get totalDePerguntas() {
    return this.#perguntas.length;
  }

  get totalPrincipais() {
    return this.#perguntas.filter((pergunta) => !pergunta.bonus).length;
  }

  get resultado() {
    const pontos = calcularAura(this.#perguntas, this.#estado.respostas);
    return {
      pontos,
      faixa: classificarAura(pontos, this.#faixas),
      limites: calcularLimites(this.#perguntas),
    };
  }

  // ---------- Assinatura (quem quer ser avisado das mudanças) ----------

  assinar(ouvinte) {
    this.#ouvintes.add(ouvinte);
    return () => this.#ouvintes.delete(ouvinte);
  }

  #atualizar(mudancas) {
    this.#estado = Object.freeze({ ...this.#estado, ...mudancas });
    this.#ouvintes.forEach((ouvinte) => ouvinte(this.#estado));
  }

  // ---------- Ações (o que pode acontecer no jogo) ----------

  irParaNome() {
    if (this.#estado.tela !== 'splash') return;
    this.#atualizar({ tela: 'nome' });
  }

  comecar(nome) {
    this.#atualizar({ tela: 'quiz', nome: nome.trim(), indiceAtual: 0, respostas: [] });
  }

  responder(indiceOpcao) {
    const { indiceAtual, respostas } = this.#estado;
    const novasRespostas = [...respostas.slice(0, indiceAtual), indiceOpcao];
    const ehUltima = indiceAtual === this.#perguntas.length - 1;

    if (ehUltima) {
      this.#atualizar({ tela: 'resultado', respostas: novasRespostas });
    } else {
      this.#atualizar({ indiceAtual: indiceAtual + 1, respostas: novasRespostas });
    }
  }

  voltar() {
    const { indiceAtual, respostas } = this.#estado;
    if (indiceAtual === 0) return;
    this.#atualizar({
      indiceAtual: indiceAtual - 1,
      respostas: respostas.slice(0, indiceAtual - 1),
    });
  }

  jogarDeNovo() {
    // Volta para a tela de nome vazia: na feira, quem joga a seguir é outra pessoa.
    this.#atualizar({ ...estadoInicial(), tela: 'nome' });
  }
}
