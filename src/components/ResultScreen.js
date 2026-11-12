/**
 * TELA: Resultado
 * ---------------
 * Mostra a pontuação (com animação contando), a faixa de aura,
 * a mensagem e um medidor de -75 a +75.
 */

import { el, prefereMenosAnimacao } from './dom.js';
import { gerarImagemResultado } from './imagemResultado.js';

const DURACAO_CONTAGEM_MS = 1400;

const comSinal = (numero) => (numero > 0 ? `+${numero}` : String(numero));

export function ResultScreen({ nome, pontos, faixa, limites, aoJogarDeNovo }) {
  const numero = el('span', { class: 'resultado__pontos', 'aria-hidden': 'true' }, '0');

  // Posição do marcador no medidor (0% = aura mínima, 100% = máxima)
  const posicao = ((pontos - limites.minimo) / (limites.maximo - limites.minimo)) * 100;

  const avisoCompartilhar = el('p', { class: 'texto-suave texto-pequeno centro', role: 'status' });

  // A imagem já começa a ser feita AGORA, antes do toque no botão.
  // Motivo: o iPhone só abre a janela de compartilhar se ela for chamada
  // logo em seguida ao toque, sem esperas no meio.
  let imagemPronta = null;
  const imagem = gerarImagemResultado({ nome, pontos, faixa, limites })
    .then((arquivo) => (imagemPronta = arquivo))
    .catch(() => null);

  const elemento = el(
    'section',
    { class: 'tela pilha', style: { '--cor-faixa': faixa.cor } },
    el(
      'div',
      { class: 'card card--resultado pilha centro' },
      el('p', { class: 'texto-suave', tabindex: '-1', 'data-foco': true }, `${nome}, sua aura é…`),
      el('span', { class: 'sr-only' }, `${comSinal(pontos)} pontos.`),
      numero,
      el(
        'div',
        { class: 'pilha pilha--curta' },
        el('span', { class: 'resultado__emoji', 'aria-hidden': 'true' }, faixa.emoji),
        el('h2', { class: 'resultado__titulo' }, faixa.titulo),
        el('p', { class: 'resultado__mensagem' }, faixa.mensagem),
      ),
      el(
        'div',
        { class: 'medidor', 'aria-hidden': 'true' },
        el('div', { class: 'medidor__trilho' }, el('div', { class: 'medidor__marcador', style: { left: `${posicao}%` } })),
        el(
          'div',
          { class: 'medidor__legenda' },
          el('span', {}, comSinal(limites.minimo)),
          el('span', {}, '0'),
          el('span', {}, comSinal(limites.maximo)),
        ),
      ),
    ),
    el(
      'div',
      { class: 'acoes' },
      el('button', { type: 'button', class: 'btn btn--lg', onclick: aoJogarDeNovo }, 'Jogar de novo'),
      el(
        'button',
        {
          type: 'button',
          class: 'btn btn--outline btn--lg',
          onclick: async () => compartilhar(nome, pontos, faixa, imagemPronta ?? (await imagem), avisoCompartilhar),
        },
        'Compartilhar',
      ),
    ),
    avisoCompartilhar,
  );

  const pararContagem = animarContagem(numero, pontos);

  return { elemento, destruir: pararContagem };
}

/** Faz o número "correr" de 0 até a pontuação final. */
function animarContagem(alvo, pontosFinais) {
  if (prefereMenosAnimacao()) {
    alvo.textContent = comSinal(pontosFinais);
    return () => {};
  }

  let quadro;
  const inicio = performance.now();

  const passo = (agora) => {
    const progresso = Math.min((agora - inicio) / DURACAO_CONTAGEM_MS, 1);
    const suavizado = 1 - (1 - progresso) ** 3; // começa rápido e freia no final
    alvo.textContent = comSinal(Math.round(pontosFinais * suavizado));
    if (progresso < 1) quadro = requestAnimationFrame(passo);
  };
  quadro = requestAnimationFrame(passo);

  // Garantia: se a animação não rodar (aba em segundo plano, por exemplo),
  // o número final aparece mesmo assim.
  const garantia = setTimeout(() => {
    alvo.textContent = comSinal(pontosFinais);
  }, DURACAO_CONTAGEM_MS + 100);

  return () => {
    cancelAnimationFrame(quadro);
    clearTimeout(garantia);
  };
}

/**
 * Compartilha a IMAGEM do resultado pela janela nativa do aparelho
 * (celular ou computador). Se o aparelho não tiver essa janela,
 * a imagem é baixada para a pessoa postar onde quiser.
 */
async function compartilhar(nome, pontos, faixa, arquivo, aviso) {
  aviso.textContent = '';
  const url = window.location.href.split('#')[0];
  // O link vai dentro do texto: alguns sistemas trocam a imagem pelo link quando ele vai separado.
  const texto = `${faixa.emoji} ${nome} tirou ${comSinal(pontos)} no Aura Quiz: ${faixa.titulo}! Descubra a sua: ${url}`;

  // Plano B: se a imagem falhou, compartilha só o texto com o link (como antes)
  if (!arquivo) return compartilharTexto(texto, aviso);

  const podeEnviarImagem = navigator.canShare?.({ files: [arquivo] }) ?? false;
  if (!podeEnviarImagem) return baixarImagem(arquivo, aviso);

  try {
    await navigator.share({ files: [arquivo], title: 'Aura Quiz', text: texto });
  } catch (erro) {
    if (erro?.name === 'AbortError') return; // a pessoa fechou a janela: tudo bem
    baixarImagem(arquivo, aviso);
  }
}

function baixarImagem(arquivo, aviso) {
  const endereco = URL.createObjectURL(arquivo);
  const link = el('a', { href: endereco, download: arquivo.name });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(endereco), 10_000);
  aviso.textContent = 'Imagem salva! Agora é só postar nos Stories ou mandar para os amigos 📸';
}

async function compartilharTexto(texto, aviso) {
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Aura Quiz', text: texto });
      return;
    }
    await navigator.clipboard.writeText(texto);
    aviso.textContent = 'Resultado copiado! É só colar onde quiser.';
  } catch (erro) {
    if (erro?.name !== 'AbortError') {
      aviso.textContent = 'Não deu para compartilhar daqui. Que tal um print? 📸';
    }
  }
}
