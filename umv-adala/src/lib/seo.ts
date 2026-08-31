export function generateMeta({
  title,
  description,
  path = '',
}: {
  title: string
  description?: string
  path?: string
}) {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://umvadala.example'
  const fullTitle = `${title} | UMV Adala`
  const url = `${siteUrl}${path}`

  return {
    title: fullTitle,
    description,
    canonicalUrl: url,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'UMV Adala',
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'UMV Adala — Uccha Madhyamik Vidyalaya Adala',
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
