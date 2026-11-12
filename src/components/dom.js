/**
 * AJUDANTE: el()
 * --------------
 * Cria elementos HTML de um jeito curto e seguro.
 *
 *   el('button', { class: 'btn', onclick: fazerAlgo }, 'Clique aqui')
 *
 * Por segurança, textos SEMPRE entram como texto puro (nunca como HTML).
 * Assim, se alguém digitar um código esquisito no nome, nada quebra.
 */

export function el(tag, propriedades = {}, ...filhos) {
  const elemento = document.createElement(tag);

  for (const [chave, valor] of Object.entries(propriedades)) {
    if (valor === null || valor === undefined || valor === false) continue;

    if (chave === 'class') {
      elemento.className = valor;
    } else if (chave === 'style') {
      for (const [propriedade, valorCss] of Object.entries(valor)) {
        elemento.style.setProperty(propriedade, valorCss);
      }
    } else if (chave.startsWith('on') && typeof valor === 'function') {
      elemento.addEventListener(chave.slice(2).toLowerCase(), valor);
    } else {
      elemento.setAttribute(chave, valor === true ? '' : valor);
    }
  }

  for (const filho of filhos.flat()) {
    if (filho === null || filho === undefined || filho === false) continue;
    elemento.append(filho); // textos viram texto puro automaticamente
  }

  return elemento;
}

/** Retorna true se a pessoa pediu menos animação nas configurações do aparelho. */
export function prefereMenosAnimacao() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
