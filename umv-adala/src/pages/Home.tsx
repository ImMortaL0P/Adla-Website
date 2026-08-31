import { Seo } from '@/components/common/Seo'
import { HomeHero } from '@/components/home/HomeHero'
import { NoticesTicker } from '@/components/home/NoticesTicker'
import { StatsStrip } from '@/components/home/StatsStrip'
import { AboutPreview } from '@/components/home/AboutPreview'
import { AcademicsGrid } from '@/components/home/AcademicsGrid'
import { FacilitiesStrip } from '@/components/home/FacilitiesStrip'
import { PrincipalMessage } from '@/components/home/PrincipalMessage'
import { GalleryPreview } from '@/components/home/GalleryPreview'
import { AdmissionCta } from '@/components/home/AdmissionCta'
import { LocationSection } from '@/components/home/LocationSection'

export default function Home() {
  return (
    <>
      <Seo path="/" />
      <HomeHero />
      <NoticesTicker />
      <StatsStrip />
      <AboutPreview />
      <AcademicsGrid />
      <FacilitiesStrip />
      <PrincipalMessage />
      <GalleryPreview />
      <AdmissionCta />
      <LocationSection />
    </>
  )
}
