const API_EMPTY_VALUE = "N/A";
export const EMPTY_VALUE = "N/A";

const getValue = (value) => (value === API_EMPTY_VALUE ? EMPTY_VALUE : value);

export const mapMovie = (movie) => ({
  id: movie.imdbID,
  title: movie.Title,
  year: getValue(movie.Year),
  link: `https://www.imdb.com/title/${movie.imdbID}/`,
  poster: getValue(movie.Poster),
  genre: getValue(movie.Genre),
  rating: getValue(movie.imdbRating),
});
