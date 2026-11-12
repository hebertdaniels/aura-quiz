/**
 * AJUDANTE: Imagem do resultado (para compartilhar)
 * -------------------------------------------------
 * Desenha o resultado do quiz numa imagem vertical 1080×1920,
 * no formato dos Stories do Instagram, Status do WhatsApp e TikTok.
 *
 * A imagem é desenhada aqui mesmo, num <canvas>, com as cores da marca.
 * Não precisa de internet nem de biblioteca de "print de tela".
 *
 * Os ~250px de cima e de baixo ficam livres, porque os apps de Stories
 * colocam botões por cima dessas áreas.
 */

const LARGURA = 1080;
const ALTURA = 1920;

const COR = {
  fundo: '#0f0e17',
  card: '#1e1b29',
  texto: '#ffffff',
  suave: '#a9a3bd',
  roxo: '#8b5cf6',
  rosa: '#ec4899',
  azul: '#06b6d4',
};

// Mesmas cores da régua do resultado (de aura negativa até lendária)
const CORES_MEDIDOR = ['#b91c1c', '#f97316', '#a1a1aa', '#8b5cf6', '#22c55e', '#f59e0b'];

const comSinal = (numero) => (numero > 0 ? `+${numero}` : String(numero));

/** Endereço do app sem "https://" e sem barra no final. Ex.: meupeixe.com.br */
export function enderecoDoApp() {
  const caminho = window.location.pathname.replace(/index\.html$/, '').replace(/\/$/, '');
  return `${window.location.host.replace(/^www\./, '')}${caminho}`;
}

/**
 * Gera a imagem do resultado.
 * @returns {Promise<File>} arquivo PNG pronto para compartilhar ou baixar
 */
export async function gerarImagemResultado({ nome, pontos, faixa, limites }) {
  const canvas = document.createElement('canvas');
  canvas.width = LARGURA;
  canvas.height = ALTURA;
  const ctx = canvas.getContext('2d');
  const fonte = getComputedStyle(document.body).fontFamily;
  const f = (peso, tamanho) => `${peso} ${tamanho}px ${fonte}`;

  const simbolo = await carregarImagem('assets/brand/simbolo.png');

  // ---------- 1. Medir tudo para centralizar na altura ----------
  const larguraCard = 900;
  const xCard = (LARGURA - larguraCard) / 2;
  const larguraTexto = larguraCard - 140;

  ctx.font = f(400, 40);
  const linhasMensagem = quebrarTexto(ctx, faixa.mensagem, larguraTexto).slice(0, 5);

  const alturaSimbolo = 180;
  const larguraSimbolo = (simbolo.width / simbolo.height) * alturaSimbolo;
  // topo do card até a 1ª linha da mensagem (623) + linhas + régua e legenda (150)
  const alturaCard = 623 + linhasMensagem.length * 56 + 150;
  const alturaTotal = alturaSimbolo + 150 + alturaCard + 180;
  let y = Math.max(180, (ALTURA - alturaTotal) / 2);

  // ---------- 2. Fundo com brilhos de aura ----------
  ctx.fillStyle = COR.fundo;
  ctx.fillRect(0, 0, LARGURA, ALTURA);
  brilho(ctx, LARGURA / 2, 0, 1100, faixa.cor, 0.35);
  brilho(ctx, LARGURA, ALTURA, 900, COR.rosa, 0.22);
  brilho(ctx, 0, ALTURA * 0.85, 800, COR.azul, 0.18);

  // ---------- 3. Logotipo: símbolo ∞ + "Aura Quiz" ----------
  ctx.save();
  ctx.shadowColor = comAlfa(COR.rosa, 0.7);
  ctx.shadowBlur = 60;
  ctx.drawImage(simbolo, (LARGURA - larguraSimbolo) / 2, y, larguraSimbolo, alturaSimbolo);
  ctx.restore();
  y += alturaSimbolo + 100;

  ctx.font = f(900, 92);
  ctx.textBaseline = 'alphabetic';
  const larguraAura = ctx.measureText('Aura ').width;
  const larguraQuiz = ctx.measureText('Quiz').width;
  const xMarca = (LARGURA - larguraAura - larguraQuiz) / 2;
  ctx.textAlign = 'left';
  ctx.fillStyle = COR.texto;
  ctx.fillText('Aura ', xMarca, y);
  ctx.fillStyle = COR.rosa;
  ctx.fillText('Quiz', xMarca + larguraAura, y);
  y += 50;

  // ---------- 4. Card do resultado ----------
  ctx.save();
  ctx.shadowColor = comAlfa(faixa.cor, 0.55);
  ctx.shadowBlur = 90;
  retanguloArredondado(ctx, xCard, y, larguraCard, alturaCard, 48);
  ctx.fillStyle = COR.card;
  ctx.fill();
  ctx.restore();
  retanguloArredondado(ctx, xCard, y, larguraCard, alturaCard, 48);
  ctx.lineWidth = 3;
  ctx.strokeStyle = comAlfa(faixa.cor, 0.6);
  ctx.stroke();

  const centro = LARGURA / 2;
  ctx.textAlign = 'center';
  let yCard = y + 110;

  ctx.font = f(500, 44);
  ctx.fillStyle = COR.suave;
  ctx.fillText(`${nome}, sua aura é…`, centro, yCard, larguraTexto);
  yCard += 210;

  ctx.save();
  ctx.font = f(900, 190);
  ctx.fillStyle = faixa.cor;
  ctx.shadowColor = comAlfa(faixa.cor, 0.6);
  ctx.shadowBlur = 40;
  ctx.fillText(comSinal(pontos), centro, yCard);
  ctx.restore();
  yCard += 130;

  ctx.font = f(400, 96);
  ctx.fillText(faixa.emoji, centro, yCard);
  yCard += 105;

  ctx.font = f(800, 66);
  ctx.fillStyle = COR.texto;
  ctx.fillText(faixa.titulo, centro, yCard, larguraTexto);
  yCard += 68;

  ctx.font = f(400, 40);
  ctx.fillStyle = COR.suave;
  for (const linha of linhasMensagem) {
    ctx.fillText(linha, centro, yCard);
    yCard += 56;
  }
  yCard += 30;

  // Régua de -75 a +75 com o marcador na pontuação
  const xTrilho = xCard + 70;
  const larguraTrilho = larguraCard - 140;
  const gradiente = ctx.createLinearGradient(xTrilho, 0, xTrilho + larguraTrilho, 0);
  CORES_MEDIDOR.forEach((cor, i) => gradiente.addColorStop(i / (CORES_MEDIDOR.length - 1), cor));
  retanguloArredondado(ctx, xTrilho, yCard, larguraTrilho, 16, 8);
  ctx.fillStyle = gradiente;
  ctx.fill();

  const posicao = (pontos - limites.minimo) / (limites.maximo - limites.minimo);
  ctx.beginPath();
  ctx.arc(xTrilho + larguraTrilho * posicao, yCard + 8, 22, 0, Math.PI * 2);
  ctx.fillStyle = faixa.cor;
  ctx.fill();
  ctx.lineWidth = 7;
  ctx.strokeStyle = COR.card;
  ctx.stroke();

  ctx.font = f(500, 30);
  ctx.fillStyle = COR.suave;
  ctx.textAlign = 'left';
  ctx.fillText(comSinal(limites.minimo), xTrilho, yCard + 70);
  ctx.textAlign = 'center';
  ctx.fillText('0', xTrilho + larguraTrilho / 2, yCard + 70);
  ctx.textAlign = 'right';
  ctx.fillText(comSinal(limites.maximo), xTrilho + larguraTrilho, yCard + 70);

  y += alturaCard + 100;

  // ---------- 5. Rodapé: convite + endereço do app ----------
  ctx.textAlign = 'center';
  ctx.font = f(500, 40);
  ctx.fillStyle = COR.texto;
  ctx.fillText('Descubra a sua aura em', centro, y);
  y += 70;
  ctx.font = f(800, 52);
  ctx.fillStyle = COR.rosa;
  ctx.fillText(enderecoDoApp(), centro, y, larguraCard);

  // ---------- 6. Vira um arquivo PNG ----------
  const blob = await new Promise((resolver, rejeitar) =>
    canvas.toBlob((b) => (b ? resolver(b) : rejeitar(new Error('Falha ao gerar a imagem'))), 'image/png'),
  );
  return new File([blob], `aura-quiz-${nomeDeArquivo(nome)}.png`, { type: 'image/png' });
}

// ================= Funções de apoio =================

function carregarImagem(src) {
  return new Promise((resolver, rejeitar) => {
    const imagem = new Image();
    imagem.onload = () => resolver(imagem);
    imagem.onerror = rejeitar;
    imagem.src = src;
  });
}

/** Mancha de luz redonda, que vai sumindo nas bordas. */
function brilho(ctx, x, y, raio, cor, forca) {
  const gradiente = ctx.createRadialGradient(x, y, 0, x, y, raio);
  gradiente.addColorStop(0, comAlfa(cor, forca));
  gradiente.addColorStop(1, comAlfa(cor, 0));
  ctx.fillStyle = gradiente;
  ctx.fillRect(0, 0, LARGURA, ALTURA);
}

/** Converte "#8b5cf6" + 0.5 em "rgb(139 92 246 / 0.5)". */
function comAlfa(hex, alfa) {
  const valor = Number.parseInt(hex.replace('#', ''), 16);
  return `rgb(${(valor >> 16) & 255} ${(valor >> 8) & 255} ${valor & 255} / ${alfa})`;
}

function retanguloArredondado(ctx, x, y, largura, altura, raio) {
  ctx.beginPath();
  ctx.moveTo(x + raio, y);
  ctx.arcTo(x + largura, y, x + largura, y + altura, raio);
  ctx.arcTo(x + largura, y + altura, x, y + altura, raio);
  ctx.arcTo(x, y + altura, x, y, raio);
  ctx.arcTo(x, y, x + largura, y, raio);
  ctx.closePath();
}

/** Quebra um texto em linhas que cabem na largura. */
function quebrarTexto(ctx, texto, larguraMaxima) {
  const linhas = [];
  let linha = '';
  for (const palavra of texto.split(/\s+/)) {
    const teste = linha ? `${linha} ${palavra}` : palavra;
    if (linha && ctx.measureText(teste).width > larguraMaxima) {
      linhas.push(linha);
      linha = palavra;
    } else {
      linha = teste;
    }
  }
  if (linha) linhas.push(linha);
  return linhas;
}

/** "João Pedro!" → "joao-pedro" */
function nomeDeArquivo(nome) {
  const limpo = nome
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return limpo || 'resultado';
}
