---
name: GER Resumos
description: Resumos e questões para o Ensino Médio, feitos pelo Grêmio Estudantil Rosariense.
colors:
  cor-primaria: "#19255a"
  cor-primaria-forte: "#2c3c8c"
  cor-primaria-suave: "#e7e9f4"
  cor-sobre-primaria: "#ffffff"
  fundo: "#f5f6fa"
  superficie: "#ffffff"
  superficie-2: "#eceef5"
  borda: "#d8dce8"
  texto: "#171c2c"
  texto-suave: "#525a72"
  sucesso: "#1b7f4f"
  sucesso-suave: "#e2f4ea"
  erro: "#c2352b"
  erro-suave: "#fbe8e6"
  aviso: "#8a5a00"
  aviso-suave: "#fff3d4"
  area-matematica: "#d9480f"
  area-natureza: "#2b8a3e"
  area-linguagens: "#1971c2"
  area-humanas: "#a61e4d"
  cor-primaria-escuro: "#a4b2f4"
  cor-primaria-forte-escuro: "#c4cef9"
  cor-primaria-suave-escuro: "#1f2959"
  cor-sobre-primaria-escuro: "#0b1130"
  fundo-escuro: "#0b1130"
  superficie-escuro: "#121a3c"
  superficie-2-escuro: "#1a2348"
  borda-escuro: "#2a3463"
  texto-escuro: "#e7e9f3"
  texto-suave-escuro: "#a7aecb"
  sucesso-escuro: "#5ccf95"
  sucesso-suave-escuro: "#12301f"
  erro-escuro: "#ff8277"
  erro-suave-escuro: "#3b1b19"
  aviso-escuro: "#f2c14e"
  aviso-suave-escuro: "#33290f"
  area-matematica-escuro: "#ff9b5e"
  area-natureza-escuro: "#6bd17f"
  area-linguagens-escuro: "#74b9fc"
  area-humanas-escuro: "#f589b0"
typography:
  display:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "clamp(1.75rem, 5vw, 2.6rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "clamp(1.6rem, 4.5vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  title:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  body-leitura:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 700
    letterSpacing: "0.06em"
  formula:
    fontFamily: "\"Cambria Math\", \"STIX Two Math\", \"Latin Modern Math\", Cambria, Georgia, serif"
    fontSize: "1.35rem"
    lineHeight: 1.5
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.85rem"
rounded:
  codigo: "5px"
  controle: "10px"
  bloco: "12px"
  cartao: "14px"
  pilula: "999px"
spacing:
  pequeno: "8px"
  grade: "12px"
  margem: "16px"
  secao: "40px"
components:
  button-primary:
    backgroundColor: "{colors.cor-primaria}"
    textColor: "{colors.cor-sobre-primaria}"
    rounded: "{rounded.controle}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.cor-primaria-forte}"
    textColor: "{colors.cor-sobre-primaria}"
  button-secondary:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.cor-primaria}"
    rounded: "{rounded.controle}"
    padding: "10px 16px"
  button-secondary-hover:
    backgroundColor: "{colors.cor-primaria-suave}"
    textColor: "{colors.cor-primaria-forte}"
  input-busca:
    backgroundColor: "{colors.fundo}"
    textColor: "{colors.texto}"
    rounded: "{rounded.controle}"
    padding: "8px 12px"
  nav-link:
    textColor: "{colors.texto-suave}"
    rounded: "{rounded.pilula}"
    padding: "6px 12px"
  nav-link-active:
    backgroundColor: "{colors.cor-primaria-suave}"
    textColor: "{colors.cor-primaria}"
    rounded: "{rounded.pilula}"
    padding: "6px 12px"
  cartao:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.texto}"
    rounded: "{rounded.cartao}"
    padding: "16px 18px"
  alternativa:
    backgroundColor: "{colors.fundo}"
    textColor: "{colors.texto}"
    rounded: "{rounded.controle}"
    padding: "10px 14px"
  alternativa-correta:
    backgroundColor: "{colors.sucesso-suave}"
  alternativa-errada:
    backgroundColor: "{colors.erro-suave}"
  caixa-dica:
    backgroundColor: "{colors.cor-primaria-suave}"
    rounded: "{rounded.controle}"
    padding: "14px 18px"
  caixa-atencao:
    backgroundColor: "{colors.aviso-suave}"
    rounded: "{rounded.controle}"
    padding: "14px 18px"
---

# Design System: GER Resumos

## Overview

**Creative North Star: "A Sala de Estudo"**

O GER Resumos é um lugar calmo para estudar. Quem abre o site quer revisar um capítulo, fazer questões ou saber como é o próximo ano, e o design existe para não atrapalhar: o conteúdo ocupa o centro, a leitura é confortável e nada disputa a atenção com o texto. A sensação é de calma e foco, e também de confiança e organização: é material de estudo sério, mesmo sendo escrito por estudantes.

O grêmio aparece na medida certa. O logo (o escudo com "GER" em letras universitárias, a faixa "Grêmio Estudantil" e "Marista Rosário") fica no topo, e o **Marinho do Grêmio** é a única cor da marca: está nos botões, nos links e no que está selecionado. O resto é neutro, levemente azulado, para combinar com o marinho. A profundidade é em camadas: o fundo, as superfícies com conteúdo e, por cima, o que é clicável quando o mouse passa. Os componentes são firmes e simples, com formas claras, cantos levemente arredondados e ações óbvias.

O site **não** deve parecer um portal escolar burocrático (cheio de menus e tabelas cinzas), nem um app gamificado (medalhas, confete, pontos, cores berrantes), nem uma rede social (feed infinito, curtidas, notificações chamando atenção).

**Key Characteristics:**
- Conteúdo primeiro: colunas de leitura com no máximo 48rem e texto corrido a 1.05rem.
- Uma única cor de marca (o Marinho do Grêmio) para ação e seleção; o resto é neutro.
- Cores por área do conhecimento, usadas só para identificar a área.
- Profundidade em três camadas: fundo, superfície e elevação no hover.
- Tema claro e escuro com o mesmo tom; no escuro, o fundo é um marinho fechado.
- Fonte do sistema e nada carregado de fora: o site precisa funcionar offline.

## Colors

Uma paleta quase toda neutra, com um tom frio de azul, onde o Marinho do Grêmio é a única cor de marca e as cores de área e de resposta têm papéis fixos. Cada cor existe duas vezes, no tema claro e no escuro (as chaves `-escuro` acima), e tudo fica em `assets/css/tema.css`.

### Primary
- **Marinho do Grêmio** (`cor-primaria`): a cor do logo. Botões principais, links, item ativo da navegação, borda de foco e o que está selecionado. Com o mouse em cima, vira o **Marinho Aceso** (`cor-primaria-forte`), um pouco mais claro. Em fundos claros que precisam lembrar a marca (caixa de dica, painel "Onde estudar mais", item ativo) entra a **Névoa Marinha** (`cor-primaria-suave`).
- **No tema escuro**, o marinho sumiria em cima do fundo, então a cor principal vira o **Azul Lavanda** (`cor-primaria-escuro`), do mesmo tom, com texto marinho fechado por cima dos botões.

### Tertiary
- **Cores das áreas** (`area-matematica` laranja, `area-natureza` verde, `area-linguagens` azul, `area-humanas` vinho): identificam a área do conhecimento na faixa lateral dos cartões de matéria, na bolinha ao lado do nome da área, no número do capítulo e no nome da matéria acima do título.
- **Cores de resposta** (`sucesso`, `erro`, `aviso`, cada uma com a versão `-suave` para fundos): certo, errado e atenção nas questões; o aviso também marca as caixas de "Atenção" e o aviso de sem internet.

### Neutral
- **Papel Frio** (`fundo`): o fundo da página, um branco levemente azulado.
- **Folha** (`superficie`): cartões, questões, topo e rodapé. No escuro é o **Marinho de Mesa** (`superficie-escuro`), um pouco mais claro que o fundo.
- **Folha Sombreada** (`superficie-2`): cabeçalho de tabela, código, áreas de espera de vídeo e caixas "A preencher".
- **Linha de Caderno** (`borda`): bordas de cartões, campos e divisórias.
- **Tinta** (`texto`) e **Tinta Clara** (`texto-suave`): texto principal e texto de apoio (descrições, trilha de navegação, rodapé).

### Named Rules
**A Regra do Marinho Único.** O Marinho do Grêmio é a única cor de ação e de seleção. As cores de área nunca viram botão ou link, e as cores de resposta aparecem só para dar retorno (certo, errado, atenção).

**A Regra do Mesmo Tom.** O tema escuro não é um cinza genérico: o fundo, as superfícies e as bordas escuras são marinhos, e a cor principal clara tem o mesmo tom do marinho do logo.

## Typography

**Display Font:** a fonte do sistema (`system-ui`, com -apple-system, Segoe UI, Roboto, Helvetica Neue e Arial como alternativas)
**Body Font:** a mesma fonte do sistema
**Label/Mono Font:** fórmulas em Cambria Math (com STIX Two Math, Latin Modern Math, Cambria e Georgia); o pedido de correção por IA em `ui-monospace`

**Character:** uma única família, a do aparelho do aluno: carrega na hora, funciona offline e parece familiar. A hierarquia vem do tamanho e do peso, não de trocar de fonte.

### Hierarchy
- **Display** (700, `clamp(1.75rem, 5vw, 2.6rem)`, 1.25, -0.02em): só o título da página inicial.
- **Headline** (700, `clamp(1.6rem, 4.5vw, 2.25rem)`, 1.25, -0.015em): título de cada página (capítulo, ano, matéria).
- **Title** (700, 1.5rem, 1.25): seções do resumo (`##`). Subseções (`###`) usam 1.2rem; títulos de seção das páginas de navegação, 1.3rem.
- **Body** (400, 1rem, 1.6): texto da interface, questões e cartões. O texto dos resumos usa **body-leitura** (1.05rem, 1.7) em colunas de até 48rem.
- **Label** (700, 0.8rem, 0.06em, maiúsculas): rótulos curtos como "Tópicos principais", "Pontos-chave" e o nome da matéria acima do título do capítulo.

### Named Rules
**A Regra da Fonte da Casa.** O site usa a fonte do aparelho. Uma fonte própria só entra se for servida pelo próprio site, para continuar funcionando sem internet.

**A Regra dos Pesos Intermediários.** A interface usa pesos entre 550 e 750 (550 na navegação, 600 em botões e rótulos, 650 em títulos de cartão, 750 na marca e no título dos anos) para criar hierarquia sem gritar.

## Layout

Uma coluna central de até **1040px**, com margem lateral de **16px** em qualquer tela. Dentro dela, o texto de leitura (resumos, listas de capítulos, resultados de busca, questões) fica em colunas de até **48rem**, e as descrições em até 60–65 caracteres por linha.

As páginas de navegação usam grades que se ajustam sozinhas (`auto-fill`): cartões de ano a partir de 200px de largura, matérias a partir de 180px e cartões maiores a partir de 250px, com **12px** entre eles. Listas empilhadas usam **10px**. As seções da página ficam separadas por **40px**, e o fim da página tem 56px de respiro.

O topo é fixo (`sticky`), com a marca, a busca e o botão de tema numa linha de 60px e a navegação em pílulas logo abaixo, que rola para o lado no celular. No capítulo, "Tópicos principais" e "Pontos-chave" ficam lado a lado a partir de 720px e empilhados abaixo disso.

Pontos de quebra: **560px** (celular: menos espaço no topo, questões mais compactas, "anterior/próximo" empilhados) e **359px** (telas muito estreitas: o nome "GER Resumos" some e fica só o logo).

## Elevation & Depth

A profundidade é **em camadas**. O fundo é a base; tudo o que tem conteúdo (cartões, questões, listas, fórmulas, o quadro do capítulo) é uma superfície com borda fina e sombra de repouso; o que é clicável sobe mais uma camada quando o mouse passa por cima; e o topo fixo tem uma sombra própria, porque o conteúdo passa por baixo dele. As sombras do tema claro são tingidas de marinho; no escuro, são pretas e mais fortes, e a superfície também é mais clara que o fundo.

### Shadow Vocabulary
- **Repouso** (`--sombra`): `0 1px 2px rgb(25 37 90 / 8%), 0 4px 14px rgb(25 37 90 / 10%)`; no escuro, `0 1px 2px rgb(0 0 0 / 45%), 0 6px 16px rgb(0 0 0 / 40%)`. Toda superfície de conteúdo sobre o fundo.
- **Elevada** (`--sombra-elevada`): `0 4px 8px rgb(25 37 90 / 10%), 0 16px 32px rgb(25 37 90 / 16%)`; no escuro, `0 4px 8px rgb(0 0 0 / 45%), 0 18px 36px rgb(0 0 0 / 55%)`. Só com o mouse em cima de algo clicável (cartões, capítulos, anterior/próximo, resultados de busca).
- **Topo** (`--sombra-topo`): `0 1px 3px rgb(25 37 90 / 6%), 0 6px 18px rgb(25 37 90 / 7%)`; no escuro, `0 1px 3px rgb(0 0 0 / 40%), 0 6px 18px rgb(0 0 0 / 35%)`. Só o cabeçalho fixo.

### Named Rules
**A Regra das Três Camadas.** Fundo, superfície e elevada. Dentro de uma superfície tudo é plano: alternativas, botões, caixas de dica e o painel "Onde estudar mais" não têm sombra.

**A Regra da Elevação Merecida.** Só sobe de camada o que dá para clicar, e só enquanto o mouse está em cima. A mudança leva 0.15s e some para quem pediu menos movimento no aparelho.

## Shapes

Cantos levemente arredondados, mais suaves quanto maior a peça: **14px** em cartões, questões e painéis; **12px** em fórmulas, vídeos, resultados de busca e "anterior/próximo"; **10px** em botões, campos, alternativas e caixas; **5px** em código. A navegação e os selos (tipo de questão, contador) são **pílulas**. Círculos aparecem só em detalhes: a letra da alternativa, o número do capítulo, a bolinha da área e o logo.

Bordas são de 1px na cor `borda`. A exceção é a faixa de 4px à esquerda, que identifica a área nos cartões de matéria e o tipo nas caixas e resultados (dica, atenção, certo, errado). Caixas "A preencher" e vídeos ainda não indicados usam borda tracejada de 2px, para parecerem um espaço vazio.

## Components

### Buttons
Firmes e simples: forma clara, ação óbvia, sem efeito decorativo.
- **Shape:** cantos levemente arredondados (10px), padding 10px 16px, texto 600.
- **Primary:** fundo Marinho do Grêmio, texto branco. Usado para a ação principal de um bloco ("Buscar", "Corrigir com IA").
- **Hover / Focus:** o fundo passa para o Marinho Aceso; o foco tem um anel de 3px na cor principal, a 2px do botão.
- **Secondary:** fundo da superfície, borda e texto na cor principal; com o mouse em cima, fundo Névoa Marinha. Quando funciona como botão de escolha ligado (`aria-pressed`), fica igual ao primário.
- **Discreto:** só texto sublinhado na cor principal, para ações menores como "Tentar de novo".
- **Ícone:** quadrado de 40px com borda, para o botão de tema; com o mouse em cima, borda e ícone na cor principal.

### Chips
- **Style:** selo em pílula com fundo `superficie-2` e texto 0.8rem 600, para o tipo da questão ("Objetiva", "Dissertativa").
- **State:** o contador do "Onde estudar mais" é uma pílula vermelha (`erro`) com o número de tópicos a revisar.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** `superficie` sobre o `fundo`.
- **Shadow Strategy:** repouso; elevada com o mouse em cima, quando o cartão é um link (ver Elevation & Depth).
- **Border:** 1px `borda`; com o mouse em cima, a borda vira a cor principal. Cartões de matéria têm a faixa de 4px da cor da área à esquerda.
- **Internal Padding:** 16px 18px (cartões de ano: 22px 20px; quadro do capítulo: 20px 22px).

### Inputs / Fields
- **Style:** fundo `fundo` (ou `superficie` na busca grande da página inicial), borda 1px, cantos de 10px, padding 8px 12px. O texto de exemplo usa `texto-suave`.
- **Focus:** a borda vira a cor principal, com um contorno de 2px em Névoa Marinha.
- **Resposta dissertativa:** área de texto de 110px de altura mínima, que o aluno pode aumentar.

### Navigation
- **Style:** links em pílula (padding 6px 12px, 0.95rem, peso 550) na cor `texto-suave`.
- **Hover:** fundo `superficie-2` e texto `texto`.
- **Active:** página atual com fundo Névoa Marinha e texto na cor principal.
- **Celular:** a fileira rola para o lado, sem barra de rolagem visível.

### Questão
O componente mais importante do site.
- **Bloco:** superfície com cantos de 14px, sombra de repouso, padding 18px 20px (16px no celular). No topo, o número da questão, o selo do tipo e o tópico com link.
- **Alternativas:** linhas inteiras clicáveis (fundo `fundo`, cantos de 10px, padding 10px 14px), com a letra num círculo de 26px. Com o mouse em cima, borda na cor principal e fundo Névoa Marinha.
- **Respondida:** a alternativa certa fica verde (`sucesso-suave`, letra em círculo `sucesso`), a errada escolhida fica vermelha (`erro-suave`, letra em `erro`), e as outras ficam esmaecidas (65% de opacidade).
- **Resultado:** caixa abaixo das alternativas com a faixa de 4px verde, vermelha ou âmbar e a explicação; quando o aluno erra, termina com "Revise o tópico" e um link.

### Caixas do resumo
- **Dica:** fundo Névoa Marinha com faixa de 4px na cor principal.
- **Atenção:** fundo `aviso-suave` com faixa de 4px na cor `aviso`.
- **A preencher:** fundo `superficie-2` com borda tracejada de 2px, para mostrar o que o grêmio ainda vai escrever.

## Do's and Don'ts

### Do:
- **Do** usar o Marinho do Grêmio (`#19255a`) como a única cor de ação e seleção; no escuro, o Azul Lavanda (`#a4b2f4`).
- **Do** pegar cores e sombras sempre das variáveis de `assets/css/tema.css`, para os dois temas continuarem iguais.
- **Do** manter o texto de leitura em colunas de até 48rem, a 1.05rem com entrelinha 1.7.
- **Do** dar sombra de repouso a toda superfície de conteúdo e sombra elevada só ao que é clicável, com o mouse em cima.
- **Do** manter o contraste de pelo menos 4.5:1 em todo texto, nos dois temas.
- **Do** usar as cores de área só para identificar a área (faixa, bolinha, número, nome da matéria).

### Don't:
- **Don't** fazer o site parecer um portal escolar burocrático, com muitos menus e tabelas cinzas.
- **Don't** gamificar: nada de medalhas, confete, pontos ou cores berrantes.
- **Don't** usar padrões de rede social: feed infinito, curtidas ou notificações chamando atenção.
- **Don't** usar as cores de área ou de resposta em botões e links.
- **Don't** pôr sombra em elementos dentro de uma superfície (alternativas, botões, caixas).
- **Don't** carregar fontes ou outros arquivos de fora do site: ele precisa funcionar sem internet.
