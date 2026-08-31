import { Helmet } from 'react-helmet-async'
import { generateMeta } from '@/lib/seo'
import { useT } from '@/context/LanguageContext'

interface SeoProps {
  titleKey?: string
  titleString?: string
  descriptionKey?: string
  path?: string
}

export function Seo({ titleKey, titleString, descriptionKey, path = '' }: SeoProps) {
  const { t, lang } = useT()

  // Use either a direct string or translate a key
  const title = titleString || (titleKey ? t(titleKey as any) : t('common.schoolName'))
  const description = descriptionKey ? t(descriptionKey as any) : undefined

  const meta = generateMeta({ title, description, path })

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{meta.title}</title>
      {meta.description && <meta name="description" content={meta.description} />}
      <link rel="canonical" href={meta.canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={meta.openGraph.title} />
      {meta.openGraph.description && <meta property="og:description" content={meta.openGraph.description} />}
      <meta property="og:url" content={meta.openGraph.url} />
      <meta property="og:site_name" content={meta.openGraph.siteName} />
      <meta property="og:type" content={meta.openGraph.type} />
      {meta.openGraph.images.map((img, i) => (
        <meta key={i} property="og:image" content={img.url} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content={meta.twitter.cardType} />
      <meta name="twitter:title" content={meta.twitter.title} />
      {meta.twitter.description && <meta name="twitter:description" content={meta.twitter.description} />}
      {meta.twitter.image && <meta name="twitter:image" content={meta.twitter.image} />}
    </Helmet>
  )
}
