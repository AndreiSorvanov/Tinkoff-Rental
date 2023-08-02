import { store } from "./store.js";
import {
  renderSearchTagsList,
  renderLoader,
  removeLoader,
  renderCount,
  removeCount,
  renderMoviesList,
  renderError,
} from "./render.js";
import { search } from "./API/search.js";
import { getMovieById } from "./API/getMovieById.js";
import { debounce } from "./helpers/debounce.js";
import { MOVIES_PER_PAGE } from "../config.js";

const mainContainer = document.querySelector(".main");

const searchForm = document.querySelector(".search__form");
const searchInput = searchForm.querySelector(".search__input");
const clearBtn = searchForm.querySelector(".search__clear-btn");
const tagsListContainer = document.querySelector(".tags-list");

const resultsContainer = document.querySelector(".results__container");
const moviesCountContainer = resultsContainer.querySelector(".results__text");
const moviesListContainer = resultsContainer.querySelector(".movies-list");
const loaderContainer = resultsContainer.querySelector(
  ".results__loader-container"
);
const showMoreBtn = resultsContainer.querySelector(".results__show-more-btn");
const errorContainer = moviesCountContainer;

let controller = new AbortController();
let signal = controller.signal;

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
});

const fetchPage = (page, searchText, signal) => {
  store.setPage(page);
  store.setLoading(true);

  const searchPromise = search(searchText, page, { signal });
  searchPromise
    .then((result) => {
      const { count, movies } = result;
      if (page === 1) {
        store.setCount(Number(count));
      }
      store.addMovies(movies.map((movie) => ({ id: movie.id, loading: true })));

      const moviePromises = movies.map((movie) =>
        getMovieById(movie.id, { signal })
      );
      moviePromises.map((promise) =>
        promise.then((movie) => store.updateMovie(movie))
      );
    })
    .catch((error) => {
      store.setError(true);
      console.error(error.message);
    })
    .finally(() => {
      store.setLoading(false);
    });
};

const startSearch = (signal) => {
  store.setCount(0);
  store.setMovies([]);
  store.setError(false);

  const searchText = store.getState().searchText.trim();
  if (searchText === "") {
    return;
  }

  store.addTag(searchText);
  fetchPage(1, searchText, signal);
};

const handleShowMore = (signal) => {
  const searchText = store.getState().searchText.trim();
  if (searchText === "") {
    return;
  }

  const page = store.getState().page + 1;
  fetchPage(page, searchText, signal);
};

const debouncedStartSearch = debounce(startSearch, 300);

searchInput.addEventListener("input", (event) => {
  store.setSearchText(event.currentTarget.value);
});

clearBtn.addEventListener("click", (event) => {
  store.setSearchText("");
  store.setCount(0);
  store.setMovies([]);
  store.setError(false);
});

var timerId = 0;
var delay = 200;
var prevent = false;

const handleTagClick = (event) => {
  store.setSearchText(event.target.textContent);
};

const handleTagDblClick = (event) => {
  store.removeTag(event.target.textContent);
};

tagsListContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("tags-list__btn")) {
    timerId = setTimeout(() => {
      if (!prevent) {
        handleTagClick(event);
      }
      prevent = false;
    }, delay);
  }
});

tagsListContainer.addEventListener("dblclick", (event) => {
  if (event.target.classList.contains("tags-list__btn")) {
    clearTimeout(timerId);
    prevent = true;

    handleTagDblClick(event);
  }
});

document.addEventListener("scroll", (event) => {
  if (mainContainer.getBoundingClientRect().top <= 0) {
    mainContainer.classList.add("scroll");
  } else {
    mainContainer.classList.remove("scroll");
  }
});

showMoreBtn.addEventListener("click", (event) => {
  handleShowMore(signal);
});

store.subscribe((state) => {
  if (state.searches.length > 0) {
    mainContainer.classList.add("search_active");
  } else {
    mainContainer.classList.remove("search_active");
  }

  renderSearchTagsList(tagsListContainer, state.searches);
});

store.subscribe((state, prevState) => {
  searchInput.value = state.searchText;
  if (state.searchText !== "") {
    clearBtn.classList.remove("hidden");
  } else {
    clearBtn.classList.add("hidden");
  }

  if (prevState.searchText !== state.searchText) {
    controller.abort();

    controller = new AbortController();
    signal = controller.signal;

    debouncedStartSearch(signal);
  }
});

store.subscribe((state, prevState) => {
  if (state.loading && !prevState.loading) {
    renderLoader(loaderContainer);
  }
  if (!state.loading && prevState.loading) {
    removeLoader(loaderContainer);
  }
});

store.subscribe((state) => {
  if (state.count > 0) {
    renderCount(moviesCountContainer, state.count);
    mainContainer.classList.add("search_live");
  } else {
    removeCount(moviesCountContainer);
    mainContainer.classList.remove("search_live");
  }
});

store.subscribe((state, prevState) => {
  if (prevState.movies !== state.movies) {
    renderMoviesList(moviesListContainer, state.movies);
  }
});

store.subscribe((state) => {
  if (state.error) {
    renderError(errorContainer);
  }
});

store.subscribe((state) => {
  if (
    state.loading ||
    state.count === 0 ||
    state.page * MOVIES_PER_PAGE >= state.count
  ) {
    showMoreBtn.classList.add("hidden");
  } else {
    showMoreBtn.classList.remove("hidden");
  }
});

store.init();
