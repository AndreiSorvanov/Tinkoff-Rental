import { createStore } from "./helpers/createStore.js";

let state = {
  count: 0,
  movies: [],
  page: 1,
  error: false,
  searchText: "",
  searches: [
    "Star Wars",
    "Kung Fury",
    "Back to the Future",
    "Matrix",
    "Terminator",
  ],
  loading: false,
};

if ("state" in localStorage) {
  state = JSON.parse(localStorage.getItem("state"));
}

export const store = createStore(state, (store) => ({
  init: (currentState) => {
    return {
      movies: [...currentState.movies],
    };
  },
  setSearchText: (currentState, searchText) => {
    return {
      searchText,
    };
  },
  addTag: (currentState, searchTag) => {
    const trimmedSearchTag = searchTag.trim();
    return {
      searches: [
        trimmedSearchTag,
        ...currentState.searches.filter((tag) => tag !== trimmedSearchTag),
      ].slice(0, 15),
    };
  },
  removeTag: (currentState, searchTag) => {
    const trimmedSearchTag = searchTag.trim();
    return {
      searches: currentState.searches.filter((tag) => tag !== trimmedSearchTag),
    };
  },
  setLoading: (currentState, loading) => {
    return {
      loading,
    };
  },
  setCount: (currentState, count) => {
    return {
      count,
    };
  },
  setMovies: (currentState, movies) => {
    return {
      movies: movies.map((movie) => structuredClone(movie)),
    };
  },
  addMovies: (currentState, movies) => {
    return {
      movies: [
        ...currentState.movies,
        ...movies.map((movie) => structuredClone(movie)),
      ],
    };
  },
  updateMovie: (currentState, movie) => {
    return {
      movies: currentState.movies.map((curMovie) => {
        if (curMovie.id === movie.id) {
          return structuredClone(movie);
        }

        return curMovie;
      }),
    };
  },
  setPage: (currentState, page) => {
    return {
      page,
    };
  },
  setError: (currentState, error) => {
    return {
      error,
    };
  },
}));

store.subscribe((state) =>
  localStorage.setItem("state", JSON.stringify(state))
);
