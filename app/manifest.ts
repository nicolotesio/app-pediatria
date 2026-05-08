import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Appunti di Pediatria",
    short_name: "Appunti Pediatria",
    description: "Appunti, risorse e strumenti clinici personali di Dr Nicolò Tesio.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f766e",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
