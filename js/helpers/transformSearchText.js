export const transformSearchText = (text) => {
  return text
    .trim()
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length > 0)
    .join("+");
};
