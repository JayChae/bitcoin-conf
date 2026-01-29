import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://bitcoinkoreaconference.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          ko: `${baseUrl}/ko`,
        },
      },
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          ko: `${baseUrl}/ko`,
        },
      },
    },
    {
      url: `${baseUrl}/ko`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          ko: `${baseUrl}/ko`,
        },
      },
    },
  ];
}
