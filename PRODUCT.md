# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Principal: alunos do Ensino Médio da escola do Grêmio Estudantil Rosariense (GER).** O site é pensado para eles. Estudantes de outras escolas podem usar, mas não são o público para quem as decisões são tomadas (as páginas "Como é o ano" descrevem a rotina dessa escola).

Situações de uso:

- **Estudar para prova:** revisar um capítulo rápido, fazer questões, descobrir o que precisa revisar.
- **Chegar preparado ao próximo ano:** o aluno do 9º ano quer saber como é o 1º, o do 1º quer saber como é o 2º, e assim por diante.

Usam **celular e computador em proporção parecida**.

**Secundário: membros do grêmio que escrevem o conteúdo.** Não sabem programar; escrevem em Markdown seguindo o [CONTRIBUINDO.md](CONTRIBUINDO.md).

## Product Purpose

Site de resumos e questões para o Ensino Médio, feito pelo Grêmio Estudantil Rosariense. Começou para cada turma saber como é o ano seguinte e virou um lugar para estudar o ano todo.

Sucesso é o aluno conseguir revisar o essencial de um capítulo em pouco tempo, praticar com questões, saber exatamente o que revisar quando erra e chegar ao próximo ano sabendo o que esperar.

## Positioning

Feito por alunos da própria escola para alunos da própria escola: o conteúdo segue o que é dado em aula, e os relatos de "Como é o ano" vêm de quem já passou por aquele ano na escola. É gratuito, não pede conta e não coleta dados: as respostas ficam salvas só no aparelho do aluno.

## Operating Context

- O aluno abre o site para revisar antes de prova, para fazer questões ou para ler sobre o próximo ano.
- Depois de aberto uma vez, o site funciona sem internet e pode ser instalado no celular.
- Questões dissertativas são corrigidas fora do site: o botão "Corrigir com IA" monta um pedido completo que o aluno cola no ChatGPT, Gemini ou Claude.
- O conteúdo é escrito por alunos do grêmio em arquivos `.md`, conferido com um professor antes de publicar e listado em `conteudo/indice.json`.
- Hospedado no GitHub Pages.

## Capabilities and Constraints

**O que o site faz:**

- Navegação ano → área → matéria → capítulo: 3 anos; 4 áreas (Matemática, Ciências da Natureza, Linguagens, Ciências Humanas); 11 matérias.
- Capítulo com tópicos principais (gerados a partir dos títulos `##`), pontos-chave, vídeos do YouTube, caixas de dica e de atenção.
- Questões objetivas (resposta na hora, com explicação) e dissertativas (comparar com a resposta esperada e se autoavaliar, ou "Corrigir com IA").
- "Onde estudar mais": cada questão é ligada a um tópico; os erros ficam salvos no aparelho e a página lista os tópicos do mais errado para o menos errado.
- Páginas "Como é o ano" (1º, 2º e 3º), folha de fórmulas imprimível, busca em todos os resumos, modo escuro e modo offline.

**Restrições técnicas:**

- Site estático: HTML, CSS e JavaScript puros, sem etapa de build, sem servidor, sem banco de dados e sem chave de API paga.
- Leitor de Markdown vendorizado (`assets/vendor/marked.umd.js`, marked 18.0.14).
- Para testar no computador, precisa de um servidor local (`python3 -m http.server 8000`).

**Termos usados no site:** capítulo, tópico, tópicos principais, pontos-chave, dica, atenção, "Onde estudar mais", "Corrigir com IA", "A preencher pelo grêmio".

**Ideias ainda não decididas** (listadas no README, não são compromissos): provas e datas de trabalhos por turma via Planilha Google, correção por IA dentro do site, flashcards com revisão espaçada, simulados com cronômetro, progresso por capítulo e botão "sugerir correção".

## Brand Commitments

- **Nome:** GER Resumos. GER significa **Grêmio Estudantil Rosariense**.
- **Identidade visual oficial:** o grêmio tem logo e cores oficiais, e o site deve segui-los. As cores (`assets/css/tema.css`) e o logo (`assets/img/logo.svg`, `assets/img/icone-*.png`) que estão no código hoje são provisórios e serão trocados pela identidade oficial.
- **Voz (como aparece no site hoje):** português do Brasil, direto, de aluno para aluno ("feito por alunos, para alunos"), e honesto sobre os limites ("os resumos são escritos por estudantes e podem ter erros").

## Evidence on Hand

- **Capítulos escritos:** Matemática do 1º ano, "Funções" (`conteudo/1ano/matematica/funcoes.md`); Biologia do 1º ano, "Citologia: a célula" (`conteudo/1ano/biologia/citologia.md`).
- **Folha de fórmulas:** `conteudo/formulas.md`.
- **Páginas "Como é o ano":** `conteudo/como-e/1ano.md`, `2ano.md` e `3ano.md` têm só a estrutura, com blocos "A preencher". **Ainda não há nenhum depoimento nem dica real.** Não inventar depoimentos, nomes, turmas, dicas, número de alunos ou resultados.

## Product Principles

1. **Revisar rápido vem primeiro.** O essencial de um capítulo precisa caber em um minuto de leitura (pontos-chave e tópicos principais no topo).
2. **Todo erro aponta o que estudar.** Questão sem tópico ligado não ajuda o aluno a melhorar.
3. **Gratuito, sem conta, sem servidor.** Nada sai do aparelho do aluno, e nenhuma função depende de back-end ou de chave paga.
4. **Quem escreve não precisa programar.** O Markdown e os blocos especiais são a interface de quem escreve; uma mudança no site não pode deixar esse formato mais difícil.
5. **Honestidade sobre o conteúdo.** É material de estudante, que pede conferência com a aula; o que falta aparece como "A preencher", nunca como texto inventado.
