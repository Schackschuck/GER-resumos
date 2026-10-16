// Funções pequenas usadas em vários lugares do site.

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Deixa um texto seguro para colocar dentro de HTML. */
export function escapar(texto) {
  return String(texto ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

/** Tira acentos e deixa minúsculo ("Função" → "funcao"). */
export function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

/** Transforma um título em identificador de link ("Função afim" → "funcao-afim"). */
export function slug(texto) {
  return normalizar(texto)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Gera um código curto e estável a partir de um texto. */
export function hash(texto) {
  let h = 5381;
  for (let i = 0; i < texto.length; i++) h = ((h << 5) + h + texto.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/** Cria um elemento a partir de um trecho de HTML. */
export function criar(html) {
  const modelo = document.createElement('template');
  modelo.innerHTML = html.trim();
  return modelo.content.firstElementChild;
}

/** Markdown → HTML (bloco). */
export function md(texto) {
  return window.marked.parse(texto ?? '');
}

/** Markdown → HTML (só uma linha, sem parágrafo). */
export function mdLinha(texto) {
  return window.marked.parseInline(texto ?? '');
}

/** Formata número no padrão brasileiro (1.5 → "1,5"). */
export function numero(valor) {
  return Number(valor).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
}

/** Erro usado quando uma página ou arquivo não existe. */
export class NaoEncontrado extends Error {}
