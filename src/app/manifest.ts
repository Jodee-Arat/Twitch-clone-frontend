import { MetadataRoute } from "next";

import { SITE_DESCRIPTION, SITE_NAME } from "@/libs/constants/seo.constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1А2128",
    theme_color: "#18B9AE",
    icons: [
      {
        src: "/touch-icons/256x256.png",
        type: "image/png",
        sizes: "256x256",
      },
      {
        src: "/touch-icons/512x512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
  };
}
