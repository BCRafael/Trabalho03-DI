// ============================================
// COMPONENTE: Technology Card Com Template
// Demonstra uso de HTML Template e Slots
// ============================================

class TechnologyCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        // Usando HTML Template para estrutura reutilizável
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                    display: block;
                }

                .tech-card {
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    border-radius: 12px;
                    padding: 20px;
                    text-align: center;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    cursor: pointer;
                }

                .tech-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
                }

                .tech-icon {
                    width: 60px;
                    height: 60px;
                    margin: 0 auto 15px;
                    object-fit: contain;
                }

                h3 {
                    margin: 15px 0 10px;
                    color: #333;
                    font-size: 1.3rem;
                }

                p {
                    color: #666;
                    font-size: 0.9rem;
                    margin: 0;
                    line-height: 1.5;
                }

                .description {
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px solid rgba(0, 0, 0, 0.1);
                    font-size: 0.85rem;
                    color: #555;
                }
            </style>

            <div class="tech-card">
                <!-- Slot para ícone/imagem -->
                <div class="tech-icon">
                    <slot name="icon">📱</slot>
                </div>

                <!-- Slot para título -->
                <h3>
                    <slot name="title">Tecnologia</slot>
                </h3>

                <!-- Slot para descrição principal -->
                <p>
                    <slot name="main">Descrição principal</slot>
                </p>

                <!-- Slot para descrição adicional -->
                <div class="description">
                    <slot name="details">Detalhes adicionais</slot>
                </div>
            </div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

// Registrar o componente
customElements.define('tech-card', TechnologyCard);
