import { HttpError } from "./httpError.js";

const cache = new Map();

export const fetchData = async (resource, options = {}) => {
  if (!cache.has(resource)) {
    const response = await fetch(resource, options);

    if (response.ok) {
      const data = await response.json();
      cache.set(resource, data);
    } else {
      throw new HttpError(response.status, response.statusText);
    }
  }

  return cache.get(resource);
};
