export const sitemap = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chat-with-geogebra.com'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
      alternates: {
        languages: {
          'zh-CN': `${baseUrl}`,
          'en-US': `${baseUrl}`,
        },
      },
    },
    {
      url: `${baseUrl}/chat`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
      alternates: {
        languages: {
          'zh-CN': `${baseUrl}/chat`,
          'en-US': `${baseUrl}/chat`,
        },
      },
    },
  ]
}

export default sitemap
