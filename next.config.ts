import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O funil "Empreenda com IA" é só em português.
  async redirects() {
    return [{ source: "/empreenda", destination: "/pt/empreenda", permanent: false }];
  },
};

export default nextConfig;
