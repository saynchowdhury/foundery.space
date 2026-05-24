import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/admin/", "/admin/"],
      },
    ],
    sitemap: "https://foundery.space/sitemap.xml",
    host: "https://foundery.space",
  };
}
