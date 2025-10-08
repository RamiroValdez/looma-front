export const getTop10Works = async () => {
  const response = await fetch("/data/top10Work.json");

  if (!response.ok) {
    throw new Error(`Error al obtener el Top 10: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
