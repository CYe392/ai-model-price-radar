import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ModelScope AI API Price Radar",
    short_name: "ModelScope",
    description: "AI API price intelligence, workload cost, regional availability, and recommendations.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f8f3",
    theme_color: "#17231d",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
