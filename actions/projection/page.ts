"use server";

export const getProyeccion = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log("Base URL:", `${baseUrl}/api/projection`);
  const response = await fetch(`${baseUrl}/api/projection`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(`Error al obtener proyeccion: ${responseData.message}`);
  }

  return responseData;
};
