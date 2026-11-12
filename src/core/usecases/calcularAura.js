/**
 * CASO DE USO: Calcular a aura
 * ----------------------------
 * Um "caso de uso" é uma AÇÃO que o jogo sabe fazer.
 * Esta soma os pontos das respostas escolhidas.
 *
 * respostas = lista com o número da opção escolhida em cada pergunta.
 * Exemplo: [0, 2, 1] → 1ª opção na pergunta 1, 3ª na pergunta 2, 2ª na pergunta 3.
 */

export function calcularAura(perguntas, respostas) {
  return respostas.reduce((total, indiceOpcao, indicePergunta) => {
    const opcao = perguntas[indicePergunta].opcoes[indiceOpcao];
    return total + opcao.pontos;
  }, 0);
}

/**
 * Descobre a menor e a maior pontuação possível no quiz.
 * Serve para desenhar o "medidor de aura" na tela de resultado.
 */
export function calcularLimites(perguntas) {
  return perguntas.reduce(
    (limites, pergunta) => {
      const pontos = pergunta.opcoes.map((opcao) => opcao.pontos);
      return {
        minimo: limites.minimo + Math.min(...pontos),
        maximo: limites.maximo + Math.max(...pontos),
      };
    },
    { minimo: 0, maximo: 0 },
  );
}
