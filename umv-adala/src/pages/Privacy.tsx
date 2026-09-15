import { Shield } from 'lucide-react'
import { Seo } from '@/components/common/Seo'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'

export default function Privacy() {
  return (
    <>
      <Seo titleString="Privacy Policy | UMV Adla" path="/privacy" />
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-12 mt-16 sm:mt-24">
        <SectionHeading title="Privacy Policy" alignment="left" level={1} />

        <Reveal>
          <div className="mb-10 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Shield size={28} className="text-[hsl(var(--primary-strong))]" />
              <h2 className="font-display text-2xl font-semibold text-[hsl(var(--foreground))]">
                Our Commitment to Privacy
              </h2>
            </div>
            
            <div className="space-y-6 text-[hsl(var(--muted-foreground))] leading-relaxed">
              <p>
                At Uma Vidyapeeth Adla (UMV Adla), we take your privacy seriously. This Privacy Policy details how we collect, use, and protect your information when you visit our website (umvadla.in).
              </p>
              
              <h3 className="font-semibold text-lg text-[hsl(var(--foreground))] mt-8 mb-2">1. Information We Collect</h3>
              <p>
                We may collect personal information such as your name, email address, phone number, and physical address when you voluntarily submit it through our contact forms, admission inquiries, or other online services. Standard analytical data (like IP addresses and browser types) might also be gathered automatically.
              </p>
              
              <h3 className="font-semibold text-lg text-[hsl(var(--foreground))] mt-8 mb-2">2. How We Use Your Information</h3>
              <p>
                The information you provide is used solely for the following purposes:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>To respond to your inquiries and support requests.</li>
                <li>To process school admissions and related administrative tasks.</li>
                <li>To send important announcements and updates regarding the school.</li>
                <li>To improve our website functionality and user experience.</li>
              </ul>
              
              <h3 className="font-semibold text-lg text-[hsl(var(--foreground))] mt-8 mb-2">3. Data Security</h3>
              <p>
                We implement a variety of security measures to maintain the safety of your personal information. Your data is stored in secured environments and is only accessible by authorized school personnel who have agreed to keep the information confidential.
              </p>

              <h3 className="font-semibold text-lg text-[hsl(var(--foreground))] mt-8 mb-2">4. Third-Party Access</h3>
              <p>
                We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website or servicing you, so long as those parties agree to keep this information confidential. (For example, our web hosting and secure file storage systems).
              </p>

              <h3 className="font-semibold text-lg text-[hsl(var(--foreground))] mt-8 mb-2">5. Changes to our Privacy Policy</h3>
              <p>
                We reserve the right to modify this privacy policy at any time. Any changes will be posted on this page immediately.
              </p>

              <h3 className="font-semibold text-lg text-[hsl(var(--foreground))] mt-8 mb-2">6. Contacting Us</h3>
              <p>
                If there are any questions regarding this privacy policy, you may contact us using the information available on our Contact page.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  )
}
