class Prove {
    nome;
    questoes;
    correta;

    constructor(nome, questoes, correta) {
        this.nome = nome;
        this.questoes = questoes;
        this.correta = correta;
    }
}

let perguntas = [];

async function carregarPerguntas() {
    try {
        const response = await fetch('../data/prova.json');

        if (!response.ok) {
            throw new Error(`Falha ao carregar arquivo JSON: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data || !Array.isArray(data.perguntas)) {
            throw new Error('Arquivo JSON da prova não está no formato esperado.');
        }

        perguntas = data.perguntas.map((item) => new Prove(item.nome, item.questoes, item.correta));
    } catch (error) {
        console.error(error);
        perguntas = [];
    }
}

class MyProve extends HTMLElement {
    acertos = 0;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.renderLoading();
        carregarPerguntas().then(() => this.render());
    }

    renderLoading() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    box-sizing: border-box;
                }

                .loading {
                    padding: 1.5rem;
                    border-radius: 12px;
                    background: #f8f9fa;
                    border: 1px solid #ced4da;
                    text-align: center;
                    color: #495057;
                }
            </style>

            <div class="loading">
                Carregando os dados da prova...
            </div>
        `;
    }

    render() {
        if (perguntas.length === 0) {
            this.renderError();
            return;
        }

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    font-family: Arial, sans-serif;
                    display: block;
                    max-width: 800px;
                    margin: auto;
                    padding: 20px;
                    box-sizing: border-box;
                }

                h1 {
                    text-align: center;
                    color: #333;
                }

                .questao {
                    margin-bottom: 20px;
                    padding: 15px;
                    border-radius: 12px;
                    background: #f4f4f4;
                    border: 1px solid #ccc;
                }

                h3 {
                    margin-top: 0;
                }

                label {
                    display: block;
                    margin: 8px 0;
                    cursor: pointer;
                }

                input[type="radio"] {
                    margin-right: 8px;
                }

                button {
                    padding: 12px 18px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-top: 10px;
                }

                #finalizar {
                    background: green;
                    color: white;
                }

                #reiniciar {
                    background: crimson;
                    color: white;
                    display: none;
                }

                #resultadoFinal {
                    margin-top: 25px;
                }

                .resultadoQuestao {
                    margin-top: 15px;
                    padding: 10px;
                    border-radius: 10px;
                    background: #eaeaea;
                }

                @media (max-width: 600px) {
                    :host {
                        padding: 10px;
                    }

                    h1 {
                        font-size: 24px;
                    }

                    button {
                        width: 100%;
                    }

                    .questao {
                        padding: 12px;
                    }
                }
            </style>

            <h1>💻 Prova Meme de Programação</h1>

            ${perguntas.map((p, index) => `
                <div class="questao">
                    <h3>${index + 1}. ${p.nome}</h3>
                    ${p.questoes.map((q, qIndex) => `
                        <label for="q${index}_${qIndex}">
                            <input type="radio" id="q${index}_${qIndex}" name="questao${index}" value="${q}">
                            ${q}
                        </label>
                    `).join('')}
                </div>
            `).join('')}

            <button id="finalizar">Finalizar Prova</button>
            <button id="reiniciar">Refazer Prova</button>
            <div id="resultadoFinal"></div>
        `;

        this.eventos();
    }

    renderError() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: auto;
                    padding: 20px;
                    box-sizing: border-box;
                    color: #842029;
                }

                .error-box {
                    padding: 1.5rem;
                    background: #f8d7da;
                    border: 1px solid #f5c2c7;
                    border-radius: 12px;
                }
            </style>

            <div class="error-box">
                <h2>Erro ao carregar a prova</h2>
                <p>Não foi possível carregar os dados do arquivo JSON. Verifique a existência de <strong>data/prova.json</strong>.</p>
            </div>
        `;
    }

    eventos() {
        const finalizar = this.shadowRoot.querySelector('#finalizar');
        const reiniciar = this.shadowRoot.querySelector('#reiniciar');

        finalizar.addEventListener('click', () => {
            this.acertos = 0;

            let todasRespondidas = true;

            perguntas.forEach((p, index) => {
                const selecionada = this.shadowRoot.querySelector(`input[name="questao${index}"]:checked`);
                if (!selecionada) {
                    todasRespondidas = false;
                }
            });

            if (!todasRespondidas) {
                alert('⚠️ Responda todas as perguntas!');
                return;
            }

            let detalhes = '';

            perguntas.forEach((p, index) => {
                const selecionada = this.shadowRoot.querySelector(`input[name="questao${index}"]:checked`);
                const respostaUsuario = selecionada ? selecionada.value : 'Não respondeu';
                const acertou = respostaUsuario === p.correta;

                if (acertou) {
                    this.acertos++;
                }

                detalhes += `
                    <div class="resultadoQuestao">
                        <h3>Questão ${index + 1}</h3>
                        <p><strong>Sua resposta:</strong> ${respostaUsuario}</p>
                        <p><strong>Resposta correta:</strong> ${p.correta}</p>
                        <p>${acertou ? '✅ Acertou' : '❌ Errou'}</p>
                    </div>
                `;
            });

            const resultado = this.shadowRoot.querySelector('#resultadoFinal');
            resultado.innerHTML = `
                <h2>🎯 Você acertou ${this.acertos} de ${perguntas.length} perguntas!</h2>
                ${detalhes}
            `;
            reiniciar.style.display = 'inline-block';
        });

        reiniciar.addEventListener('click', () => {
            this.render();
        });
    }
}

customElements.define('my-prove', MyProve);
