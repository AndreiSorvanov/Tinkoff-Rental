import { SEARCH_PATH } from "../../config.js";
import { transformSearchText } from "../helpers/transformSearchText.js";
import { mapMovie } from "../helpers/mapMovie.js";
import { fetchData } from "../helpers/fetchData.js";

export const search = async (searchText, page = 1, options = {}) => {
  const searchRequest = transformSearchText(searchText);

  try {
    const data = await fetchData(SEARCH_PATH(searchRequest, page), options);

    if (data.Response === "True") {
      return {
        count: data.totalResults,
        movies: data.Search.map(mapMovie),
      };
    } else {
      throw new Error(data.Error);
    }
  } catch (error) {
    throw error;
  }
};
