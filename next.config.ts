import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/libs/i18n/request.ts");
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bd43c9c6-c821-4899-b155-c59aedee91f1.selstorage.ru",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
