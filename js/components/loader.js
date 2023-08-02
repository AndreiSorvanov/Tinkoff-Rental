const loaderTemplate = document.createElement("template");
loaderTemplate.innerHTML = `
  <style>
    .loader {
      display: block;
      width: 80px;
      height: 80px;
      margin: 10px auto;

      stroke-width: 8;
      stroke: #fff;
    }

    .loader__icon {
      display: block;
      width: inherit;
      height: inherit;

      fill: none;
      stroke: inherit;
    }
  </style>

  <span class="loader" aria-label="Идёт загрузка" aria-busy="true" aria-live="polite">
    <svg class="loader__icon" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.00025 40.0005C4.00025 59.8825 20.1182 76.0005 40.0002 76.0005C59.8822 76.0005 76.0002 59.8825 76.0002 40.0005C76.0002 20.1185 59.8823 4.00049 40.0003 4.00049C35.3513 4.00048 30.9082 4.88148 26.8282 6.48648" stroke-miterlimit="10" stroke-linecap="round">
        <animateTransform attributeName="transform" type="rotate" dur="2s" values="0 40 40;360 40 40;" repeatCount="indefinite"/>
      </path>
    </svg>
  </span>
`;

class Loader extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    const template = loaderTemplate.content.cloneNode(true);

    shadow.appendChild(template);
  }
}

customElements.define("loader-element", Loader);
