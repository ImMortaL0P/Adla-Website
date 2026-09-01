import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { SkipLink } from './SkipLink'
import { BackToTop } from '@/components/common/BackToTop'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <Header />
      <main id="main" className="flex-1 pb-16 pt-20 focus:outline-none" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
