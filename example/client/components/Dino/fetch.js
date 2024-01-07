export default async function fetchDinoData() {
  console.log("fetchDinoData");
  return new Promise((resolve) => {
    setTimeout(() => resolve("rawr!"), 1000);
  });
}
