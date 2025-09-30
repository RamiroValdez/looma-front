export async function getCategorias() {
  const res = await fetch("/data/categorias.json");
  return res.json();
}