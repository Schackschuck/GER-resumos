# Como escrever conteúdo para o GER Resumos

Este guia é para quem vai **escrever resumos e questões**. Não precisa saber programar: os resumos são arquivos de texto no formato [Markdown](https://www.markdownguide.org/basic-syntax/) e o site monta as páginas sozinho.

## 1. Criar o arquivo do capítulo

Copie o arquivo [`conteudo/_modelo-capitulo.md`](conteudo/_modelo-capitulo.md) para a pasta do ano e da matéria:

```
conteudo/<ano>ano/<matéria>/<id-do-capítulo>.md
```

Exemplo: `conteudo/1ano/fisica/cinematica.md`

- O **id** do capítulo vai no nome do arquivo e no endereço do site. Use letras minúsculas, sem acento e com hífen no lugar de espaço (`leis-de-newton`, e não `Leis de Newton`).
- Os ids das matérias são: `matematica`, `biologia`, `quimica`, `fisica`, `portugues`, `redacao`, `literatura`, `historia`, `geografia`, `sociologia` e `filosofia`.

## 2. Colocar o capítulo no índice

Abra [`conteudo/indice.json`](conteudo/indice.json) e adicione o capítulo na lista `"capitulos"`, na ordem em que ele deve aparecer:

```json
{
  "ano": "1",
  "materia": "fisica",
  "id": "cinematica",
  "titulo": "Cinemática",
  "descricao": "Velocidade, aceleração, MU e MUV."
}
```

> Cuidado com as vírgulas: cada `{ ... }` é separado do próximo por vírgula, mas o último da lista **não** tem vírgula depois. Se o site mostrar "o arquivo conteudo/indice.json tem um erro de formatação", é quase sempre isso.

O título do capítulo vem do índice, então **não** precisa colocar `# Título` no arquivo.

## 3. Escrever o resumo

| Você escreve | Aparece no site |
|---|---|
| `## Função afim` | Título de seção. Cada `##` vira um item dos **Tópicos principais** |
| `### Achando a raiz` | Subtítulo |
| `**palavra**` | **negrito** |
| `*palavra*` | *itálico* |
| `- item` | lista |
| `1. item` | lista numerada |
| `[texto](https://...)` | link |
| `x<sup>2</sup>` | x² (sobrescrito) |
| `H<sub>2</sub>O` | H₂O (subscrito) |

Tabelas:

```
| Coluna 1 | Coluna 2 |
|---|---|
| valor | valor |
```

### Símbolos para copiar e colar

² ³ ⁿ · ₀ ₁ ₂ ₙ · √ · Δ · ± · × · ÷ · ≠ · ≈ · ≤ · ≥ · → · ⇌ · π · ° · ∞ · α · β · θ · λ · µ

## 4. Blocos especiais

Os blocos especiais são escritos entre três crases, com o nome do bloco logo depois das crases de abertura.

### Pontos-chave (aparecem no topo do capítulo)

````
```pontos-chave
- A ideia mais importante do capítulo.
- Outra ideia importante.
```
````

Coloque de 3 a 5 frases curtas: é o que o aluno lê para revisar em 1 minuto antes da prova.

### Vídeo

````
```video
titulo: Nome do vídeo
link: https://www.youtube.com/watch?v=XXXXXXXXXXX
```
````

- Links do YouTube viram um vídeo dentro da página. Outros links viram um botão "Assistir".
- Se ainda não tiver o vídeo, deixe `link:` vazio: aparece um espaço "Vídeo a ser indicado".

### Dica e atenção

````
```dica
Um macete para lembrar.
```

```atencao
Uma pegadinha comum em prova.
```
````

### Questão objetiva

````
```questao
topico: Função afim
pergunta: Quanto custa uma corrida de 8 km?
a) R$ 24,00
b) R$ 30,00
c) R$ 27,00
d) R$ 48,00
resposta: b
explicacao: f(8) = 3 · 8 + 6 = 30.
```
````

- `resposta:` é a **letra** da alternativa certa.
- `explicacao:` aparece depois que o aluno responde. Explique o porquê e, se der, o erro mais comum.

### Questão dissertativa

````
```questao
tipo: dissertativa
topico: Função quadrática
pergunta: Explique o que o Δ indica.
resposta: A resposta que o professor esperaria.
criterios:
- O que a resposta precisa ter.
- Outro item obrigatório.
```
````

- O aluno escreve a resposta e pode ver a `resposta:` esperada e os `criterios:`.
- O botão **Corrigir com IA** monta um texto com a pergunta, a resposta esperada, os critérios e a resposta do aluno, e o aluno cola esse texto no ChatGPT, Gemini ou Claude. Quanto melhores os critérios, melhor a correção.

### O campo `topico:` é importante

É ele que faz o **"Onde estudar mais"** funcionar: quando o aluno erra, o site mostra o tópico e um link direto para ele.

- Escreva o `topico:` **igual** ao título `##` (ou `###`) da seção. Exemplo: `topico: Função afim` liga com `## Função afim`.
- Se o texto não bater com nenhum título, o tópico aparece, mas sem link.

### Regras do formato `campo: valor`

- Cada campo começa no início da linha: `pergunta:`, `resposta:`, `explicacao:`, `criterios:`, `topico:`, `tipo:`.
- Um campo pode ter várias linhas: tudo até o próximo campo faz parte dele.
- As alternativas são as linhas que começam com `a)`, `b)`, `c)`, `d)` ou `e)`. Por isso, dentro de uma explicação, não comece uma linha com "a)".
- Se faltar alguma coisa (sem `pergunta:` ou sem `resposta:`), o site mostra uma caixa vermelha dizendo o que está errado.

### Fórmulas (usado em `conteudo/formulas.md`)

````
```formula
nome: Velocidade média
formula: vₘ = Δs / Δt
onde:
- **Δs**: deslocamento (m)
- **Δt**: intervalo de tempo (s)
```
````

### A preencher

````
```preencher
O que ainda falta escrever nesta parte.
```
````

Aparece como uma caixa tracejada "A preencher pelo grêmio". Use enquanto a página não estiver pronta e apague quando escrever o texto de verdade.

## 5. Testar no computador

O site não abre clicando duas vezes no `index.html`: ele precisa de um servidor local. Na pasta do projeto, rode **um** destes comandos:

```bash
python3 -m http.server 8000
# ou
npx http-server -p 8000
```

E abra <http://localhost:8000>. Depois de mudar um arquivo, é só recarregar a página.

## 6. Cuidados com o conteúdo

- **Escreva com suas palavras.** Não copie textos de livros, apostilas ou sites: eles têm direitos autorais.
- **Confira com um professor** antes de publicar, principalmente as respostas das questões.
- **Vídeos:** use só o link (o vídeo continua no YouTube). Prefira canais educativos conhecidos.
- **Depoimentos** (páginas "Como é o ano"): só com autorização de quem falou, e use apenas o primeiro nome e a turma.
