/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Deshabilita ESLint durante el build
  },
  typescript: {
    ignoreBuildErrors: true, // Deshabilita la verificación de tipos durante el build
  },
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
