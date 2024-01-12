export default async function fetchDinoData() {
  console.log("fetchDinoData called");
  return new Promise((resolve) => {
    setTimeout(() => resolve("rawr!"), 5000);
  });
}
