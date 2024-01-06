export const fetchCatData = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve("meow!"), 2000);
  });
};
