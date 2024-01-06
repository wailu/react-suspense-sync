export default async function fetchDinoData() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  return response.json();
}
