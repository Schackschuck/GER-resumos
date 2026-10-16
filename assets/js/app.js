// Arquivo principal: decide qual página mostrar a partir do endereço (#/...) e monta cada uma.
//
// Endereços:
//   #/                                   início
//   #/ano/1                              matérias do 1º ano
//   #/ano/1/matematica                   capítulos de Matemática do 1º ano
//   #/ano/1/matematica/funcoes[/secao]   capítulo (e, opcionalmente, uma seção dele)
//   #/como-e/1                           "Como é o 1º ano"
//   #/formulas[/secao]                   folha de fórmulas
//   #/revisar                            onde estudar mais
//   #/busca?q=termo                      busca

import {
  carregarIndice, obterIndice, carregarTexto, caminhoCapitulo, caminhoComoE,
  buscarAno, buscarMateria, capitulosDe, buscarCapitulo,
} from './conteudo.js';
import { renderizarMarkdown } from './markdown.js';
import * as historico from './historico.js';
import { buscar, destacar } from './busca.js';
import { escapar, numero, NaoEncontrado } from './util.js';

const NOME_SITE = 'GER Resumos';
const CHAVE_TEMA = 'ger-resumos:tema';
const principal = document.getElementById('conteudo-principal');
const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');

let paginaAtual = null; // chave da página na tela (sem a seção)
let limpezas = []; // funções chamadas ao sair da página

// ---------- Rotas ----------

function lerEndereco() {
  const hash = location.hash.replace(/^#\/?/, '');
  const [caminho, consulta = ''] = hash.split('?');
  const partes = caminho.split('/').filter(Boolean).map((p) => {
    try {
      return decodeURIComponent(p);
    } catch {
      return p;
    }
  });
  return { partes, parametros: new URLSearchParams(consulta) };
}

function resolver({ partes, parametros }) {
  const [p0, p1, p2, p3, p4] = partes;
  if (!p0) return { chave: 'inicio', montar: paginaInicio };
  if (p0 === 'ano' && p1 && !p2) return { chave: `ano/${p1}`, montar: () => paginaAno(p1) };
  if (p0 === 'ano' && p2 && !p3) return { chave: `ano/${p1}/${p2}`, montar: () => paginaMateria(p1, p2) };
  if (p0 === 'ano' && p3 && partes.length <= 5) {
    return { chave: `ano/${p1}/${p2}/${p3}`, secao: p4, montar: () => paginaCapitulo(p1, p2, p3) };
  }
  if (p0 === 'como-e' && p1 && partes.length <= 3) {
    return { chave: `como-e/${p1}`, secao: p2, montar: () => paginaComoE(p1) };
  }
  if (p0 === 'formulas' && partes.length <= 2) {
    return { chave: 'formulas', secao: p1, montar: paginaFormulas };
  }
  if (p0 === 'revisar' && !p1) return { chave: 'revisar', montar: paginaRevisar };
  if (p0 === 'busca' && !p1) {
    const termo = parametros.get('q') ?? '';
    return { chave: `busca?${termo}`, montar: () => paginaBusca(termo) };
  }
  return { chave: 'nao-encontrada', montar: paginaNaoEncontrada };
}

async function rotear() {
  const rota = resolver(lerEndereco());

  // Mesma página, outra seção: só rola até ela.
  if (rota.chave === paginaAtual) {
    rolarPara(rota.secao, true);
    return;
  }

  limpezas.forEach((limpar) => limpar());
  limpezas = [];
  paginaAtual = rota.chave;
  if (!rota.chave.startsWith('busca?')) document.getElementById('busca-topo').value = '';
  principal.setAttribute('aria-busy', 'true');
  principal.innerHTML = '<p class="carregando">Carregando…</p>';

  let titulo;
  try {
    await carregarIndice();
    titulo = await rota.montar();
  } catch (erro) {
    if (rota.chave !== paginaAtual) return; // o usuário já foi para outra página
    titulo = erro instanceof NaoEncontrado ? paginaNaoEncontrada(erro.message) : paginaErro(erro);
  }
  if (rota.chave !== paginaAtual) return;

  principal.removeAttribute('aria-busy');
  document.title = titulo ? `${titulo} · ${NOME_SITE}` : NOME_SITE;
  marcarNavegacao();
  if (rota.secao) {
    requestAnimationFrame(() => rolarPara(rota.secao, false));
  } else {
    window.scrollTo(0, 0);
    principal.querySelector('h1')?.focus({ preventScroll: true });
  }
}

function rolarPara(secao, suave) {
  const alvo = secao ? document.getElementById(secao) : null;
  if (!alvo) {
    window.scrollTo(0, 0);
    return;
  }
  alvo.scrollIntoView({ behavior: suave && !movimentoReduzido.matches ? 'smooth' : 'auto', block: 'start' });
  alvo.setAttribute('tabindex', '-1');
  alvo.focus({ preventScroll: true });
}

function exigir(valor, mensagem = 'Página não encontrada.') {
  if (!valor) throw new NaoEncontrado(mensagem);
  return valor;
}

// ---------- Pedaços de HTML reaproveitados ----------

function trilha(itens) {
  return `
    <nav class="trilha" aria-label="Você está em">
      <ol>
        <li><a href="#/">Início</a></li>
        ${itens
          .map((item) => `<li>${item.rota ? `<a href="${item.rota}">${escapar(item.texto)}</a>` : `<span aria-current="page">${escapar(item.texto)}</span>`}</li>`)
          .join('')}
      </ol>
    </nav>`;
}

function plural(n, singular, varios) {
  return `${n} ${n === 1 ? singular : varios}`;
}

function cartao({ rota, titulo, texto = '', extra = '', classe = '', area = '' }) {
  return `
    <a class="cartao ${classe}" href="${rota}"${area ? ` data-area="${escapar(area)}"` : ''}>
      <span class="cartao-titulo">${titulo}</span>
      ${texto ? `<span class="cartao-texto">${texto}</span>` : ''}
      ${extra}
    </a>`;
}

function listaTopicos(titulos, rotaBase) {
  const principais = titulos.filter((t) => t.nivel === 2);
  if (!principais.length) return '';
  return `
    <div class="topicos">
      <h2>Tópicos principais</h2>
      <ol>${principais.map((t) => `<li><a href="${rotaBase}/${t.id}">${escapar(t.texto)}</a></li>`).join('')}</ol>
    </div>`;
}

// ---------- Páginas ----------

function paginaInicio() {
  const indice = obterIndice();
  principal.innerHTML = `
    <section class="destaque">
      <h1 tabindex="-1">Resumos e questões para o Ensino Médio</h1>
      <p>Feito por alunos, para alunos. Escolha o ano, estude pelo resumo e teste o que aprendeu: o site mostra onde você precisa estudar mais.</p>
      <form class="busca-grande" role="search" data-busca>
        <label class="sr-only" for="busca-inicio">Buscar nos resumos</label>
        <input id="busca-inicio" type="search" name="q" placeholder="Ex.: mitocôndria, Bhaskara" autocomplete="off">
        <button class="botao" type="submit">Buscar</button>
      </form>
    </section>

    <section class="secao">
      <h2>Escolha o ano</h2>
      <div class="grade grade-anos">
        ${indice.anos
          .map((ano) => {
            const total = capitulosDe(ano.id).length;
            return cartao({
              rota: `#/ano/${ano.id}`,
              titulo: escapar(ano.nome),
              texto: total ? plural(total, 'resumo', 'resumos') : 'Em breve',
              classe: 'cartao-ano',
            });
          })
          .join('')}
      </div>
    </section>

    <section class="secao">
      <h2>Vai mudar de ano?</h2>
      <p class="secao-texto">Veja como é o próximo ano, contado por quem já passou por ele.</p>
      <div class="grade grade-pequena">
        ${indice.anos
          .map((ano) =>
            cartao({
              rota: `#/como-e/${ano.id}`,
              titulo: `Como é o ${escapar(ano.nome)}`,
              texto: escapar(ano.paraQuem ?? ''),
            })
          )
          .join('')}
      </div>
    </section>

    <section class="secao">
      <h2>Ferramentas</h2>
      <div class="grade grade-pequena">
        ${cartao({ rota: '#/formulas', titulo: 'Folha de fórmulas', texto: 'Matemática, Física e Química num lugar só.' })}
        ${cartao({ rota: '#/revisar', titulo: 'Onde estudar mais', texto: textoRevisar() })}
      </div>
    </section>`;
  return '';
}

function textoRevisar() {
  const total = historico.topicosParaRevisar().length;
  return total
    ? `Você tem ${plural(total, 'tópico', 'tópicos')} para revisar.`
    : 'Os tópicos que você mais erra nas questões aparecem aqui.';
}

function paginaAno(idAno) {
  const ano = exigir(buscarAno(idAno));
  const indice = obterIndice();
  principal.innerHTML = `
    ${trilha([{ texto: ano.nome }])}
    <header class="cabecalho-pagina">
      <h1 tabindex="-1">${escapar(ano.nome)}</h1>
      <a class="link-destaque" href="#/como-e/${ano.id}">Como é o ${escapar(ano.nome)}? Dicas de quem já passou →</a>
    </header>
    ${indice.areas
      .map(
        (area) => `
      <section class="secao area" data-area="${escapar(area.id)}">
        <h2>${escapar(area.nome)}</h2>
        <div class="grade grade-materias">
          ${area.materias
            .map((materia) => {
              const total = capitulosDe(ano.id, materia.id).length;
              return cartao({
                rota: `#/ano/${ano.id}/${materia.id}`,
                titulo: escapar(materia.nome),
                texto: total ? plural(total, 'resumo', 'resumos') : 'Em breve',
                classe: total ? '' : 'cartao-vazio',
                area: area.id,
              });
            })
            .join('')}
        </div>
      </section>`
      )
      .join('')}`;
  return ano.nome;
}

function paginaMateria(idAno, idMateria) {
  const ano = exigir(buscarAno(idAno));
  const { materia, area } = exigir(buscarMateria(idMateria));
  const capitulos = capitulosDe(ano.id, materia.id);
  const outrosAnos = obterIndice().anos.filter((a) => a.id !== ano.id);

  principal.innerHTML = `
    ${trilha([{ texto: ano.nome, rota: `#/ano/${ano.id}` }, { texto: materia.nome }])}
    <header class="cabecalho-pagina" data-area="${escapar(area.id)}">
      <p class="sobretitulo">${escapar(area.nome)} · ${escapar(ano.nome)}</p>
      <h1 tabindex="-1">${escapar(materia.nome)}</h1>
    </header>
    ${
      capitulos.length
        ? `<ol class="lista-capitulos">
            ${capitulos
              .map(
                (cap, i) => `
              <li>
                <a class="capitulo-item" href="#/ano/${ano.id}/${materia.id}/${cap.id}" data-area="${escapar(area.id)}">
                  <span class="capitulo-numero" aria-hidden="true">${i + 1}</span>
                  <span>
                    <span class="cartao-titulo">${escapar(cap.titulo)}</span>
                    ${cap.descricao ? `<span class="cartao-texto">${escapar(cap.descricao)}</span>` : ''}
                  </span>
                </a>
              </li>`
              )
              .join('')}
          </ol>`
        : `<div class="vazio">
            <p class="vazio-titulo">Ainda não tem resumo de ${escapar(materia.nome)} do ${escapar(ano.nome)}.</p>
            <p>Quer ajudar a escrever? Fale com o grêmio.</p>
          </div>`
    }
    <p class="outros-anos">${escapar(materia.nome)} em outros anos:
      ${outrosAnos.map((a) => `<a href="#/ano/${a.id}/${materia.id}">${escapar(a.nome)}</a>`).join(' · ')}
    </p>`;
  return `${materia.nome} · ${ano.nome}`;
}

async function paginaCapitulo(idAno, idMateria, idCapitulo) {
  const ano = exigir(buscarAno(idAno));
  const { materia, area } = exigir(buscarMateria(idMateria));
  const capitulo = exigir(buscarCapitulo(ano.id, materia.id, idCapitulo));
  const caminho = caminhoCapitulo(capitulo);
  let texto;
  try {
    texto = await carregarTexto(caminho);
  } catch (erro) {
    if (erro instanceof NaoEncontrado) {
      throw new Error(
        `O capítulo está no indice.json, mas o arquivo ${caminho} não existe. ` +
          'Confira se o nome do arquivo é igual ao "id" do capítulo.'
      );
    }
    throw erro;
  }

  const rotaBase = `#/ano/${ano.id}/${materia.id}/${capitulo.id}`;
  const resultado = renderizarMarkdown(texto, { ano, materia, area, capitulo, rotaBase });
  const vizinhos = capitulosDe(ano.id, materia.id);
  const posicao = vizinhos.findIndex((c) => c.id === capitulo.id);
  const anterior = vizinhos[posicao - 1];
  const proximo = vizinhos[posicao + 1];
  const topicos = listaTopicos(resultado.titulos, rotaBase);

  principal.innerHTML = `
    ${trilha([
      { texto: ano.nome, rota: `#/ano/${ano.id}` },
      { texto: materia.nome, rota: `#/ano/${ano.id}/${materia.id}` },
      { texto: capitulo.titulo },
    ])}
    <header class="cabecalho-pagina" data-area="${escapar(area.id)}">
      <p class="sobretitulo">${escapar(materia.nome)} · ${escapar(ano.nome)}</p>
      <h1 tabindex="-1">${escapar(capitulo.titulo)}</h1>
      ${capitulo.descricao ? `<p class="descricao">${escapar(capitulo.descricao)}</p>` : ''}
    </header>
    ${topicos || resultado.pontosChave ? `<section class="neste-capitulo" aria-label="Neste capítulo">${topicos}</section>` : ''}
    <article class="resumo"></article>
    ${resultado.totalQuestoes ? '<section class="desempenho" aria-live="polite"></section>' : ''}
    <nav class="vizinhos" aria-label="Outros capítulos">
      ${anterior ? `<a class="vizinho" href="#/ano/${ano.id}/${materia.id}/${anterior.id}"><span>← Anterior</span>${escapar(anterior.titulo)}</a>` : '<span></span>'}
      ${proximo ? `<a class="vizinho vizinho-proximo" href="#/ano/${ano.id}/${materia.id}/${proximo.id}"><span>Próximo →</span>${escapar(proximo.titulo)}</a>` : ''}
    </nav>`;

  principal.querySelector('.resumo').append(resultado.conteudo);
  if (resultado.pontosChave) principal.querySelector('.neste-capitulo').append(resultado.pontosChave);

  // Respostas de questões que foram tiradas ou mudadas no arquivo não contam mais.
  historico.removerOnde(
    (r, id) => r.ano === ano.id && r.materia === materia.id && r.capitulo === capitulo.id && !resultado.idsQuestoes.has(id)
  );

  const desempenho = principal.querySelector('.desempenho');
  if (desempenho) {
    const atualizar = () => {
      const registros = historico.todos().filter((r) => resultado.idsQuestoes.has(r.id));
      desempenho.innerHTML = montarDesempenho(registros, resultado.totalQuestoes, rotaBase);
    };
    atualizar();
    limpezas.push(historico.aoMudar(atualizar));
  }
  return capitulo.titulo;
}

function montarDesempenho(registros, total, rotaBase) {
  const respondidas = registros.length;
  if (!respondidas) {
    return `
      <h2>Onde estudar mais</h2>
      <p>Responda às questões acima. Conforme você erra, aparece aqui o que revisar.</p>`;
  }
  const pontos = registros.reduce((soma, r) => soma + (r.pontos ?? 0), 0);
  const topicos = historico.topicosParaRevisar(registros);
  return `
    <h2>Onde estudar mais</h2>
    <p class="placar"><strong>${numero(pontos)}</strong> de ${plural(respondidas, 'questão respondida', 'questões respondidas')} certas${
      respondidas < total ? ` <span class="placar-falta">(faltam ${total - respondidas})</span>` : ''
    }</p>
    ${
      topicos.length
        ? `<p>Revise estes tópicos:</p>
          <ul class="lista-revisar">
            ${topicos
              .map(
                (t) => `
              <li>
                ${t.topicoId ? `<a href="${rotaBase}/${t.topicoId}">${escapar(t.topico)}</a>` : escapar(t.topico || 'Questões sem tópico')}
                <span class="lista-revisar-info">${t.comErro} de ${plural(t.respondidas, 'questão', 'questões')} com erro</span>
              </li>`
              )
              .join('')}
          </ul>`
        : '<p class="tudo-certo">Tudo certo até agora. Continue assim!</p>'
    }`;
}

async function paginaMarkdown({ caminho, titulo, trilhaItens, rotaBase, antes = '', depois = '', vazio }) {
  let texto;
  try {
    texto = await carregarTexto(caminho);
  } catch (erro) {
    if (!(erro instanceof NaoEncontrado)) throw erro;
    texto = null;
  }
  principal.innerHTML = `
    ${trilha(trilhaItens)}
    <header class="cabecalho-pagina">
      <h1 tabindex="-1">${escapar(titulo)}</h1>
      ${antes}
    </header>
    <div class="topicos-slot"></div>
    <article class="resumo"></article>
    ${depois}`;
  const artigo = principal.querySelector('.resumo');
  if (texto === null) {
    artigo.innerHTML = `<div class="vazio"><p class="vazio-titulo">${vazio}</p></div>`;
    return titulo;
  }
  const resultado = renderizarMarkdown(texto, { rotaBase });
  artigo.append(resultado.conteudo);
  const topicos = listaTopicos(resultado.titulos, rotaBase);
  if (topicos) principal.querySelector('.topicos-slot').outerHTML = `<section class="neste-capitulo" aria-label="Nesta página">${topicos}</section>`;
  return titulo;
}

function paginaComoE(idAno) {
  const ano = exigir(buscarAno(idAno));
  return paginaMarkdown({
    caminho: caminhoComoE(ano.id),
    titulo: `Como é o ${ano.nome}`,
    trilhaItens: [{ texto: `Como é o ${ano.nome}` }],
    rotaBase: `#/como-e/${ano.id}`,
    antes: ano.paraQuem ? `<p class="descricao">${escapar(ano.paraQuem)}</p>` : '',
    depois: `<p class="link-final"><a class="botao" href="#/ano/${ano.id}">Ver os resumos do ${escapar(ano.nome)}</a></p>`,
    vazio: 'Esta página ainda não foi escrita.',
  });
}

function paginaFormulas() {
  return paginaMarkdown({
    caminho: 'conteudo/formulas.md',
    titulo: 'Folha de fórmulas',
    trilhaItens: [{ texto: 'Folha de fórmulas' }],
    rotaBase: '#/formulas',
    antes: `
      <p class="descricao">As principais fórmulas de Matemática, Física e Química, com o que significa cada letra.</p>
      <button type="button" class="botao botao-secundario nao-imprimir" data-acao="imprimir">Imprimir</button>`,
    vazio: 'A folha de fórmulas ainda não foi escrita.',
  });
}

function paginaRevisar() {
  const desenhar = () => {
    const registros = historico.todos();
    const topicos = historico.topicosParaRevisar(registros);
    const pontos = registros.reduce((soma, r) => soma + (r.pontos ?? 0), 0);
    let lista;
    if (!registros.length) {
      lista = `
        <div class="vazio">
          <p class="vazio-titulo">Você ainda não respondeu nenhuma questão.</p>
          <p>Abra um resumo, responda às questões do final e volte aqui: o site mostra os tópicos em que você mais errou.</p>
        </div>`;
    } else if (!topicos.length) {
      lista = '<div class="vazio"><p class="vazio-titulo">Nenhum tópico para revisar. Você acertou tudo o que respondeu!</p></div>';
    } else {
      lista = `
        <ul class="lista-revisar lista-revisar-grande">
          ${topicos
            .map((t) => {
              const ano = buscarAno(t.ano);
              const encontrado = buscarMateria(t.materia);
              const capitulo = buscarCapitulo(t.ano, t.materia, t.capitulo);
              const rota = `#/ano/${t.ano}/${t.materia}/${t.capitulo}${t.topicoId ? `/${t.topicoId}` : ''}`;
              return `
                <li data-area="${escapar(encontrado?.area.id ?? '')}">
                  <a href="${rota}">${escapar(t.topico || capitulo?.titulo || t.capituloTitulo || 'Capítulo')}</a>
                  <span class="lista-revisar-onde">${escapar([encontrado?.materia.nome, ano?.nome, capitulo?.titulo ?? t.capituloTitulo].filter(Boolean).join(' · '))}</span>
                  <span class="lista-revisar-info">${t.comErro} de ${plural(t.respondidas, 'questão', 'questões')} com erro</span>
                </li>`;
            })
            .join('')}
        </ul>`;
    }
    principal.innerHTML = `
      ${trilha([{ texto: 'Onde estudar mais' }])}
      <header class="cabecalho-pagina">
        <h1 tabindex="-1">Onde estudar mais</h1>
        <p class="descricao">Os tópicos em que você errou alguma questão, do que mais errou para o que menos errou. Acertou depois? O tópico sai da lista.</p>
      </header>
      ${registros.length ? `<p class="placar"><strong>${numero(pontos)}</strong> de ${plural(registros.length, 'questão respondida', 'questões respondidas')} certas</p>` : ''}
      ${lista}
      ${
        registros.length
          ? `<p class="nota">Suas respostas ficam salvas só neste aparelho e neste navegador.
              <button type="button" class="botao botao-discreto" data-acao="limpar-historico">Apagar meu histórico</button></p>`
          : ''
      }`;
  };
  desenhar();
  limpezas.push(historico.aoMudar(desenhar));
  return 'Onde estudar mais';
}

async function paginaBusca(termoInicial) {
  principal.innerHTML = `
    ${trilha([{ texto: 'Busca' }])}
    <header class="cabecalho-pagina">
      <h1 tabindex="-1">Buscar</h1>
    </header>
    <form class="busca-grande" role="search" data-busca>
      <label class="sr-only" for="busca-pagina">Buscar nos resumos</label>
      <input id="busca-pagina" type="search" name="q" autocomplete="off" placeholder="Digite um conteúdo…">
      <button class="botao" type="submit">Buscar</button>
    </form>
    <div class="resultados" aria-live="polite"></div>`;

  const campo = principal.querySelector('#busca-pagina');
  const saida = principal.querySelector('.resultados');
  campo.value = termoInicial;
  let pedido = 0;

  async function procurar(termo) {
    const atual = ++pedido;
    if (!termo.trim()) {
      saida.innerHTML = '<p class="nota">Digite pelo menos duas letras.</p>';
      return;
    }
    saida.innerHTML = '<p class="carregando">Procurando…</p>';
    const { termos, resultados } = await buscar(termo);
    if (atual !== pedido) return; // chegou um termo mais novo
    if (!termos.length) {
      saida.innerHTML = '<p class="nota">Digite pelo menos duas letras.</p>';
      return;
    }
    saida.innerHTML = resultados.length
      ? `<p class="nota">${plural(resultados.length, 'resultado', 'resultados')} para “${escapar(termo)}”</p>
        <ol class="lista-resultados">
          ${resultados
            .map(
              (r) => `
            <li><a class="resultado-busca" href="${r.rota}">
              <span class="resultado-busca-onde">${escapar(r.onde)} › ${escapar(r.documento)}</span>
              <span class="resultado-busca-titulo">${destacar(r.titulo, termos)}</span>
              ${r.trecho ? `<span class="resultado-busca-trecho">${destacar(r.trecho, termos)}</span>` : ''}
            </a></li>`
            )
            .join('')}
        </ol>`
      : `<div class="vazio"><p class="vazio-titulo">Nada encontrado para “${escapar(termo)}”.</p><p>Tente outra palavra ou confira a ortografia.</p></div>`;
  }

  let espera;
  campo.addEventListener('input', () => {
    clearTimeout(espera);
    espera = setTimeout(() => {
      const termo = campo.value;
      history.replaceState(null, '', `#/busca?q=${encodeURIComponent(termo)}`);
      paginaAtual = `busca?${termo}`;
      document.getElementById('busca-topo').value = termo;
      procurar(termo);
    }, 250);
  });
  limpezas.push(() => clearTimeout(espera));

  document.getElementById('busca-topo').value = termoInicial;
  await procurar(termoInicial);
  return termoInicial ? `Busca: ${termoInicial}` : 'Busca';
}

function paginaNaoEncontrada(mensagem) {
  principal.innerHTML = `
    <div class="vazio vazio-pagina">
      <h1 tabindex="-1">Página não encontrada</h1>
      <p>${escapar(typeof mensagem === 'string' ? mensagem : 'Esse endereço não existe (ou o conteúdo mudou de lugar).')}</p>
      <p><a class="botao" href="#/">Voltar ao início</a></p>
    </div>`;
  return 'Página não encontrada';
}

function paginaErro(erro) {
  console.error(erro);
  principal.innerHTML = `
    <div class="vazio vazio-pagina" role="alert">
      <h1 tabindex="-1">Algo deu errado</h1>
      <p>${escapar(erro.message)}</p>
      <p><a class="botao" href="#/">Voltar ao início</a></p>
    </div>`;
  return 'Erro';
}

// ---------- Cabeçalho, tema e eventos gerais ----------

function marcarNavegacao() {
  const [p0, p1] = lerEndereco().partes;
  for (const link of document.querySelectorAll('.navegacao a')) {
    const [a0, a1] = link.getAttribute('href').replace(/^#\/?/, '').split('/');
    const ativo = a0 === p0 && (a1 === undefined || a1 === p1);
    if (ativo) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
}

function atualizarContadorRevisar() {
  const total = historico.topicosParaRevisar().length;
  const contador = document.getElementById('contador-revisar');
  contador.textContent = total ? String(total) : '';
  contador.hidden = !total;
  contador.setAttribute('aria-label', plural(total, 'tópico para revisar', 'tópicos para revisar'));
}

function lerTemaSalvo() {
  try {
    return localStorage.getItem(CHAVE_TEMA);
  } catch {
    return null;
  }
}

function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema;
  const botao = document.getElementById('botao-tema');
  const escuro = tema === 'escuro';
  botao.setAttribute('aria-pressed', String(escuro));
  botao.setAttribute('aria-label', escuro ? 'Usar tema claro' : 'Usar tema escuro');
  botao.title = escuro ? 'Usar tema claro' : 'Usar tema escuro';
}

function iniciarTema() {
  const preferencia = window.matchMedia('(prefers-color-scheme: dark)');
  aplicarTema(document.documentElement.dataset.tema === 'escuro' ? 'escuro' : 'claro');
  preferencia.addEventListener('change', (e) => {
    if (!lerTemaSalvo()) aplicarTema(e.matches ? 'escuro' : 'claro');
  });
  document.getElementById('botao-tema').addEventListener('click', () => {
    const novo = document.documentElement.dataset.tema === 'escuro' ? 'claro' : 'escuro';
    aplicarTema(novo);
    try {
      localStorage.setItem(CHAVE_TEMA, novo);
    } catch {
      // sem armazenamento: o tema vale só nesta visita
    }
  });
}

function iniciarEventos() {
  // Formulários de busca (topo e páginas)
  document.addEventListener('submit', (evento) => {
    const formulario = evento.target.closest('[data-busca]');
    if (!formulario) return;
    evento.preventDefault();
    const termo = new FormData(formulario).get('q')?.toString().trim() ?? '';
    location.hash = `#/busca?q=${encodeURIComponent(termo)}`;
  });

  document.addEventListener('click', (evento) => {
    const alvo = evento.target.closest('a, button');
    if (!alvo) return;

    // Links internos do tipo #algum-id (sem "/") só rolam a página, sem trocar de rota.
    const href = alvo.tagName === 'A' ? alvo.getAttribute('href') : null;
    if (href && href.startsWith('#') && !href.startsWith('#/')) {
      evento.preventDefault();
      rolarPara(decodeURIComponent(href.slice(1)), true);
      return;
    }
    if (alvo.dataset.acao === 'imprimir') window.print();
    if (alvo.dataset.acao === 'limpar-historico' && window.confirm('Apagar todas as suas respostas salvas neste aparelho?')) {
      historico.limpar();
    }
  });

  window.addEventListener('hashchange', rotear);
  historico.aoMudar(atualizarContadorRevisar);

  const aviso = document.getElementById('aviso-offline');
  const atualizarConexao = () => {
    aviso.hidden = navigator.onLine;
  };
  window.addEventListener('online', atualizarConexao);
  window.addEventListener('offline', atualizarConexao);
  atualizarConexao();
}

// ---------- Modo offline ----------

function iniciarOffline() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  navigator.serviceWorker
    .register('sw.js')
    .then(() => navigator.serviceWorker.ready)
    .then(async (registro) => {
      // Guarda todos os resumos no aparelho para funcionar sem internet.
      const indice = await carregarIndice();
      const arquivos = [
        ...indice.capitulos.map(caminhoCapitulo),
        ...indice.anos.map((ano) => caminhoComoE(ano.id)),
      ];
      registro.active?.postMessage({ tipo: 'guardar', arquivos });
    })
    .catch(() => {
      // Sem modo offline neste navegador: o site continua funcionando normalmente.
    });
}

// ---------- Início ----------

if (!window.marked) {
  principal.innerHTML =
    '<div class="vazio vazio-pagina" role="alert"><h1>Algo deu errado</h1><p>Não foi possível carregar o leitor de resumos (assets/vendor/marked.umd.js).</p></div>';
} else {
  iniciarTema();
  iniciarEventos();
  atualizarContadorRevisar();
  rotear();
  iniciarOffline();
}
