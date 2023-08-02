import { MOVIE_BY_ID_PATH } from "../../config.js";
import { mapMovie } from "../helpers/mapMovie.js";
import { fetchData } from "../helpers/fetchData.js";

export const getMovieById = async (id, options = {}) => {
  try {
    const data = await fetchData(MOVIE_BY_ID_PATH(id), options);

    if (data.Response === "True") {
      return mapMovie(data);
    } else {
      throw new Error(data.Error);
    }
  } catch (error) {
    throw error;
  }
};
