import { EMPTY_VALUE } from "../helpers/mapMovie.js";

const movieTemplate = document.createElement("template");
movieTemplate.innerHTML = `
  <style>
    .hidden {
      display: none !important;
    }

    :host {
      display: block;
      border-radius: 12px;
      overflow: hidden;
    }

    * {
      box-sizing: border-box;
    }

    .movie-card {
      position: relative;

      height: 100%;

      font-size: 24px;
      line-height: 1.5;

      cursor: pointer;
    }

    .movie-card__link {
      display: block;
      height: 100%;
      width: 100%;

      text-decoration: none;
    }

    .movie-card__background {
      position: absolute;

      width: 100%;
      height: 100%;

      background-color: rgba(255, 255, 255, 0.24);
    }

    .movie-card__background-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .movie-card__info-container {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      width: 100%;
      height: 100%;
      padding: 20px;
    }

    .movie-card__rating {
      display: none;
      margin-bottom: 10px;
      padding-left: 30px;

      color: #fff;
      line-height: 24px;

      background-size: contain;
      background-position: left center;
      background-repeat: no-repeat;
    }

    .movie-card__rating_5 {
      background-image: url("../img/rating-5.png");
    }

    .movie-card__rating_4 {
      background-image: url("../img/rating-4.png");
    }

    .movie-card__rating_3 {
      background-image: url("../img/rating-3.png");
    }

    .movie-card__rating_2 {
      background-image: url("../img/rating-2.png");
    }

    .movie-card__rating_1 {
      background-image: url("../img/rating-1.png");
    }

    @media
    only screen and (-webkit-min-device-pixel-ratio: 2), /* для Safari, Safari IOS */
    only screen and (min-resolution: 192dpi),            /* для IE 10, IE 11, Opera Mini */
    only screen and (min-resolution: 2dppx) {            /* для нормальных браузеров */
      .movie-card__rating_5 {
        background-image: url("../img/rating-5@2x.png");
      }

      .movie-card__rating_4 {
        background-image: url("../img/rating-4@2x.png");
      }

      .movie-card__rating_3 {
        background-image: url("../img/rating-3@2x.png");
      }

      .movie-card__rating_2 {
        background-image: url("../img/rating-2@2x.png");
      }

      .movie-card__rating_1 {
        background-image: url("../img/rating-1@2x.png");
      }
    }

    .movie-card__title {
      margin: 0;
      margin-bottom: 16px;

      font-weight: 700;
      font-size: inherit;
      color: rgba(255, 255, 255, 0.24);
    }

    .movie-card__footer {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      font-size: 16px;
      color: rgba(255, 255, 255, 0.4);
    }

    .movie-card:not(.movie-card_loading):hover .movie-card__info-container {
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 26.43%, rgba(0, 0, 0, 0.8) 72.41%);
      backdrop-filter: blur(1px);
    }

    .movie-card:hover .movie-card__rating {
      display: inline-block;
    }

    .movie-card:hover .movie-card__title {
      color: #fff;
    }



    /* movie-card_no-image */
    .movie-card_no-image .movie-card__background-image {
      display: none;
    }



    /* movie-card_loading */
    .movie-card_loading {
      pointer-events: none;
    }

    .movie-card_loading .movie-card__background-image,
    .movie-card_loading .movie-card__rating {
      display: none;
    }

    .movie-card_loading .movie-card__info-container {
      padding-bottom: 68px;
    }

    .movie-card_loading .movie-card__title,
    .movie-card_loading .movie-card__footer {
      height: 24px;
      border-radius: 2px;

      font-size: 0;

      background: linear-gradient(110deg, rgba(255, 255, 255, 0.08) 8%, #857373 18%, rgba(255, 255, 255, 0.08) 33%);
      background-size: 200% 100%;

      animation: 1s shine linear infinite;
    }

    .movie-card_loading .movie-card__title {
      max-width: 246px;
      margin-bottom: 8px;
    }

    .movie-card_loading .movie-card__footer {
      max-width: 156px;
    }

    @keyframes shine {
      to {
        background-position-x: -200%;
      }
    }
  </style>

  <article class="movie-card">
    <a href="" class="movie-card__link" tabindex="-1">
      <div class="movie-card__background">
        <img class="movie-card__background-image" src="" alt="Постер" loading="lazy">
      </div>
      <div class="movie-card__info-container">
        <div class="movie-card__info">
          <span class="movie-card__rating"></span>
          <h2 class="movie-card__title"></h2>
          <div class="movie-card__footer">
            <span class="movie-card__genre"></span>
            <span class="movie-card__release-date"></span>
          </div>
        </div>
      </div>
    </a>
  </article>
`;

const params = [
  "id",
  "title",
  "poster",
  "link",
  "year",
  "genre",
  "rating",
  "loading",
];
const mirror = (params, element) => {
  params.forEach((param) => {
    Object.defineProperty(element, param, {
      get() {
        return this.getAttribute(`data-${param}`);
      },
      set(value) {
        if (param === "loading") {
          value = Boolean(value);
        }
        this.setAttribute(`data-${param}`, value ?? "");
      },
    });
  });
};

class MovieCard extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    const template = movieTemplate.content.cloneNode(true);

    shadow.appendChild(template);
    mirror(params, this);
  }

  connectedCallback() {
    this.setAttribute("data-live", "off");
    this.setAttribute("tabindex", "0");
  }

  static get observedAttributes() {
    return params.map((param) => `data-${param}`);
  }

  attributeChangedCallback(param, oldValue, newValue) {
    switch (param) {
      case "data-title":
        this.shadowRoot.querySelector(".movie-card__title").textContent =
          newValue;
        return;

      case "data-poster":
        let posterSrc = "";

        if (newValue === EMPTY_VALUE) {
          this.shadowRoot
            .querySelector(".movie-card")
            .classList.add("movie-card_no-image");
        } else {
          this.shadowRoot
            .querySelector(".movie-card")
            .classList.remove("movie-card_no-image");

          posterSrc = newValue;
        }

        this.shadowRoot.querySelector(".movie-card__background-image").src =
          posterSrc;
        return;

      case "data-link":
        this.shadowRoot.querySelector(".movie-card__link").href = newValue;
        return;

      case "data-year":
        this.shadowRoot.querySelector(".movie-card__release-date").textContent =
          newValue !== EMPTY_VALUE ? newValue : "\u2014";
        return;

      case "data-rating":
        const ratingElement = this.shadowRoot.querySelector(
          ".movie-card__rating"
        );
        ratingElement.textContent = newValue;

        const rating = Number(newValue);
        if (Number.isNaN(rating)) {
          ratingElement.classList.add("hidden");
        } else if (rating >= 8) {
          ratingElement.classList.add("movie-card__rating_5");
        } else if (rating >= 6) {
          ratingElement.classList.add("movie-card__rating_4");
        } else if (rating >= 4) {
          ratingElement.classList.add("movie-card__rating_3");
        } else if (rating >= 2) {
          ratingElement.classList.add("movie-card__rating_2");
        } else {
          ratingElement.classList.add("movie-card__rating_1");
        }

        return;

      case "data-genre":
        this.shadowRoot.querySelector(".movie-card__genre").textContent =
          newValue !== EMPTY_VALUE ? newValue : "\u2014";
        return;

      case "data-loading":
        if (newValue === "true") {
          this.shadowRoot
            .querySelector(".movie-card")
            .classList.add("movie-card_loading");
        } else {
          this.shadowRoot
            .querySelector(".movie-card")
            .classList.remove("movie-card_loading");
        }

        this.setAttribute("aria-busy", newValue);

        return;
    }
  }
}

customElements.define("movie-card", MovieCard);
