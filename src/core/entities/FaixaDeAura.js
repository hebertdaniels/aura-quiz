/**
 * ENTIDADE: Faixa de Aura
 * -----------------------
 * Cada faixa é um "degrau" do resultado. Ela começa numa pontuação mínima
 * e tem título, emoji, cor e uma mensagem própria.
 */

export function criarFaixa({ minimo, titulo, emoji, cor, mensagem }) {
  if (typeof minimo !== 'number') {
    throw new Error(`Faixa "${titulo}": o mínimo precisa ser um número.`);
  }
  if (!titulo || !mensagem) {
    throw new Error('Toda faixa precisa de título e mensagem.');
  }

  return Object.freeze({ minimo, titulo, emoji, cor, mensagem });
}
