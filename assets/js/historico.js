// Guarda no próprio aparelho do aluno o que ele respondeu em cada questão.
// É isso que permite mostrar "onde estudar mais" sem precisar de servidor.

const CHAVE = 'ger-resumos:respostas';
const eventos = new EventTarget();
let dados = null;

function ler() {
  if (!dados) {
    try {
      dados = JSON.parse(localStorage.getItem(CHAVE)) ?? {};
    } catch {
      dados = {};
    }
    if (typeof dados !== 'object' || Array.isArray(dados)) dados = {};
  }
  return dados;
}

function salvar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(dados));
  } catch {
    // Sem armazenamento (aba anônima, por exemplo): vale só enquanto a página estiver aberta.
  }
  eventos.dispatchEvent(new Event('mudou'));
}

// Mantém abas diferentes do site sincronizadas.
window.addEventListener('storage', (evento) => {
  if (evento.key === CHAVE) {
    dados = null;
    eventos.dispatchEvent(new Event('mudou'));
  }
});

export function obter(id) {
  return ler()[id] ?? null;
}

/** pontos: 1 = acertou, 0.5 = acertou em parte, 0 = errou. */
export function registrar(id, registro) {
  ler()[id] = { ...registro, quando: Date.now() };
  salvar();
}

export function removerOnde(condicao) {
  const todosDados = ler();
  let mudou = false;
  for (const [id, registro] of Object.entries(todosDados)) {
    if (condicao(registro, id)) {
      delete todosDados[id];
      mudou = true;
    }
  }
  if (mudou) salvar();
}

export function todos() {
  return Object.entries(ler()).map(([id, registro]) => ({ id, ...registro }));
}

export function limpar() {
  dados = {};
  salvar();
}

/** Chama a função sempre que o histórico mudar. Devolve a função que cancela. */
export function aoMudar(funcao) {
  eventos.addEventListener('mudou', funcao);
  return () => eventos.removeEventListener('mudou', funcao);
}

/** Junta as respostas por tópico e ordena do mais errado para o menos errado. */
export function agruparPorTopico(registros) {
  const grupos = new Map();
  for (const r of registros) {
    const chave = `${r.ano}/${r.materia}/${r.capitulo}#${r.topicoId || r.topico || ''}`;
    let grupo = grupos.get(chave);
    if (!grupo) {
      grupo = {
        ano: r.ano,
        materia: r.materia,
        capitulo: r.capitulo,
        capituloTitulo: r.capituloTitulo,
        topico: r.topico,
        topicoId: r.topicoId,
        respondidas: 0,
        comErro: 0,
      };
      grupos.set(chave, grupo);
    }
    grupo.respondidas++;
    if (r.pontos < 1) grupo.comErro++;
  }
  return [...grupos.values()].sort(
    (a, b) => b.comErro - a.comErro || b.comErro / b.respondidas - a.comErro / a.respondidas
  );
}

export function topicosParaRevisar(registros = todos()) {
  return agruparPorTopico(registros).filter((grupo) => grupo.comErro > 0);
}
