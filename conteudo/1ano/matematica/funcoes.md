```pontos-chave
- Uma função associa **cada** elemento do domínio a **um único** elemento do contradomínio.
- **Domínio** são os valores que podem entrar; **imagem** são os valores que realmente saem.
- **Função afim**, f(x) = ax + b: o gráfico é uma reta. O **a** é a taxa de variação (inclinação) e o **b** é onde a reta corta o eixo y.
- **Função quadrática**, f(x) = ax² + bx + c: o gráfico é uma parábola. Se a > 0, ela é virada para cima; se a < 0, para baixo.
- As **raízes** (ou zeros) são os valores de x em que f(x) = 0. Na quadrática, o **Δ** diz quantas raízes reais existem.
```

## O que é uma função

Uma **função** é uma regra que liga cada elemento de um conjunto A (de "entrada") a **exatamente um** elemento de um conjunto B (de "saída"). Escrevemos f: A → B.

Pense numa padaria em que cada pão custa R$ 0,80. Para cada quantidade de pães existe **um único** preço a pagar. O preço é uma função da quantidade:

f(x) = 0,8x, em que x é o número de pães.

Para comprar 5 pães: f(5) = 0,8 · 5 = R$ 4,00.

A fórmula f(x) = 0,8x se chama **lei de formação** da função. Calcular f(5) é "aplicar" a função no número 5; o resultado, 4, é a **imagem** de 5.

```atencao
Uma relação **não** é função quando:
- algum elemento de A fica **sem** correspondente em B; ou
- algum elemento de A tem **dois ou mais** correspondentes em B.

Já o contrário pode: dois elementos diferentes de A podem ter a mesma imagem.
```

```video
titulo: O que é uma função (introdução)
link:
```

## Domínio, contradomínio e imagem

- **Domínio** (D): o conjunto A, ou seja, todos os valores que podem entrar na função.
- **Contradomínio** (CD): o conjunto B, onde as saídas "podem cair".
- **Imagem** (Im): os valores de B que realmente são atingidos. A imagem é sempre uma parte do contradomínio.

**Exemplo:** A = {1, 2, 3}, B = {0, 1, 2, …, 10} e f(x) = 2x.

| x (domínio) | f(x) = 2x |
|---|---|
| 1 | 2 |
| 2 | 4 |
| 3 | 6 |

Então D = {1, 2, 3}, CD = {0, 1, …, 10} e Im = {2, 4, 6}.

### Domínio com restrições

Quando a função é dada só pela fórmula, o domínio são todos os números reais **para os quais a conta existe**. Os casos mais comuns:

- **Divisão:** o denominador não pode ser zero. Em f(x) = 1 / (x − 2), precisamos de x ≠ 2.
- **Raiz quadrada:** nos reais, não existe raiz quadrada de número negativo. Em f(x) = √(x − 1), precisamos de x − 1 ≥ 0, ou seja, x ≥ 1.

## Função afim

A **função afim** (ou do 1º grau) tem a forma:

f(x) = ax + b, com a ≠ 0 (se a = 0, temos a função constante f(x) = b).

- **a** é o **coeficiente angular**, ou **taxa de variação**: quanto f(x) muda quando x aumenta 1 unidade.
- **b** é o **coeficiente linear**: é o valor de f(0), o ponto onde a reta corta o eixo y.

O gráfico é sempre uma **reta**:

- se **a > 0**, a função é **crescente** (a reta sobe);
- se **a < 0**, a função é **decrescente** (a reta desce).

A **raiz** (onde a reta corta o eixo x) é o valor de x que faz f(x) = 0:

ax + b = 0 → x = −b/a

**Exemplo:** um táxi cobra R$ 5,00 de bandeirada mais R$ 2,50 por quilômetro. O preço de uma corrida de x km é f(x) = 2,5x + 5. Uma corrida de 10 km custa f(10) = 2,5 · 10 + 5 = R$ 30,00.

### Achando a função a partir de dois pontos

Se a reta passa por (x₁, y₁) e (x₂, y₂):

1. Calcule a = (y₂ − y₁) / (x₂ − x₁).
2. Substitua um dos pontos em y = ax + b para achar b.

**Exemplo:** pontos (1, 3) e (3, 7). Então a = (7 − 3) / (3 − 1) = 2. Usando (1, 3): 3 = 2 · 1 + b, logo b = 1. A função é f(x) = 2x + 1.

```dica
Em problemas do dia a dia, o **b** costuma ser o valor fixo (taxa, matrícula, bandeirada) e o **a** é o valor que se repete por unidade (por km, por mês, por produto).
```

## Função quadrática

A **função quadrática** (ou do 2º grau) tem a forma:

f(x) = ax² + bx + c, com a ≠ 0.

O gráfico é uma **parábola**:

- se **a > 0**, a concavidade é **para cima** (formato de U);
- se **a < 0**, a concavidade é **para baixo** (formato de ∩);
- o **c** é o ponto onde a parábola corta o eixo y, porque f(0) = c.

### Raízes e o discriminante (Δ)

As raízes são as soluções de ax² + bx + c = 0. Use a **fórmula de Bhaskara**:

Δ = b² − 4ac  e  x = (−b ± √Δ) / 2a

O sinal do **Δ** diz quantas raízes reais a função tem:

| Δ | Raízes reais | O que a parábola faz |
|---|---|---|
| Δ > 0 | duas, diferentes | corta o eixo x em dois pontos |
| Δ = 0 | uma (duas iguais) | só encosta no eixo x, no vértice |
| Δ < 0 | nenhuma | não toca o eixo x |

**Exemplo:** f(x) = x² − 5x + 6. Temos a = 1, b = −5, c = 6.
Δ = (−5)² − 4 · 1 · 6 = 25 − 24 = 1, então x = (5 ± 1) / 2, ou seja, x = 3 ou x = 2.

```dica
**Soma e produto:** as raízes de ax² + bx + c = 0 têm soma −b/a e produto c/a. No exemplo acima, a soma é 5 e o produto é 6: os números são 2 e 3. Às vezes dá para achar as raízes de cabeça, sem Bhaskara!
```

### Vértice: ponto de máximo ou de mínimo

O **vértice** é o ponto mais baixo (se a > 0) ou mais alto (se a < 0) da parábola:

x<sub>v</sub> = −b / 2a  e  y<sub>v</sub> = −Δ / 4a

- Se **a > 0**, y<sub>v</sub> é o **valor mínimo** da função.
- Se **a < 0**, y<sub>v</sub> é o **valor máximo** da função.

**Exemplo:** em f(x) = x² − 5x + 6, x<sub>v</sub> = 5/2 = 2,5 e y<sub>v</sub> = −1/4 = −0,25. Como a > 0, o menor valor que a função atinge é −0,25.

```video
titulo: Função quadrática: raízes, vértice e gráfico
link:
```

## Questões

```questao
topico: O que é uma função
pergunta: Qual das relações abaixo, de A = {1, 2, 3} em B = {a, b, c}, **não** é uma função?
a) {(1, a), (2, b), (3, c)}
b) {(1, a), (2, a), (3, a)}
c) {(1, a), (1, b), (2, c), (3, c)}
d) {(1, c), (2, b), (3, a)}
resposta: c
explicacao: Na alternativa C, o elemento 1 está ligado a dois elementos de B (a e b). Numa função, cada elemento do domínio tem **uma única** imagem. Na alternativa B, todos vão para "a", e isso pode.
```

```questao
topico: Domínio, contradomínio e imagem
pergunta: Qual é o domínio, nos números reais, da função f(x) = √(x − 4)?
a) x ≥ 4
b) x > 4
c) x ≤ 4
d) Todos os números reais
resposta: a
explicacao: Não existe raiz quadrada real de número negativo, então x − 4 ≥ 0, ou seja, x ≥ 4. O 4 entra, porque √0 = 0.
```

```questao
topico: Função afim
pergunta: Um táxi cobra R$ 6,00 de bandeirada mais R$ 3,00 por quilômetro rodado. Quanto custa uma corrida de 8 km?
a) R$ 24,00
b) R$ 30,00
c) R$ 27,00
d) R$ 48,00
resposta: b
explicacao: A função é f(x) = 3x + 6. Para x = 8: f(8) = 3 · 8 + 6 = 24 + 6 = R$ 30,00. Quem marcou R$ 24,00 esqueceu a bandeirada.
```

```questao
topico: Função afim
pergunta: A reta que passa pelos pontos (0, 2) e (2, 8) é o gráfico de qual função?
a) f(x) = 3x + 2
b) f(x) = 2x + 3
c) f(x) = 4x + 2
d) f(x) = 3x − 2
resposta: a
explicacao: a = (8 − 2) / (2 − 0) = 6 / 2 = 3. Como a reta passa por (0, 2), b = 2. Logo f(x) = 3x + 2.
```

```questao
topico: Função quadrática
pergunta: Quais são as raízes de f(x) = x² − 6x + 8?
a) 2 e 4
b) −2 e −4
c) 1 e 8
d) A função não tem raízes reais.
resposta: a
explicacao: Δ = (−6)² − 4 · 1 · 8 = 36 − 32 = 4. Então x = (6 ± 2) / 2, que dá 4 ou 2. Conferindo por soma e produto: 2 + 4 = 6 e 2 · 4 = 8.
```

```questao
topico: Função quadrática
pergunta: Uma bola é chutada para cima e sua altura, em metros, é dada por h(t) = −t² + 4t, com t em segundos. Qual é a altura máxima que a bola atinge?
a) 2 m
b) 4 m
c) 8 m
d) 16 m
resposta: b
explicacao: Como a = −1 < 0, a parábola é virada para baixo e o vértice é o ponto de máximo. t<sub>v</sub> = −4 / (2 · (−1)) = 2 s, e h(2) = −4 + 8 = 4 m. Quem marcou 2 m achou o **tempo** do vértice, e não a altura.
```

```questao
tipo: dissertativa
topico: Função afim
pergunta: Uma academia cobra R$ 50,00 de matrícula e R$ 80,00 por mês. Escreva a lei da função que dá o total pago depois de x meses e explique o que significam os coeficientes **a** e **b** nesse caso.
resposta: f(x) = 80x + 50. O coeficiente a = 80 é a taxa de variação: o total aumenta R$ 80,00 a cada mês. O coeficiente b = 50 é o valor fixo (a matrícula), que é pago mesmo com x = 0.
criterios:
- Escreve a lei correta: f(x) = 80x + 50.
- Explica que a = 80 é o quanto o total aumenta por mês.
- Explica que b = 50 é o valor fixo/inicial (matrícula).
```

```questao
tipo: dissertativa
topico: Função quadrática
pergunta: Explique, com suas palavras, como o sinal do discriminante (Δ) indica quantas raízes reais uma função quadrática tem. Dê um exemplo de um dos casos.
resposta: O discriminante é Δ = b² − 4ac. Se Δ > 0, a função tem duas raízes reais diferentes e a parábola corta o eixo x em dois pontos. Se Δ = 0, tem uma raiz real (duas iguais) e a parábola só encosta no eixo x, no vértice. Se Δ < 0, não tem raízes reais e a parábola não toca o eixo x. Exemplo: em f(x) = x² − 4, Δ = 0² − 4 · 1 · (−4) = 16 > 0, e as raízes são 2 e −2.
criterios:
- Cita a fórmula Δ = b² − 4ac.
- Explica os três casos: Δ > 0, Δ = 0 e Δ < 0.
- Relaciona cada caso com o número de raízes (ou com o gráfico tocando o eixo x).
- Dá um exemplo com a conta certa.
```
