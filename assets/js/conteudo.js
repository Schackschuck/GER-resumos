// Carrega o índice (conteudo/indice.json) e os arquivos Markdown.

import { NaoEncontrado } from './util.js';

let indice = null;
const textos = new Map();

export async function carregarIndice() {
  if (indice) return indice;
  let resposta;
  try {
    resposta = await fetch('conteudo/indice.json');
  } catch {
    throw new Error('Não foi possível carregar o conteúdo. Confira sua conexão com a internet.');
  }
  if (!resposta.ok) throw new Error('Não foi possível carregar conteudo/indice.json.');
  try {
    indice = await resposta.json();
  } catch (erro) {
    throw new Error(
      `O arquivo conteudo/indice.json tem um erro de formatação (${erro.message}). ` +
        'Confira vírgulas, aspas e chaves.'
    );
  }
  return indice;
}

export function obterIndice() {
  return indice;
}

/** Busca um arquivo de texto (com cache em memória). */
export async function carregarTexto(caminho) {
  if (!textos.has(caminho)) {
    textos.set(
      caminho,
      fetch(caminho).then((resposta) => {
        if (!resposta.ok) throw new NaoEncontrado(`Arquivo não encontrado: ${caminho}`);
        return resposta.text();
      })
    );
  }
  try {
    return await textos.get(caminho);
  } catch (erro) {
    textos.delete(caminho);
    if (erro instanceof NaoEncontrado) throw erro;
    throw new Error(`Não foi possível carregar ${caminho}. Confira sua conexão com a internet.`);
  }
}

export function caminhoCapitulo(capitulo) {
  return `conteudo/${capitulo.ano}ano/${capitulo.materia}/${capitulo.id}.md`;
}

export function caminhoComoE(idAno) {
  return `conteudo/como-e/${idAno}ano.md`;
}

export function buscarAno(id) {
  return indice.anos.find((ano) => ano.id === id) ?? null;
}

/** Devolve { materia, area } ou null. */
export function buscarMateria(id) {
  for (const area of indice.areas) {
    const materia = area.materias.find((m) => m.id === id);
    if (materia) return { materia, area };
  }
  return null;
}

export function capitulosDe(idAno, idMateria) {
  return indice.capitulos.filter(
    (cap) => cap.ano === idAno && (idMateria === undefined || cap.materia === idMateria)
  );
}

export function buscarCapitulo(idAno, idMateria, id) {
  return capitulosDe(idAno, idMateria).find((cap) => cap.id === id) ?? null;
}
