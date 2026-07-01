# MonalisArt 🖼️

> Um guia de museu de bolso: explore obras reais do acervo do **Metropolitan Museum (Met)** e receba uma análise gerada pela IA **Gemini**, personalizada para o seu nível de conhecimento.

Trabalho Prático Individual — **Construção de Páginas Web II**
Instituto Federal do Sudeste de Minas Gerais, Campus Barbacena — Curso Técnico em Informática.

🔗 **App ao vivo:** https://culasss.github.io/MonalisArt-IF/

---

## 🎯 O que é e para que serve

O MonalisArt combina uma **API de terceiros** (Metropolitan Museum of Art) com a **API do Gemini** para transformar qualquer obra do acervo do Met em uma explicação clara e **personalizada**.

O usuário busca uma obra (ou clica em **"Me surpreenda"**), escolhe **para quem** é a explicação e **em que** ela deve focar, e a IA gera uma análise sob medida — como um guia de museu que fala a sua língua. É **acessibilidade cultural**: arte explicada no seu nível, inclusive para quem se sente intimidado por museus.

> ⚠️ O acervo é o do **Met** (Nova York). Obras que não estão lá — como a Mona Lisa, que fica no Louvre — não vão aparecer.

## 🤝 Como as duas APIs se combinam

Este é o coração do projeto. O **prompt enviado ao Gemini junta duas fontes**:

1. **Dados reais vindos da API do Met:** título, artista, ano e técnica da obra.
2. **Opções escolhidas pelo usuário na interface:** o nível do público (criança / leigo / conhecedor) e o foco (técnica / história / curiosidades / o que observar).

Exemplo de prompt montado em tempo real:

> *"Você é um guia de museu. Explique a obra 'Wheat Field with Cypresses' de Vincent van Gogh (1889, Oil on canvas) para um público criança, focando em técnica. Responda em português, em no máximo 3 frases curtas."*

Assim, a **mesma obra** gera **análises diferentes** conforme as escolhas do usuário — cumprindo o requisito de combinar dados da API remota com as ações do usuário no prompt.

## 🖥️ Interface — a saída não é texto puro

As respostas viram **elementos visuais**, não um bloco de texto solto:

- A obra aparece **emoldurada** (moldura de madeira feita com CSS puro).
- Os metadados viram uma **ficha de museu** estruturada.
- A análise da IA aparece como uma **plaquinha de legenda** ao lado da obra.
- Tema visual de **galeria** (paleta de madeira, parede escura, tipografia serifada).
- Layout **responsivo mobile-first**: empilha em uma coluna no celular e vira **3 colunas** (ficha | obra | análise) no desktop.

## 🔐 Segurança da chave (traga sua própria chave)

Por ser um site estático, a chave da API do Gemini **não fica no código-fonte**. O app usa o padrão **BYOK (Bring Your Own Key)**: o usuário insere a chave dele em uma tela de entrada, ela é validada contra o Google e fica **apenas na memória do navegador** — nunca no repositório.

### Como conseguir uma chave grátis
1. Acesse o **[Google AI Studio](https://aistudio.google.com/app/apikey)**.
2. Clique em **Create API key** e copie a chave.
3. Cole a chave na tela de entrada do MonalisArt e clique em **Entrar**.

## 🚀 Como executar

### Opção 1 — Online (mais fácil)
Acesse: **https://culasss.github.io/MonalisArt-IF/** e cole sua chave do Gemini.

### Opção 2 — Localmente
1. Clone o repositório:
   ```bash
   git clone https://github.com/cuLasss/MonalisArt-IF.git
   ```
2. Entre na pasta e rode um **servidor local** (o app faz requisições HTTPS, então servir por um servidor é o mais garantido):
   - **VS Code:** instale a extensão **Live Server** e clique em *"Go Live"*; **ou**
   - **Python:** `python -m http.server` e abra `http://localhost:8000`.
3. Cole sua chave do Gemini na tela de entrada.

## 🧰 Tecnologias

- **HTML, CSS e JavaScript** puros (sem frameworks).
- **[Metropolitan Museum of Art API](https://metmuseum.github.io/)** — dados e imagens das obras (grátis, sem chave).
- **[Google Gemini API](https://ai.google.dev/)** — geração da análise (modelo `gemini-2.5-flash-lite`).

## 📸 Capturas de tela

<!-- Adicione 2 prints na pasta img/ com estes nomes exatos que as imagens abaixo aparecem: -->

![Tela inicial do MonalisArt](img/tela-inicial.png)

![Obra com ficha e análise da IA](img/obra-analise.png)

## 👤 Autor

**Lucas M.** — [@cuLasss](https://github.com/cuLasss)
