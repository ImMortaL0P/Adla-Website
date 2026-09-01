export function generateMeta({
  title,
  description,
  path = '',
}: {
  title: string
  description?: string
  path?: string
}) {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://umvadla.example'
  const fullTitle = `${title} | UMV Adla`
  const url = `${siteUrl}${path}`

  return {
    title: fullTitle,
    description,
    canonicalUrl: url,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'UMV Adla',
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'UMV Adla — Uchcha Madhyamik Vidyalaya Adla',
        },
      ],
      type: 'website',
    },
    twitter: {
      cardType: 'summary_large_image',
      title: fullTitle,
      description,
      image: `${siteUrl}/og-image.png`,
    },
  }
}
