/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true, // Cambia a false si no es un redireccionamiento permanente
      },
    ];
  },
};

module.exports = nextConfig;
