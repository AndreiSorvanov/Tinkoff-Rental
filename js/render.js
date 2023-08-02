import { clearNode } from "./helpers/clearContainer.js";
import { getDeclension } from "./helpers/getDeclension.js";
import "./components/loader.js";
import "./components/movieCard.js";

const dMovies = getDeclension("фильм", "фильма", "фильмов");

const createSearchTag = (text) => {
  const tagBtn = document.createElement("button");
  tagBtn.setAttribute("type", "button");
  tagBtn.textContent = text;
  tagBtn.dataset.text = text;

  return tagBtn;
};

export const renderSearchTagsList = (container, tags) => {
  const list = document.createDocumentFragment();

  tags.forEach((tagText) => {
    const listItem = document.createElement("li");
    listItem.classList.add("tags-list__item");

    const tagElement = createSearchTag(tagText);
    tagElement.classList.add("tags-list__btn");
    listItem.append(tagElement);

    list.append(listItem);
  });

  clearNode(container);
  container.append(list);
};

export const renderLoader = (container) => {
  const loader = document.createElement("loader-element");

  for (const element of container.children) {
    element.classList.add("hidden");
  }

  container.append(loader);
};

export const removeLoader = (container) => {
  const loader = container.querySelector("loader-element");
  if (loader) {
    loader.remove();
  }

  for (const element of container.children) {
    element.classList.remove("hidden");
  }
};

export const renderCount = (container, count) => {
  clearNode(container);
  container.textContent = `Нашли ${count} ${dMovies(count)}`;
};

export const removeCount = (container) => {
  clearNode(container);
};

const createMovieCard = (movieData) => {
  const movie = document.createElement("movie-card");

  movie.id = movieData.id;
  movie.title = movieData.title;
  movie.year = movieData.year;
  movie.poster = movieData.poster;
  movie.link = movieData.link;
  movie.genre = movieData.genre;
  movie.rating = movieData.rating;
  movie.loading = movieData.loading;

  return movie;
};

export const renderMoviesList = (container, movies) => {
  const list = document.createDocumentFragment();

  movies.forEach((movie) => {
    const listItem = document.createElement("li");
    listItem.classList.add("movies-list__item");

    const movieElement = createMovieCard(movie);
    movieElement.classList.add("movies-list__card");
    listItem.append(movieElement);

    list.append(listItem);
  });

  clearNode(container);
  container.append(list);
};

export const renderError = (container) => {
  clearNode(container);
  container.textContent = String.raw`Мы не поняли о чем речь ¯\_(ツ)_/¯`;
};
