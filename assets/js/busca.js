// Busca em todos os resumos, na folha de fórmulas e nas páginas "Como é o ano".
// Tudo acontece no navegador: na primeira busca o site baixa os arquivos e procura neles.

import {
  obterIndice, carregarTexto, caminhoCapitulo, caminhoComoE, buscarAno, buscarMateria,
} from './conteudo.js';
import { atribuirIds, tipoBloco } from './markdown.js';
import { escapar, md } from './util.js';

const MAXIMO_RESULTADOS = 40;
const CAMPOS_BLOCO = /^\s*(tipo|t[oó]pico|pergunta|resposta|explica[cç][aã]o|crit[eé]rios|nome|f[oó]rmula|onde)\s*:\s?/gim;

let documentos = null;

function fontes() {
  const indice = obterIndice();
  const lista = indice.capitulos.map((cap) => {
    const ano = buscarAno(cap.ano);
    const encontrado = buscarMateria(cap.materia);
    return {
      caminho: caminhoCapitulo(cap),
      titulo: cap.titulo,
      onde: [encontrado?.materia.nome, ano?.nome].filter(Boolean).join(' · '),
      rota: `#/ano/${cap.ano}/${cap.materia}/${cap.id}`,
    };
  });
  lista.push({ caminho: 'conteudo/formulas.md', titulo: 'Folha de fórmulas', onde: 'Ferramentas', rota: '#/formulas' });
  for (const ano of indice.anos) {
    lista.push({
      caminho: caminhoComoE(ano.id),
      titulo: `Como é o ${ano.nome}`,
      onde: 'Como é o próximo ano',
      rota: `#/como-e/${ano.id}`,
    });
  }
  return lista;
}

/** Divide um arquivo em seções (uma por título) com o texto puro de cada uma. */
function extrairSecoes(texto, tituloDocumento) {
  const container = document.createElement('div');
  container.innerHTML = md(texto);
  if (container.firstElementChild?.tagName === 'H1') container.firstElementChild.remove();
  atribuirIds(container);

  for (const codigo of [...container.querySelectorAll('pre > code')]) {
    const tipo = tipoBloco(codigo);
    if (tipo === 'video' || tipo === 'preencher') codigo.parentElement.remove();
    else if (tipo) codigo.textContent = codigo.textContent.replace(CAMPOS_BLOCO, '');
  }

  const secoes = [{ id: '', titulo: tituloDocumento, partes: [] }];
  for (const filho of container.children) {
    if (filho.tagName === 'H2' || filho.tagName === 'H3') {
      secoes.push({ id: filho.id, titulo: filho.textContent.trim(), partes: [] });
    } else {
      secoes[secoes.length - 1].partes.push(filho.textContent);
    }
  }
  return secoes
    .map((s) => ({ id: s.id, titulo: s.titulo, texto: s.partes.join(' ').replace(/\s+/g, ' ').trim() }))
    .filter((s, i) => i === 0 || s.texto || s.id);
}

async function carregarDocumentos() {
  if (documentos) return documentos;
  const carregados = await Promise.all(
    fontes().map(async (fonte) => {
      try {
        const texto = await carregarTexto(fonte.caminho);
        return { ...fonte, secoes: extrairSecoes(texto, fonte.titulo) };
      } catch {
        return null; // arquivo que ainda não existe: só fica de fora da busca
      }
    })
  );
  documentos = carregados.filter(Boolean);
  return documentos;
}

/** Versão sem acentos e minúscula, com o mapa de cada letra para a posição original. */
function normalizarComMapa(texto) {
  let normal = '';
  const mapa = [];
  for (let i = 0; i < texto.length; i++) {
    const letra = texto[i].normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    for (const parte of letra) {
      normal += parte;
      mapa.push(i);
    }
  }
  mapa.push(texto.length);
  return { normal, mapa };
}

function termosDe(consulta) {
  const { normal } = normalizarComMapa(consulta);
  return [...new Set(normal.split(/[^a-z0-9]+/).filter((t) => t.length >= 2))];
}

function contar(texto, termo) {
  let total = 0;
  for (let i = texto.indexOf(termo); i !== -1; i = texto.indexOf(termo, i + termo.length)) total++;
  return total;
}

/** Marca os termos encontrados com <mark>, escapando o resto do texto. */
export function destacar(texto, termos) {
  const { normal, mapa } = normalizarComMapa(texto);
  const trechos = [];
  for (const termo of termos) {
    for (let i = normal.indexOf(termo); i !== -1; i = normal.indexOf(termo, i + termo.length)) {
      trechos.push([mapa[i], mapa[i + termo.length - 1] + 1]);
    }
  }
  trechos.sort((a, b) => a[0] - b[0]);
  let html = '';
  let posicao = 0;
  for (const [inicio, fim] of trechos) {
    if (inicio < posicao) continue;
    html += escapar(texto.slice(posicao, inicio)) + `<mark>${escapar(texto.slice(inicio, fim))}</mark>`;
    posicao = fim;
  }
  return html + escapar(texto.slice(posicao));
}

function trecho(texto, termos) {
  const { normal, mapa } = normalizarComMapa(texto);
  const posicoes = termos.map((t) => normal.indexOf(t)).filter((p) => p >= 0);
  const primeira = posicoes.length ? mapa[Math.min(...posicoes)] : 0;
  let inicio = Math.max(0, primeira - 60);
  let fim = Math.min(texto.length, primeira + 180);
  if (inicio > 0) inicio = texto.indexOf(' ', inicio) + 1 || inicio;
  if (fim < texto.length) fim = texto.lastIndexOf(' ', fim) > inicio ? texto.lastIndexOf(' ', fim) : fim;
  return (inicio > 0 ? '…' : '') + texto.slice(inicio, fim) + (fim < texto.length ? '…' : '');
}

export async function buscar(consulta) {
  const termos = termosDe(consulta);
  if (!termos.length) return { termos, resultados: [] };
  const docs = await carregarDocumentos();
  const resultados = [];

  for (const doc of docs) {
    const tituloDoc = normalizarComMapa(doc.titulo).normal;
    for (const [posicaoSecao, secao] of doc.secoes.entries()) {
      const tituloSecao = normalizarComMapa(secao.titulo).normal;
      const corpo = normalizarComMapa(secao.texto).normal;
      let pontos = 0;
      let todos = true;
      for (const termo of termos) {
        const noCorpo = contar(corpo, termo);
        const naSecao = tituloSecao.includes(termo);
        // O título do documento só conta na primeira seção, para não repetir o documento inteiro.
        const noDoc = posicaoSecao === 0 && tituloDoc.includes(termo);
        if (!noCorpo && !naSecao && !noDoc) {
          todos = false;
          break;
        }
        pontos += Math.min(noCorpo, 10) + (naSecao ? 8 : 0) + (noDoc ? 4 : 0);
      }
      if (!todos) continue;
      resultados.push({
        pontos,
        onde: doc.onde,
        documento: doc.titulo,
        titulo: secao.titulo,
        rota: secao.id ? `${doc.rota}/${secao.id}` : doc.rota,
        trecho: secao.texto ? trecho(secao.texto, termos) : '',
      });
    }
  }

  resultados.sort((a, b) => b.pontos - a.pontos);
  return { termos, resultados: resultados.slice(0, MAXIMO_RESULTADOS) };
}
