/**
 * ENTIDADE: Pergunta
 * ------------------
 * Uma entidade é o "molde" de uma coisa importante do jogo.
 * Aqui dizemos COMO uma pergunta deve ser e conferimos se ela está certinha.
 * Se alguém cadastrar uma pergunta errada, o app avisa na hora.
 */

export function criarPergunta({ id, texto, opcoes, bonus = false }) {
  if (!texto) {
    throw new Error(`Pergunta ${id}: o texto não pode ficar vazio.`);
  }
  if (!Array.isArray(opcoes) || opcoes.length < 2) {
    throw new Error(`Pergunta ${id}: precisa ter pelo menos 2 opções.`);
  }
  for (const opcao of opcoes) {
    if (!opcao.texto || typeof opcao.pontos !== 'number') {
      throw new Error(`Pergunta ${id}: toda opção precisa de texto e pontos.`);
    }
  }

  // Object.freeze "congela" o objeto: ninguém consegue mudar depois.
  return Object.freeze({
    id,
    texto,
    bonus,
    opcoes: Object.freeze(opcoes.map((opcao) => Object.freeze({ ...opcao }))),
  });
}
