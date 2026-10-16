# GER Resumos

Site de resumos e questões para o Ensino Médio, feito pelo Grêmio Estudantil. Começou com a ideia de ajudar o 9º ano a saber como é o 1º, o 1º a saber como é o 2º, e assim por diante. Mas serve para qualquer pessoa que queira estudar.

É um **site estático**: só HTML, CSS e JavaScript, sem servidor nem banco de dados. Pode ser hospedado de graça no GitHub Pages.

## O que o site tem

- **Navegação por ano e área:** 1º, 2º e 3º ano → Matemática, Ciências da Natureza (Biologia, Química, Física), Linguagens (Língua Portuguesa, Redação, Literatura) e Ciências Humanas (História, Geografia, Sociologia, Filosofia).
- **Capítulos com tópicos principais no início:** uma lista com links para cada seção, gerada a partir dos títulos, e os pontos-chave para revisar rápido.
- **Vídeos junto com o texto** (YouTube).
- **Questões objetivas:** o aluno clica numa alternativa e vê na hora se acertou, com a explicação.
- **Questões dissertativas:** o aluno escreve, compara com a resposta esperada e se autoavalia. O botão **Corrigir com IA** monta um pedido de correção completo (pergunta, gabarito, critérios e resposta do aluno) para colar no ChatGPT, Gemini ou Claude, sem custo para o grêmio.
- **Onde estudar mais:** cada questão é ligada a um tópico. Quando o aluno erra, o site mostra o que revisar no fim do capítulo e numa página com todos os tópicos, do que ele mais errou para o que menos errou. As respostas ficam salvas só no aparelho do aluno.
- **"Como é o próximo ano":** uma página por ano, com espaços para dicas e depoimentos de quem já passou por ele.
- **Folha de fórmulas** de Matemática, Física e Química, com botão para imprimir.
- **Busca** em todos os resumos.
- **Modo escuro** e **modo offline**: depois de aberto uma vez, o site funciona sem internet.

## Como escrever conteúdo

Veja o guia [CONTRIBUINDO.md](CONTRIBUINDO.md). Em resumo: cada capítulo é um arquivo `.md` em `conteudo/<ano>ano/<matéria>/`, listado em `conteudo/indice.json`.

## Rodar no computador

O site precisa de um servidor local (abrir o `index.html` direto não funciona):

```bash
python3 -m http.server 8000
# ou
npx http-server -p 8000
```

Depois, abra <http://localhost:8000>.

## Publicar no GitHub Pages

1. No GitHub, abra o repositório e vá em **Settings → Pages**.
2. Em **Build and deployment**, escolha **Deploy from a branch**, a branch `main` e a pasta `/ (root)`.
3. Em alguns minutos o site fica disponível em `https://<usuário>.github.io/<repositório>/`.

O arquivo `.nojekyll` faz o GitHub publicar os arquivos exatamente como estão.

## Trocar as cores e o logo

As cores e o logo atuais são **provisórios**.

- **Cores:** todas ficam em [`assets/css/tema.css`](assets/css/tema.css), uma vez para o tema claro e outra para o escuro. Também atualize `theme_color` em `manifest.webmanifest` e a `<meta name="theme-color">` no `index.html`.
- **Logo:** substitua `assets/img/logo.svg` (aparece no topo e na aba do navegador) e os ícones `assets/img/icone-192.png` e `assets/img/icone-512.png` (usados quando o site é instalado no celular).

## Estrutura

```
index.html              página única do site
sw.js                   modo offline (service worker)
manifest.webmanifest    permite instalar o site no celular
assets/
  css/tema.css          cores
  css/estilo.css        visual
  js/app.js             páginas e navegação
  js/markdown.js        transforma os .md em páginas (blocos de questão, vídeo etc.)
  js/questoes.js        questões objetivas e dissertativas, pedido de correção para IA
  js/historico.js       respostas salvas no aparelho ("onde estudar mais")
  js/busca.js           busca
  js/conteudo.js        carrega o índice e os arquivos
  vendor/marked.umd.js  leitor de Markdown (marked 18.0.14, licença MIT)
conteudo/
  indice.json           anos, áreas, matérias e lista de capítulos
  1ano/matematica/…     capítulos
  como-e/1ano.md …      páginas "Como é o ano"
  formulas.md           folha de fórmulas
  _modelo-capitulo.md   modelo para copiar
```

## Ideias para depois

- **Provas e datas de trabalhos pelos líderes de turma:** os líderes editam uma Planilha Google e o site lê os dados publicados, sem back-end próprio. Dá para mostrar um calendário por turma com contagem regressiva.
- **Correção por IA dentro do site:** precisaria de uma chave de API paga e de uma pequena função serverless (por exemplo, Cloudflare Workers) para a chave não ficar exposta no código.
- **Flashcards** com revisão espaçada, a partir dos pontos-chave.
- **Simulados** com cronômetro, misturando questões de várias matérias.
- **Progresso por capítulo** ("já estudei").
- **Botão "sugerir correção"** em cada resumo, levando para um Google Forms do grêmio.
