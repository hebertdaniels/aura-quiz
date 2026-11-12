/**
 * SERVICE WORKER (modo offline)
 * -----------------------------
 * Guarda os arquivos do app no celular depois do primeiro acesso.
 * Assim o quiz funciona mesmo se a internet da feira cair.
 *
 * IMPORTANTE: ao publicar uma versão nova, aumente o número da VERSAO
 * para os celulares baixarem os arquivos atualizados.
 */

const VERSAO = 'aura-quiz-v2';

const ARQUIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/brand/simbolo.png',
  './assets/icons/favicon-64.png',
  './assets/icons/icon-180.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './src/main.js',
  './src/styles/tokens.css',
  './src/styles/base.css',
  './src/styles/components.css',
  './src/core/entities/Pergunta.js',
  './src/core/entities/FaixaDeAura.js',
  './src/core/data/perguntas.js',
  './src/core/data/faixas.js',
  './src/core/usecases/calcularAura.js',
  './src/core/usecases/classificarAura.js',
  './src/state/QuizState.js',
  './src/components/dom.js',
  './src/components/SplashScreen.js',
  './src/components/NameInput.js',
  './src/components/QuestionCard.js',
  './src/components/ResultScreen.js',
  './src/components/imagemResultado.js',
  './src/components/ThemeToggle.js',
];

// 1. Instalação: guarda todos os arquivos
self.addEventListener('install', (evento) => {
  evento.waitUntil(caches.open(VERSAO).then((cache) => cache.addAll(ARQUIVOS)));
  self.skipWaiting();
});

// 2. Ativação: apaga versões antigas
self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nomes) => Promise.all(nomes.filter((nome) => nome !== VERSAO).map((nome) => caches.delete(nome))))
      .then(() => self.clients.claim()),
  );
});

// 3. Cada pedido: responde com a cópia guardada e atualiza em segundo plano
self.addEventListener('fetch', (evento) => {
  if (evento.request.method !== 'GET') return;

  evento.respondWith(
    caches.open(VERSAO).then(async (cache) => {
      const guardado = await cache.match(evento.request, { ignoreSearch: true });
      const daRede = fetch(evento.request)
        .then((resposta) => {
          if (resposta.ok) cache.put(evento.request, resposta.clone());
          return resposta;
        })
        .catch(() => guardado);
      return guardado ?? daRede;
    }),
  );
});
