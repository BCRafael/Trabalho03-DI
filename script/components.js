// ============================================
// COMPONENTES WEB REUTILIZÁVEIS
// Header, Nav e Footer com Template e Slots
// ============================================

// ============================================
// WEB COMPONENT: MyHeader
// Componente reutilizável para o cabeçalho
// ============================================
class MyHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                    display: block;
                }

                header {
                    background-color: #000000;
                    color: white;
                    padding: 1.5rem 1rem;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                h1 {
                    text-align: center;
                    margin: 0;
                    font-size: 2rem;
                    font-weight: bold;
                }

                @media (max-width: 768px) {
                    h1 {
                        font-size: 1.5rem;
                    }

                    header {
                        padding: 1rem;
                    }
                }
            </style>

            <header>
                <div class="container">
                    <h1>
                        <slot name="title">Design de Interação</slot>
                    </h1>
                </div>
            </header>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

// ============================================
// WEB COMPONENT: MyNav
// Componente reutilizável para navegação
// ============================================
class MyNav extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {

        this.shadowRoot.innerHTML = `
            <style>

                :host {
                    display: block;
                }

                nav {
                    background-color: #68ea66;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .container {

                    max-width: 1200px;

                    margin: 0 auto;

                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    padding: 1rem 2rem;

                    gap: 2rem;
                }

                .brand {

                    color: black;

                    text-decoration: none;

                    font-weight: bold;

                    font-size: 1.5rem;

                    white-space: nowrap;
                }

                .brand:hover {
                    opacity: 0.8;
                }

                .nav-menu {

                    display: flex;

                    align-items: center;

                    justify-content: flex-end;

                    flex-wrap: wrap;

                    gap: 1rem;

                    flex: 1;
                }

                ::slotted(.nav-link) {

                    color: #212529;

                    text-decoration: none;

                    padding: 0.75rem 1rem;

                    border-radius: 8px;

                    transition: all 0.3s ease;

                    font-weight: 500;

                    font-size: 1rem;
                }

                ::slotted(.nav-link:hover) {

                    color: #212529;

                    background-color: rgba(255, 255, 255, 0.35);
                }

                ::slotted(.nav-link.active) {

                    background-color: rgba(13, 110, 253, 0.25);

                    border-bottom: 3px solid #0d6efd;

                    font-weight: 600;
                }

                ::slotted(.nav-link.disabled) {

                    color: #666666;

                    cursor: not-allowed;

                    opacity: 0.6;
                }

                /* TABLET */
                @media (max-width: 900px) {

                    .container {

                        flex-direction: column;

                        align-items: center;

                        gap: 1rem;
                    }

                    .nav-menu {

                        justify-content: center;
                    }
                }

                /* CELULAR */
                @media (max-width: 600px) {

                    .container {

                        padding: 1rem;
                    }

                    .nav-menu {

                        flex-direction: column;

                        width: 100%;
                    }

                    ::slotted(.nav-link) {

                        width: 100%;

                        text-align: center;
                    }
                }

            </style>

            <nav>

                <div class="container">

                    <a class="brand" href="/" data-home-link>

                        <slot name="brand">
                            Disciplina Web
                        </slot>

                    </a>

                    <div class="nav-menu">

                        <slot name="items"></slot>

                    </div>

                </div>

            </nav>
        `;

        this.shadowRoot
            .querySelector('[data-home-link]')
            .href = this.getHomeLink();
    }

    getHomeLink() {

        const path = window.location.pathname;

        if (path.includes('/pages/')) {
            return '../index.html';
        }

        return 'index.html';
    }
}

// ============================================
// WEB COMPONENT: MyFooter
// Componente reutilizável para rodapé
// ============================================
class MyFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin-top: auto;
                }

                footer {
                    background-color: #a1da87;
                    color: #212529;
                    padding: 2rem 1rem;
                    border-top: 1px solid #404249;
                }

                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .footer-content {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                    margin-bottom: 2rem;
                }

                .footer-section h3 {
                    color: black;
                    margin-bottom: 1rem;
                    font-size: 1.1rem;
                }

                .footer-section ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .footer-section li {
                    margin-bottom: 0.5rem;
                }

                .footer-section a {
                    color: #212529;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }

                .footer-section a:hover {
                    color: #0d6efd;
                }

                .footer-bottom {
                    border-top: 1px solid #404249;
                    padding-top: 2rem;
                    text-align: center;
                    font-size: 0.9rem;
                }

                .footer-bottom p {
                    margin: 0;
                }

                @media (max-width: 768px) {
                    .footer-content {
                        grid-template-columns: 1fr;
                    }

                    footer {
                        padding: 1.5rem 1rem;
                    }
                }
            </style>

            <footer>
                <div class="container">

                    <div class="footer-content">

                        <div class="footer-section">
                            <h3>Sobre</h3>
                            <ul>
                                <li><a data-home>Portal de Trabalhos</a></li>
                                <li><a href="#">Sobre a Disciplina</a></li>
                                <li><a href="#">Recursos</a></li>
                            </ul>
                        </div>

                        <div class="footer-section">
                            <h3>Trabalhos</h3>
                            <ul>
                                <li><a data-editor>Editor de Cartões</a></li>
                                <li><a data-prova>Prova de Programação</a></li>
                                <li><a data-trabalho3>Trabalho 3</a></li>
                            </ul>
                        </div>

                        <div class="footer-section">
                            <h3>Tecnologias</h3>
                            <ul>
                                <li>HTML5 & CSS3</li>
                                <li>JavaScript Moderno</li>
                                <li>Web Components</li>
                                <li>Bootstrap 5</li>
                            </ul>
                        </div>

                    </div>

                    <div class="footer-bottom">
                        <p>&copy; 2026 Design de Interação - Todos os direitos reservados.</p>
                        <p>
                            <slot name="credits">
                                Desenvolvido como parte da disciplina de Interface Web
                            </slot>
                        </p>
                    </div>

                </div>
            </footer>
        `;

        // Configura os links dinamicamente
        const homeLink = this.shadowRoot.querySelector("[data-home]");
        const editorLink = this.shadowRoot.querySelector("[data-editor]");
        const provaLink = this.shadowRoot.querySelector("[data-prova]");
        const trabalho3Link = this.shadowRoot.querySelector("[data-trabalho3]");

        if (homeLink) {
            homeLink.href = this.getHomeLink();
        }
        if (editorLink) {
            editorLink.href = this.getEditorLink();
        }
        if (provaLink) {
            provaLink.href = this.getProvaLink();
        }
        if (trabalho3Link) {
            trabalho3Link.href = this.getTrabalho3Link();
        }
    }

    getHomeLink() {
        const path = window.location.pathname;

        if (path.includes("/pages/")) {
            return "../index.html";
        }

        return "index.html";
    }

    getEditorLink() {
        const path = window.location.pathname;

        if (path.includes("/pages/")) {
            return "editor.html";
        }

        return "pages/editor.html";
    }

    getProvaLink() {
        const path = window.location.pathname;

        if (path.includes("/pages/")) {
            return "prova.html";
        }

        return "pages/prova.html";
    }

    getTrabalho3Link() {
        const path = window.location.pathname;

        if (path.includes("/pages/")) {
            return "trabalho3.html";
        }

        return "pages/trabalho3.html";
    }
}

// ============================================
// REGISTRAR WEB COMPONENTS
// ============================================
customElements.define('my-header', MyHeader);
customElements.define('my-nav', MyNav);
customElements.define('my-footer', MyFooter);
