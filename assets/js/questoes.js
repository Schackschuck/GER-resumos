// Questões objetivas (clica e vê se acertou) e dissertativas
// (escreve, compara com a resposta esperada e pode pedir correção para uma IA).

import { escapar, normalizar, slug, hash, criar, md, mdLinha } from './util.js';
import * as historico from './historico.js';

const IAS = [
  { nome: 'ChatGPT', url: 'https://chatgpt.com/' },
  { nome: 'Gemini', url: 'https://gemini.google.com/app' },
  { nome: 'Claude', url: 'https://claude.ai/new' },
];

export function criarQuestao({ campos, alternativas }, contexto) {
  const { numero } = contexto;
  if (!campos.pergunta) {
    return caixaErro(`A questão ${numero} está sem o campo <code>pergunta:</code>.`);
  }

  const tipo = normalizar(campos.tipo || (alternativas.length ? 'objetiva' : 'dissertativa'));
  const topico = campos.topico || '';
  const topicoId = slug(topico);
  const temSecao = Boolean(topicoId && contexto.mapaTitulos?.has(topicoId));
  const id = contexto.capitulo
    ? `${contexto.ano.id}/${contexto.materia.id}/${contexto.capitulo.id}/${hash(campos.pergunta)}`
    : '';

  const info = {
    numero,
    campos,
    contexto,
    id,
    linkTopico: topico
      ? temSecao
        ? `<a href="${contexto.rotaBase}/${topicoId}">${escapar(topico)}</a>`
        : escapar(topico)
      : '',
    registro: {
      ano: contexto.ano?.id,
      materia: contexto.materia?.id,
      capitulo: contexto.capitulo?.id,
      capituloTitulo: contexto.capitulo?.titulo,
      topico,
      topicoId: temSecao ? topicoId : '',
    },
  };

  const elemento = criar(`
    <section class="questao" aria-label="Questão ${numero}">
      <div class="questao-cabecalho">
        <span class="questao-numero">Questão ${numero}</span>
        <span class="questao-tipo">${tipo === 'objetiva' ? 'Objetiva' : 'Dissertativa'}</span>
        ${topico ? `<span class="questao-topico">Tópico: ${info.linkTopico}</span>` : ''}
      </div>
      <div class="questao-enunciado">${md(campos.pergunta)}</div>
    </section>`);
  if (id) elemento.dataset.id = id;

  if (tipo === 'objetiva') return montarObjetiva(elemento, alternativas, info);
  return montarDissertativa(elemento, info);
}

function caixaErro(mensagem) {
  return criar(`<div class="caixa caixa-erro" role="alert"><p class="caixa-rotulo">Erro no arquivo</p><p>${mensagem}</p></div>`);
}

function textoRevisar(info) {
  return info.linkTopico ? `<p class="questao-revisar">Revise o tópico: ${info.linkTopico}</p>` : '';
}

// ---------- Objetiva ----------

function montarObjetiva(elemento, alternativas, info) {
  const { campos, numero } = info;
  const correta = (campos.resposta || '').match(/\b([a-e])\b/i)?.[1].toLowerCase();
  if (!alternativas.length || !alternativas.some((a) => a.letra === correta)) {
    return caixaErro(
      `A questão ${numero} precisa de alternativas (<code>a)</code>, <code>b)</code>…) e de ` +
        '<code>resposta:</code> com a letra certa (exemplo: <code>resposta: b</code>).'
    );
  }

  elemento.insertAdjacentHTML(
    'beforeend',
    `<ol class="alternativas">
      ${alternativas
        .map(
          (a) => `
        <li><button type="button" class="alternativa" data-letra="${a.letra}">
          <span class="alternativa-letra" aria-hidden="true">${a.letra.toUpperCase()}</span>
          <span class="alternativa-texto"><span class="sr-only">Alternativa ${a.letra.toUpperCase()}: </span>${mdLinha(a.texto)}</span>
        </button></li>`
        )
        .join('')}
    </ol>
    <div class="questao-retorno" aria-live="polite"></div>`
  );

  const botoes = [...elemento.querySelectorAll('.alternativa')];
  const retorno = elemento.querySelector('.questao-retorno');

  function mostrar(escolha, gravar) {
    const acertou = escolha === correta;
    for (const botao of botoes) {
      botao.disabled = true;
      botao.classList.toggle('correta', botao.dataset.letra === correta);
      botao.classList.toggle('errada', !acertou && botao.dataset.letra === escolha);
      botao.classList.toggle('escolhida', botao.dataset.letra === escolha);
    }
    retorno.innerHTML = `
      <div class="resultado ${acertou ? 'resultado-certo' : 'resultado-errado'}">
        <p class="resultado-titulo">${
          acertou
            ? 'Acertou!'
            : `Não foi dessa vez. A resposta certa é a letra ${correta.toUpperCase()}.`
        }</p>
        ${campos.explicacao ? `<div class="resultado-explicacao">${md(campos.explicacao)}</div>` : ''}
        ${acertou ? '' : textoRevisar(info)}
      </div>
      <button type="button" class="botao botao-discreto" data-acao="refazer">Tentar de novo</button>`;
    if (gravar && info.id) {
      historico.registrar(info.id, { ...info.registro, pontos: acertou ? 1 : 0, escolha });
    }
  }

  elemento.addEventListener('click', (evento) => {
    const alternativa = evento.target.closest('.alternativa');
    if (alternativa && !alternativa.disabled) {
      mostrar(alternativa.dataset.letra, true);
      // O botão clicado fica desativado; o foco vai para "Tentar de novo" para não se perder.
      retorno.querySelector('[data-acao="refazer"]').focus({ preventScroll: true });
      return;
    }
    if (evento.target.closest('[data-acao="refazer"]')) {
      for (const botao of botoes) {
        botao.disabled = false;
        botao.classList.remove('correta', 'errada', 'escolhida');
      }
      retorno.innerHTML = '';
      botoes[0].focus();
    }
  });

  const anterior = info.id ? historico.obter(info.id) : null;
  if (anterior?.escolha && alternativas.some((a) => a.letra === anterior.escolha)) {
    mostrar(anterior.escolha, false);
  }
  return elemento;
}

// ---------- Dissertativa ----------

const AUTOAVALIACAO = [
  { pontos: 1, rotulo: 'Acertei' },
  { pontos: 0.5, rotulo: 'Acertei em parte' },
  { pontos: 0, rotulo: 'Errei' },
];

function montarDissertativa(elemento, info) {
  const { campos, numero } = info;
  const idCampo = `resposta-${hash(info.id || campos.pergunta)}-${numero}`;

  elemento.insertAdjacentHTML(
    'beforeend',
    `<label class="rotulo" for="${idCampo}">Sua resposta</label>
    <textarea id="${idCampo}" class="campo-resposta" rows="5" placeholder="Escreva aqui com suas palavras…"></textarea>
    <div class="questao-acoes">
      <button type="button" class="botao" data-acao="ia">Corrigir com IA</button>
      <button type="button" class="botao botao-secundario" data-acao="gabarito" aria-expanded="false">Ver resposta esperada</button>
    </div>
    <div class="painel-ia" hidden></div>
    <div class="gabarito" hidden>
      <h4>Resposta esperada</h4>
      ${campos.resposta ? md(campos.resposta) : '<p><em>Esta questão ainda não tem resposta cadastrada.</em></p>'}
      ${campos.criterios ? `<h4>O que precisa ter na resposta</h4>${md(campos.criterios)}` : ''}
      <div class="autoavaliacao">
        <p>Comparando com a sua resposta, como você foi?</p>
        <div class="autoavaliacao-botoes">
          ${AUTOAVALIACAO.map(
            (op) => `<button type="button" class="botao botao-secundario" data-pontos="${op.pontos}" aria-pressed="false">${op.rotulo}</button>`
          ).join('')}
        </div>
      </div>
      <div class="questao-retorno" aria-live="polite"></div>
    </div>`
  );

  const campo = elemento.querySelector('textarea');
  const botaoGabarito = elemento.querySelector('[data-acao="gabarito"]');
  const gabarito = elemento.querySelector('.gabarito');
  const painelIa = elemento.querySelector('.painel-ia');
  const retorno = elemento.querySelector('.questao-retorno');

  function abrirGabarito(aberto) {
    gabarito.hidden = !aberto;
    botaoGabarito.setAttribute('aria-expanded', String(aberto));
    botaoGabarito.textContent = aberto ? 'Esconder resposta esperada' : 'Ver resposta esperada';
  }

  function mostrarAvaliacao(pontos) {
    for (const botao of elemento.querySelectorAll('[data-pontos]')) {
      botao.setAttribute('aria-pressed', String(Number(botao.dataset.pontos) === pontos));
    }
    retorno.innerHTML =
      pontos === 1
        ? '<div class="resultado resultado-certo"><p class="resultado-titulo">Boa! Ficou anotado como acerto.</p></div>'
        : `<div class="resultado ${pontos === 0 ? 'resultado-errado' : 'resultado-parcial'}">
            <p class="resultado-titulo">Anotado. Esse tópico vai aparecer em "Onde estudar mais".</p>
            ${textoRevisar(info)}
          </div>`;
  }

  elemento.addEventListener('click', async (evento) => {
    const alvo = evento.target.closest('button');
    if (!alvo) return;

    if (alvo.dataset.acao === 'gabarito') {
      abrirGabarito(gabarito.hidden);
    } else if (alvo.dataset.pontos !== undefined) {
      const pontos = Number(alvo.dataset.pontos);
      mostrarAvaliacao(pontos);
      if (info.id) historico.registrar(info.id, { ...info.registro, pontos, texto: campo.value });
    } else if (alvo.dataset.acao === 'ia') {
      await pedirCorrecao(info, campo, painelIa);
    } else if (alvo.dataset.acao === 'copiar-de-novo') {
      const copiou = await copiar(painelIa.querySelector('textarea').value);
      alvo.textContent = copiou ? 'Copiado!' : 'Não deu para copiar — selecione o texto acima';
    }
  });

  const anterior = info.id ? historico.obter(info.id) : null;
  if (anterior) {
    campo.value = anterior.texto ?? '';
    abrirGabarito(true);
    mostrarAvaliacao(anterior.pontos);
  }
  return elemento;
}

async function pedirCorrecao(info, campo, painel) {
  painel.hidden = false;
  const resposta = campo.value.trim();
  if (!resposta) {
    painel.innerHTML = '<p class="painel-ia-status">Escreva sua resposta primeiro. Depois clique em "Corrigir com IA".</p>';
    campo.focus();
    return;
  }

  const texto = montarPedido(info, resposta);
  const copiou = await copiar(texto);
  painel.innerHTML = `
    <p class="painel-ia-status">${
      copiou
        ? '<strong>Pronto, copiamos o pedido de correção!</strong> Abra uma IA, cole o texto (Ctrl+V, ou toque e segure → Colar) e envie.'
        : '<strong>Não deu para copiar automaticamente.</strong> Copie o texto abaixo, abra uma IA, cole e envie.'
    }</p>
    <div class="botoes-ia">
      ${IAS.map((ia) => `<a class="botao botao-secundario" href="${ia.url}" target="_blank" rel="noopener">Abrir ${ia.nome}</a>`).join('')}
    </div>
    <details${copiou ? '' : ' open'}>
      <summary>Ver o texto do pedido</summary>
      <textarea readonly rows="10" aria-label="Texto do pedido de correção">${escapar(texto)}</textarea>
      <button type="button" class="botao botao-discreto" data-acao="copiar-de-novo">Copiar de novo</button>
    </details>
    <p class="nota">O site não envia nada sozinho: você escolhe a IA e cola o texto lá.</p>`;
}

/** Tira as tags HTML que às vezes aparecem nas questões (ex.: x<sup>2</sup> → x^2). */
function textoPuro(texto) {
  return String(texto ?? '')
    .replace(/<sup>(.*?)<\/sup>/gi, '^$1')
    .replace(/<sub>(.*?)<\/sub>/gi, '_$1')
    .replace(/<[^>]+>/g, '');
}

function montarPedido({ campos, contexto }, respostaAluno) {
  const materia = contexto.materia?.nome ?? 'Ensino Médio';
  const ano = contexto.ano?.nome ? `do ${contexto.ano.nome} do Ensino Médio` : 'do Ensino Médio';
  const linhas = [
    `Você é professor(a) de ${materia} e vai corrigir a resposta de um aluno ${ano}.`,
    '',
  ];
  if (contexto.capitulo) {
    linhas.push(`Conteúdo: ${contexto.capitulo.titulo}${campos.topico ? ` (tópico: ${campos.topico})` : ''}`, '');
  }
  linhas.push('PERGUNTA:', textoPuro(campos.pergunta), '');
  if (campos.resposta) linhas.push('RESPOSTA DE REFERÊNCIA (gabarito do professor):', textoPuro(campos.resposta), '');
  if (campos.criterios) linhas.push('CRITÉRIOS DE CORREÇÃO:', textoPuro(campos.criterios), '');
  linhas.push(
    'RESPOSTA DO ALUNO:',
    respostaAluno,
    '',
    'Corrija a resposta do aluno seguindo estes passos:',
    '1. Dê uma nota de 0 a 10.',
    '2. Diga o que ele acertou.',
    '3. Aponte o que está errado ou faltando e explique por quê.',
    '4. Diga o que ele deve revisar para melhorar.',
    'Use linguagem simples, seja direto e encorajador. Não reescreva a resposta inteira no lugar do aluno: ajude-o a chegar lá.'
  );
  return linhas.join('\n');
}

async function copiar(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    // Alguns navegadores bloqueiam a API nova; tenta o jeito antigo.
  }
  try {
    const temporario = document.createElement('textarea');
    temporario.value = texto;
    temporario.setAttribute('readonly', '');
    temporario.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.append(temporario);
    temporario.select();
    const copiou = document.execCommand('copy');
    temporario.remove();
    return copiou;
  } catch {
    return false;
  }
}
