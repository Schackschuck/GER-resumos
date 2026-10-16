// Transforma os arquivos Markdown em HTML e troca os blocos especiais
// (```questao, ```video, ```pontos-chave, ```formula, ```dica, ```atencao, ```preencher)
// pelos componentes do site. O formato está explicado em CONTRIBUINDO.md.

import { escapar, normalizar, slug, criar, md, mdLinha } from './util.js';
import { criarQuestao } from './questoes.js';

const CAMPOS = new Set([
  'tipo', 'topico', 'pergunta', 'resposta', 'explicacao', 'criterios',
  'titulo', 'link', 'nome', 'formula', 'onde',
]);

const BLOCOS = new Set(['questao', 'video', 'pontos-chave', 'formula', 'dica', 'atencao', 'preencher']);

const CAIXAS = {
  dica: '💡 Dica',
  atencao: '⚠️ Atenção',
  preencher: '✏️ A preencher pelo grêmio',
};

/**
 * Lê um bloco no formato "campo: valor".
 * Linhas "a) ..." viram alternativas; linhas sem campo continuam o campo anterior.
 */
export function lerCampos(texto) {
  const campos = {};
  const alternativas = [];
  let alvo = null;
  for (const linha of texto.replace(/\r/g, '').split('\n')) {
    const alternativa = linha.match(/^\s*([a-e])\)\s?(.*)$/i);
    const campo = linha.match(/^\s*([a-zà-ÿ]+)\s*:\s?(.*)$/i);
    if (alternativa) {
      alvo = { letra: alternativa[1].toLowerCase(), texto: alternativa[2] };
      alternativas.push(alvo);
    } else if (campo && CAMPOS.has(normalizar(campo[1]))) {
      alvo = { texto: campo[2] };
      campos[normalizar(campo[1])] = alvo;
    } else if (alvo) {
      alvo.texto += '\n' + linha;
    }
  }
  const valores = {};
  for (const [chave, valor] of Object.entries(campos)) valores[chave] = valor.texto.trim();
  return {
    campos: valores,
    alternativas: alternativas.map((a) => ({ letra: a.letra, texto: a.texto.trim() })),
  };
}

/** Dá um id para cada título (h2/h3) e devolve a lista de títulos. */
export function atribuirIds(container) {
  const usados = new Set();
  const titulos = [];
  for (const titulo of container.querySelectorAll('h2, h3')) {
    const base = slug(titulo.textContent) || 'secao';
    let id = base;
    for (let n = 2; usados.has(id); n++) id = `${base}-${n}`;
    usados.add(id);
    titulo.id = id;
    titulos.push({ id, texto: titulo.textContent.trim(), nivel: Number(titulo.tagName[1]) });
  }
  return titulos;
}

/** Diz qual bloco especial é um ```bloco (ou null se for código comum). */
export function tipoBloco(codigo) {
  const classe = [...codigo.classList].find((c) => c.startsWith('language-'));
  if (!classe) return null;
  const tipo = normalizar(classe.slice('language-'.length));
  return BLOCOS.has(tipo) ? tipo : null;
}

/** Converte Markdown em HTML para uma página (capítulo, fórmulas, "como é"). */
export function renderizarMarkdown(texto, contexto = {}) {
  const conteudo = document.createElement('div');
  conteudo.className = 'markdown';
  conteudo.innerHTML = md(texto);

  // O título do capítulo vem do indice.json; um "# Título" no arquivo seria repetido.
  if (conteudo.firstElementChild?.tagName === 'H1') conteudo.firstElementChild.remove();

  const titulos = atribuirIds(conteudo);
  const mapaTitulos = new Map(titulos.map((t) => [t.id, t]));
  const idsQuestoes = new Set();
  let pontosChave = null;
  let numeroQuestao = 0;

  for (const codigo of [...conteudo.querySelectorAll('pre > code')]) {
    const tipo = tipoBloco(codigo);
    if (!tipo) continue;
    const bloco = codigo.parentElement;
    const bruto = codigo.textContent;
    let novo = null;

    if (tipo === 'questao') {
      numeroQuestao++;
      novo = criarQuestao(lerCampos(bruto), { ...contexto, numero: numeroQuestao, mapaTitulos });
      if (novo.dataset.id) idsQuestoes.add(novo.dataset.id);
    } else if (tipo === 'video') {
      novo = criarVideo(lerCampos(bruto).campos);
    } else if (tipo === 'formula') {
      novo = criarFormula(lerCampos(bruto).campos);
    } else if (tipo === 'pontos-chave') {
      pontosChave = criar(`<div class="pontos-chave"><h2>Pontos-chave</h2>${md(bruto)}</div>`);
    } else {
      novo = criar(
        `<aside class="caixa caixa-${tipo}"><p class="caixa-rotulo">${CAIXAS[tipo]}</p>${md(bruto)}</aside>`
      );
    }

    if (novo) bloco.replaceWith(novo);
    else bloco.remove();
  }

  for (const link of conteudo.querySelectorAll('a[href^="http"]')) {
    link.target = '_blank';
    link.rel = 'noopener';
  }
  for (const tabela of conteudo.querySelectorAll('table')) {
    const rolagem = document.createElement('div');
    rolagem.className = 'tabela';
    tabela.replaceWith(rolagem);
    rolagem.append(tabela);
  }

  return { conteudo, titulos, pontosChave, idsQuestoes, totalQuestoes: numeroQuestao };
}

function idYoutube(link) {
  const achado = String(link ?? '').match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
  );
  return achado ? achado[1] : null;
}

function inicioYoutube(link) {
  const achado = String(link ?? '').match(/[?&](?:t|start)=(?:(\d+)m)?(\d+)s?/);
  if (!achado) return 0;
  return Number(achado[1] ?? 0) * 60 + Number(achado[2]);
}

function criarVideo({ link = '', titulo = '' }) {
  const id = idYoutube(link);
  if (id) {
    const inicio = inicioYoutube(link);
    const src = `https://www.youtube-nocookie.com/embed/${id}${inicio ? `?start=${inicio}` : ''}`;
    return criar(`
      <figure class="video">
        <div class="video-quadro">
          <iframe src="${src}" title="${escapar(titulo || 'Vídeo')}" loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
        ${titulo ? `<figcaption>${mdLinha(titulo)}</figcaption>` : ''}
      </figure>`);
  }
  if (/^https?:\/\//.test(link)) {
    return criar(`
      <p class="video-link">
        <a href="${escapar(link)}" target="_blank" rel="noopener">▶ Assistir: ${titulo ? mdLinha(titulo) : escapar(link)}</a>
      </p>`);
  }
  return criar(`
    <div class="video video-vazio" role="note">
      <span class="video-vazio-icone" aria-hidden="true">▶</span>
      <div>
        <p class="video-vazio-rotulo">Vídeo a ser indicado</p>
        ${titulo ? `<p>${mdLinha(titulo)}</p>` : ''}
      </div>
    </div>`);
}

function criarFormula({ nome = '', formula = '', onde = '' }) {
  return criar(`
    <div class="formula">
      ${nome ? `<p class="formula-nome">${mdLinha(nome)}</p>` : ''}
      <p class="formula-expressao">${mdLinha(formula)}</p>
      ${onde ? `<div class="formula-onde">${md(onde)}</div>` : ''}
    </div>`);
}
