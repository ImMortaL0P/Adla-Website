import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomeHero } from './components/home/HomeHero'
import { useT } from './context/LanguageContext'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const AboutPrincipal = lazy(() => import('./pages/AboutPrincipal'))
const AboutInfrastructure = lazy(() => import('./pages/AboutInfrastructure'))
const AcademicsOverview = lazy(() => import('./pages/academics/AcademicsOverview'))
const AcademicsStagePrimary = lazy(() =>
  import('./pages/academics/AcademicsStage').then((m) => ({ default: () => <m.AcademicsStage stage="primary" /> }))
)
const AcademicsStageMiddle = lazy(() =>
  import('./pages/academics/AcademicsStage').then((m) => ({ default: () => <m.AcademicsStage stage="middle" /> }))
)
const AcademicsStageSecondary = lazy(() =>
  import('./pages/academics/AcademicsStage').then((m) => ({ default: () => <m.AcademicsStage stage="secondary" /> }))
)
const AcademicsStageSenior = lazy(() =>
  import('./pages/academics/AcademicsStage').then((m) => ({ default: () => <m.AcademicsStage stage="senior" /> }))
)
const StaffDirectory = lazy(() => import('./pages/staff/StaffDirectory'))
const StaffProfile = lazy(() => import('./pages/staff/StaffProfile'))
const Gallery = lazy(() => import('./pages/Gallery'))
const NoticesList = lazy(() => import('./pages/notices/NoticesList'))
const NoticeDetail = lazy(() => import('./pages/notices/NoticeDetail'))
const Admission = lazy(() => import('./pages/Admission'))
const Contact = lazy(() => import('./pages/Contact'))
const MandatoryDisclosure = lazy(() => import('./pages/MandatoryDisclosure'))

// Lazy loaded placeholder pages for Phase 1 code-splitting optimization
const PlaceholderPage = lazy(() => Promise.resolve({
  default: function PlaceholderPage({ titleKey }: { titleKey: string }) {
    const { t } = useT()
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 text-center sm:px-8 lg:px-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          {/* @ts-ignore - temporary for Phase 1 stubs */}
          {t(titleKey)}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-[hsl(var(--muted-foreground))]">
          {t('common.comingSoonDesc')}
        </p>
      </div>
    )
  }
}))

const NotFound = lazy(() => Promise.resolve({
  default: function NotFound() {
    const { t } = useT()
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 text-center sm:px-8 lg:px-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-[hsl(var(--destructive))] sm:text-5xl">
          404
        </h1>
        <h2 className="mb-6 text-2xl font-semibold">
          {t('notFound.title')}
        </h2>
        <p className="text-[hsl(var(--muted-foreground))]">
          {t('notFound.description')}
        </p>
      </div>
    )
  }
}))

function LoadingFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[hsl(var(--muted))] border-t-[hsl(var(--primary-strong))]"></div>
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="about/principal" element={<AboutPrincipal />} />
            <Route path="about/infrastructure" element={<AboutInfrastructure />} />

            <Route path="academics" element={<AcademicsOverview />} />
            <Route path="academics/primary" element={<AcademicsStagePrimary />} />
            <Route path="academics/middle" element={<AcademicsStageMiddle />} />
            <Route path="academics/secondary" element={<AcademicsStageSecondary />} />
            <Route path="academics/senior" element={<AcademicsStageSenior />} />

            <Route path="staff" element={<StaffDirectory />} />
            <Route path="staff/:slug" element={<StaffProfile />} />

            <Route path="gallery" element={<Gallery />} />

            <Route path="notices" element={<NoticesList />} />
            <Route path="notices/:slug" element={<NoticeDetail />} />

            <Route path="admission" element={<Admission />} />
            <Route path="contact" element={<Contact />} />
            <Route path="mandatory-disclosure" element={<MandatoryDisclosure />} />

            {/* Phase 3/4 scope — remain stubbed until Supabase + admin land */}
            <Route path="results" element={<PlaceholderPage titleKey="results.title" />} />
            <Route path="downloads" element={<PlaceholderPage titleKey="downloads.title" />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
