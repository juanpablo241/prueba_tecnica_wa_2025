"use server";

export const getProyeccion = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  console.log("Base URL:", baseUrl); // Log the base URL for debugging
  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL); // Log the API URL for debugging
  console.log(`${baseUrl}/api/projection`); // Log the full URL for debugging
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
