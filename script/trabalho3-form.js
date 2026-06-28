const form = document.getElementById("translationForm");
const sourceText = document.getElementById("sourceText");
const targetLang = document.getElementById("targetLang");
const result = document.getElementById("translationResult");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = sourceText.value.trim();

    if (!text) {
        result.innerHTML = "Digite um texto.";
        return;
    }

    result.innerHTML = "Traduzindo...";

    try {
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=pt|${targetLang.value}`
        );

        const data = await response.json();

        result.innerHTML = `
            <strong>Tradução:</strong>
            <p>${data.responseData.translatedText}</p>
        `;
    } catch (erro) {
        result.innerHTML = "Erro ao traduzir.";
        console.error(erro);
    }
});