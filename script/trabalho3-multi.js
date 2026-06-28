const ghibliResult = document.querySelector('#ghibliResult');
const ibgeResult = document.querySelector('#ibgeResult');
const spaceflightResult = document.querySelector('#spaceflightResult');
const loadApisBtn = document.querySelector('#loadApisBtn');
const loadingStatus = document.querySelector('#loadingStatus');

async function fetchGhibli() {
    const url = 'https://ghibliapi.vercel.app/films';
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Ghibli API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Resposta inválida da Ghibli API.');
    }

    return data[0];
}

async function fetchIbge() {
    const url = 'https://servicodados.ibge.gov.br/api/v3/noticias/?qtd=1';
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`IBGE API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.items) || data.items.length === 0 || !data.items[0].titulo) {
        throw new Error('Resposta inválida da IBGE API.');
    }

    return data.items[0];
}

async function fetchSpaceflight() {
    const url = 'https://api.spaceflightnewsapi.net/v4/articles/?format=json&limit=1';
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Spaceflight API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.results) || data.results.length === 0) {
        throw new Error('Resposta inválida da Spaceflight API.');
    }

    return data.results[0];
}

function renderGhibli(film) {
    ghibliResult.innerHTML = `
        <h3>${film.title}</h3>
        <p><strong>Diretor:</strong> ${film.director}</p>
        <p><strong>Ano:</strong> ${film.release_date}</p>
        <p>${film.description ? film.description.slice(0, 200) + '...' : 'Descrição não disponível.'}</p>
    `;
}

function renderIbge(news) {
    ibgeResult.innerHTML = `
        <h3>${news.titulo}</h3>
        <p><strong>Fonte:</strong> ${news.fonte || 'IBGE'}</p>
        <p>${news.resumo || 'Resumo não disponível.'}</p>
    `;
}

function renderSpaceflight(article) {
    spaceflightResult.innerHTML = `
        <h3>${article.title}</h3>
        <p><strong>Publicado em:</strong> ${article.published_at ? new Date(article.published_at).toLocaleDateString() : 'Data não disponível'}</p>
        <p>${article.summary || article.newsSite || 'Resumo não disponível.'}</p>
        <p><a href="${article.url}" target="_blank" rel="noopener">Ler a notícia completa</a></p>
    `;
}

function renderError(target, message) {
    target.innerHTML = `
        <div class="alert alert-danger" role="alert">
            ${message}
        </div>
    `;
}

function clearResults() {
    ghibliResult.innerHTML = '<p>Buscando dados da API...</p>';
    ibgeResult.innerHTML = '<p>Buscando dados da API...</p>';
    spaceflightResult.innerHTML = '<p>Buscando dados da API...</p>';
}

async function loadAllApis() {
    if (!loadApisBtn) return;

    loadingStatus.textContent = 'Carregando APIs...';
    loadApisBtn.disabled = true;
    clearResults();

    const results = await Promise.allSettled([
        fetchGhibli(),
        fetchIbge(),
        fetchSpaceflight()
    ]);

    const [ghibliResultSettled, ibgeResultSettled, spaceflightResultSettled] = results;

    if (ghibliResultSettled.status === 'fulfilled') {
        renderGhibli(ghibliResultSettled.value);
    } else {
        renderError(ghibliResult, `Erro Ghibli: ${ghibliResultSettled.reason.message || ghibliResultSettled.reason}`);
        console.error('Ghibli error:', ghibliResultSettled.reason);
    }

    if (ibgeResultSettled.status === 'fulfilled') {
        renderIbge(ibgeResultSettled.value);
    } else {
        renderError(ibgeResult, `Erro IBGE: ${ibgeResultSettled.reason.message || ibgeResultSettled.reason}`);
        console.error('IBGE error:', ibgeResultSettled.reason);
    }

    if (spaceflightResultSettled.status === 'fulfilled') {
        renderSpaceflight(spaceflightResultSettled.value);
    } else {
        renderError(spaceflightResult, `Erro Spaceflight: ${spaceflightResultSettled.reason.message || spaceflightResultSettled.reason}`);
        console.error('Spaceflight error:', spaceflightResultSettled.reason);
    }

    const allSuccess = results.every((item) => item.status === 'fulfilled');
    loadingStatus.textContent = allSuccess ? 'Dados carregados com sucesso.' : 'Alguns dados não puderam ser carregados.';
    loadApisBtn.disabled = false;
}

if (loadApisBtn) {
    loadApisBtn.addEventListener('click', loadAllApis);
}
