const API_KEY = "a65872ba";
const BASE_URL = "http://www.omdbapi.com/";

export const MOVIES_PER_PAGE = 10;

export const SEARCH_PATH = (searchText, page) =>
  `${BASE_URL}/?apikey=${API_KEY}&s=${searchText}&page=${page}`;
export const MOVIE_BY_ID_PATH = (id) =>
  `${BASE_URL}/?apikey=${API_KEY}&i=${id}`;
