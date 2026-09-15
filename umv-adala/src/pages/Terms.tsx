import { Scale } from 'lucide-react'
import { Seo } from '@/components/common/Seo'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'

export default function Terms() {
  return (
    <>
      <Seo titleString="Terms & Conditions | UMV Adla" path="/terms" />
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-12 mt-16 sm:mt-24">
        <SectionHeading title="Terms and Conditions" alignment="left" level={1} />

        <Reveal>
          <div className="mb-10 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Scale size={28} className="text-[hsl(var(--primary-strong))]" />
              <h2 className="font-display text-2xl font-semibold text-[hsl(var(--foreground))]">
                Website Terms of Use
              </h2>
            </div>
            
            <div className="space-y-6 text-[hsl(var(--muted-foreground))] leading-relaxed">
              <p>
                By accessing or using the Uma Vidyapeeth Adla (UMV Adla) website (umvadla.in), you agree to comply with and be bound by the following terms and conditions. If you do not agree to these terms, please do not use this website.
              </p>
              
              <h3 className="font-semibold text-lg text-[hsl(var(--foreground))] mt-8 mb-2">1. General Information</h3>
              <p>
                The content of the pages of this website is for your general information and use only. It is subject to change without notice. Our goal is to provide up-to-date and accurate information about the school, its curriculum, notices, and events.
              </p>
              
              <h3 className="font-semibold text-lg text-[hsl(var(--foreground))] mt-8 mb-2">2. Accuracy of Content</h3>
              <p>
                Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness, or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
              </p>
              
              <h3 className="font-semibold text-lg text-[hsl(var(--foreground))] mt-8 mb-2">3. Intellectual Property</h3>
              <p>
                This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, images, and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
              </p>

              <h3 className="font-semibold text-lg text-[hsl(var(--foreground))] mt-8 mb-2">4. User Conduct</h3>
              <p>
                You agree not to use the website in a way that may cause the website to be interrupted, damaged, rendered less efficient, or such that the effectiveness or functionality of the website is in any way impaired.
              </p>
              
              <h3 className="font-semibold text-lg text-[hsl(var(--foreground))] mt-8 mb-2">5. External Links</h3>
              <p>
                From time to time, this website may also include links to other websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s). We have no responsibility for the content of the linked website(s).
              </p>

              <h3 className="font-semibold text-lg text-[hsl(var(--foreground))] mt-8 mb-2">6. Governing Law</h3>
              <p>
                Your use of this website and any dispute arising out of such use of the website is subject to the local laws governing our school's physical location.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  )
}
