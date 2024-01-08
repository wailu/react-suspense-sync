export const fetchCatData = () => {
  console.log("fetchCatData called");
  return new Promise((resolve) => {
    setTimeout(() => resolve("meow!"), 2000);
  });
};
