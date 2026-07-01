
// ---------- Constantes / configuração ----------
const API_MET = "https://collectionapi.metmuseum.org/public/collection/v1";

// Gemini — a chave é fornecida pelo usuário no portão de entrada
let GEMINI_KEY = "";
const GEMINI_MODELO = "gemini-2.5-flash-lite";

// ---------- Elementos da página ----------
const inputBusca = document.getElementById("searchInput");
const botaoSurpresa = document.getElementById("surpriseButton");
const imgObra = document.getElementById("artworksContainer");
const placaEsquerda = document.querySelector(".placa-esquerda");
const placaDireita = document.querySelector(".placa-direita");


// =========================================================
//  MARCO 1 — mostrar uma obra na tela (ainda sem Gemini)
// =========================================================

// Busca pelo termo e devolve a primeira obra QUE TENHA imagem.
// No Met a busca é em 2 passos: 1) pegar os IDs  2) pegar os dados de um objeto.
async function buscarObra(termo) {
    // 1) buscar os IDs das obras (só as que têm imagem)
    const respBusca = await fetch(`${API_MET}/search?q=${encodeURIComponent(termo)}&hasImages=true`);
    const dadosBusca = await respBusca.json();
    if (!dadosBusca.objectIDs) return null;   // não achou nada

    // 2) pegar os dados do 1º objeto que realmente tenha imagem
    for (const id of dadosBusca.objectIDs.slice(0, 10)) {
        const respObj = await fetch(`${API_MET}/objects/${id}`);
        const obra = await respObj.json();
        if (obra.primaryImageSmall) return obra;
    }
    return null;
}

// (a montarUrlImagem foi removida: o Met já entrega a URL pronta em obra.primaryImageSmall)

// Coloca a obra na moldura e preenche a placa esquerda (a "ficha").
function exibirObra(obra) {
    // colocar a imagem na moldura (o Met já dá a URL pronta)
    imgObra.src = obra.primaryImageSmall;
    // preencher a ficha da obra na placa esquerda
    document.getElementById("fichaConteudo").innerHTML = `<h2>${obra.title || "Não disponível"}</h2>
    <p><strong>Artista:</strong> ${obra.artistDisplayName || "Não disponível"}</p>
    <p><strong>Ano:</strong> ${obra.objectDate || "Não disponível"}</p>
    <p><strong>Técnica:</strong> ${obra.medium || "Não disponível"}</p>`;
}


// =========================================================
//  MARCO 2 — botão "Me surpreenda"
// =========================================================

// Sorteia uma obra aleatória do acervo do Met e a devolve.
async function sortearObra() {
    // termos variados pra dar variedade no sorteio
    const termos = ["painting", "portrait", "landscape", "flowers", "animals", "sculpture", "gold", "sea", "night", "garden"];
    const termo = termos[Math.floor(Math.random() * termos.length)];

    // busca os IDs (só com imagem)
    const resp = await fetch(`${API_MET}/search?q=${termo}&hasImages=true`);
    const dados = await resp.json();
    if (!dados.objectIDs) return sortearObra();   // deu vazio, tenta outro termo

    // escolhe um ID aleatório da lista e pega os dados
    const idAleatorio = dados.objectIDs[Math.floor(Math.random() * dados.objectIDs.length)];
    const respObj = await fetch(`${API_MET}/objects/${idAleatorio}`);
    const obra = await respObj.json();

    // se por acaso não tiver imagem, sorteia de novo
    if (!obra.primaryImageSmall) return sortearObra();
    return obra;
}


// =========================================================
//  MARCO 3 — análise do Gemini
// =========================================================

// Lê as opções que o usuário marcou na interface.
function lerOpcoes() {
    return {
        nivel: document.getElementById("nivel").value,
        foco: document.getElementById("foco").value
    };
}

// Junta os dados reais da obra + as opções do usuário num texto (o prompt).
function montarPrompt(obra, opcoes) {
    return `Você é um guia de museu. Explique a obra '${obra.title}' de ${obra.artistDisplayName || "desconhecido"} (${obra.objectDate || "data desconhecida"}, ${obra.medium || "técnica desconhecida"}) para um público ${opcoes.nivel}, focando em ${opcoes.foco}. Responda em português, em no máximo 3 frases curtas. Não use asteriscos nem markdown.`;
}

// Envia o prompt pro Gemini e devolve o texto da resposta.
async function pedirAnaliseGemini(prompt) {
    exibirAnalise("Analisando a obra…");   // feedback enquanto o Gemini responde
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODELO}:generateContent?key=${GEMINI_KEY}`;
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    })
    .then(resposta => resposta.json())
    .then(dados => {
        const texto = dados.candidates[0].content.parts[0].text;
        exibirAnalise(texto);
    })
    .catch(erro => {
        console.error("Erro ao chamar o Gemini:", erro);
        exibirAnalise("Desculpe, não foi possível obter a análise do Gemini.");
    });
}

// Preenche a placa direita com a análise.
function exibirAnalise(texto) {
    // tira asteriscos de markdown que o modelo às vezes manda + troca quebras de linha por <br>
    const limpo = texto.replace(/\*/g, "").replace(/\n/g, "<br>");
    document.getElementById("analiseConteudo").innerHTML = limpo;
}


// =========================================================
//  LIGAÇÕES — o que dispara o quê
// =========================================================

// Enter no campo de busca
inputBusca.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;
    const termo = inputBusca.value.trim();
    if (!termo) return;

    const obra = await buscarObra(termo);
    if (!obra) return;              // não achou obra com imagem
    exibirObra(obra);

    // pede a análise ao Gemini (a própria função exibe quando a resposta chega)
    pedirAnaliseGemini(montarPrompt(obra, lerOpcoes()));
});

// Clique no "Me surpreenda"
botaoSurpresa.addEventListener("click", async () => {
    const obra = await sortearObra();
    if (!obra) return;
    exibirObra(obra);

    // pede a análise ao Gemini (a própria função exibe quando a resposta chega)
    pedirAnaliseGemini(montarPrompt(obra, lerOpcoes()));
});


// =========================================================
//  PORTÃO — valida a chave do Gemini e libera o app
//  (essa parte já vem pronta e funcionando)
// =========================================================
const inputChave = document.getElementById("inputChave");
const botaoEntrar = document.getElementById("botaoEntrar");
const portaoErro = document.getElementById("portaoErro");

// Testa a chave chamando um endpoint LEVE do Gemini (a lista de modelos).
// Chave válida -> resposta 200 (ok=true). Chave errada -> erro (ok=false).
async function validarChave(chave) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${chave}`;
    try {
        const resposta = await fetch(url);
        return resposta.ok;          // true se o status for 200-299
    } catch {
        return false;                // sem internet / erro de rede
    }
}

// Valida e, se estiver certa, guarda a chave e revela o app.
async function entrar() {
    const chave = inputChave.value.trim();
    if (!chave) { portaoErro.textContent = "Cole uma chave primeiro."; return; }

    botaoEntrar.disabled = true;
    botaoEntrar.textContent = "Validando…";
    portaoErro.textContent = "";

    const ok = await validarChave(chave);

    if (ok) {
        GEMINI_KEY = chave;                          // guarda pra usar nas consultas
        document.body.classList.remove("travado");   // 🎉 libera o app
    } else {
        portaoErro.textContent = "Chave inválida. Confira e tente de novo.";
        botaoEntrar.disabled = false;
        botaoEntrar.textContent = "Entrar";
    }
}

botaoEntrar.addEventListener("click", entrar);
inputChave.addEventListener("keydown", (e) => {
    if (e.key === "Enter") entrar();
});
