// Service worker: guarda o site no aparelho para funcionar sem internet.
// Estratégia "rede primeiro": com internet, sempre pega a versão mais nova;
// sem internet (ou se a rede demorar demais), usa a cópia salva.
//
// Ao mudar a lista ARQUIVOS_BASE, aumente o número da VERSAO.

const VERSAO = 'ger-resumos-v1';
const TEMPO_MAXIMO_REDE = 4000; // ms; depois disso usa a cópia salva, se existir

const ARQUIVOS_BASE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/tema.css',
  './assets/css/estilo.css',
  './assets/js/app.js',
  './assets/js/busca.js',
  './assets/js/conteudo.js',
  './assets/js/historico.js',
  './assets/js/markdown.js',
  './assets/js/questoes.js',
  './assets/js/util.js',
  './assets/vendor/marked.umd.js',
  './assets/img/logo.svg',
  './assets/img/icone-192.png',
  './assets/img/icone-512.png',
  './conteudo/indice.json',
  './conteudo/formulas.md',
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(VERSAO).then((cache) => cache.addAll(ARQUIVOS_BASE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nomes) => Promise.all(nomes.filter((n) => n !== VERSAO).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// O site manda a lista de resumos; guardamos os que ainda não estão salvos.
self.addEventListener('message', (evento) => {
  if (evento.data?.tipo === 'guardar' && Array.isArray(evento.data.arquivos)) {
    evento.waitUntil(guardar(evento.data.arquivos));
  }
});

async function guardar(arquivos) {
  const cache = await caches.open(VERSAO);
  await Promise.all(
    arquivos.map(async (arquivo) => {
      try {
        if (await cache.match(arquivo)) return;
        const resposta = await fetch(arquivo);
        if (resposta.ok) await cache.put(arquivo, resposta);
      } catch {
        // sem internet agora: tenta de novo na próxima visita
      }
    })
  );
}

self.addEventListener('fetch', (evento) => {
  const pedido = evento.request;
  if (pedido.method !== 'GET') return;
  if (new URL(pedido.url).origin !== self.location.origin) return; // YouTube etc. ficam de fora
  evento.respondWith(redePrimeiro(evento));
});

async function redePrimeiro(evento) {
  const pedido = evento.request;
  const cache = await caches.open(VERSAO);
  const salvo = await cache.match(pedido, { ignoreSearch: true });

  let gravacao = Promise.resolve();
  const daRede = fetch(pedido).then((resposta) => {
    if (resposta.ok) gravacao = cache.put(pedido, resposta.clone());
    return resposta;
  });
  // Mantém o service worker vivo até terminar de salvar a cópia nova.
  evento.waitUntil(daRede.then(() => gravacao).catch(() => {}));

  try {
    if (salvo) {
      const limite = new Promise((resolver) => setTimeout(() => resolver(salvo), TEMPO_MAXIMO_REDE));
      return await Promise.race([daRede, limite]);
    }
    return await daRede;
  } catch {
    if (salvo) return salvo;
    if (pedido.mode === 'navigate') {
      const pagina = (await cache.match('./index.html')) || (await cache.match('./'));
      if (pagina) return pagina;
    }
    return Response.error();
  }
}
