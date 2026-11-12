/**
 * CASO DE USO: Classificar a aura
 * -------------------------------
 * Recebe a pontuação e devolve a faixa correspondente.
 * As faixas estão em ordem (da maior para a menor), então a primeira
 * que "couber" a pontuação é a certa.
 */

export function classificarAura(pontos, faixas) {
  return faixas.find((faixa) => pontos >= faixa.minimo);
}
