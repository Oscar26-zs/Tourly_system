import { Twitter, Instagram, Facebook, Music } from 'lucide-react'
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-neutral-900/95 border-t border-green-700/20 text-zinc-300">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Logo + description + social icons */}
          <div>
            <div className="mb-4">
              <span className="text-white font-semibold text-lg">{t('navbar.tourly')}</span>
            </div>
            <p className="text-zinc-400 text-sm max-w-xs mb-4">
              {t('footer.description')}
            </p>

            <div className="flex items-center gap-3 mt-2">
              <button aria-label="TikTok" className="p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 transition">
                <Music className="w-5 h-5 text-white" />
              </button>
              <button aria-label="Instagram" className="p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 transition">
                <Instagram className="w-5 h-5 text-white" />
              </button>
              <button aria-label="Twitter" className="p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 transition">
                <Twitter className="w-5 h-5 text-white" />
              </button>
              <button aria-label="Facebook" className="p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 transition">
                <Facebook className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Column 2: Popular Destinations */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.popularDestinations')}</h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li className="hover:text-white transition cursor-pointer">{t('footer.destinations.guanacaste')}</li>
              <li className="hover:text-white transition cursor-pointer">{t('footer.destinations.limon')}</li>
              <li className="hover:text-white transition cursor-pointer">{t('footer.destinations.puntarenas')}</li>
              <li className="hover:text-white transition cursor-pointer">{t('footer.destinations.manuelAntonio')}</li>
              <li className="hover:text-white transition cursor-pointer">{t('footer.destinations.monteverde')}</li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.support')}</h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li className="hover:text-white transition cursor-pointer">{t('footer.supportItems.helpCenter')}</li>
              <li className="hover:text-white transition cursor-pointer">{t('footer.supportItems.contactUs')}</li>
              <li className="hover:text-white transition cursor-pointer">{t('footer.supportItems.cancellationPolicy')}</li>
              <li className="hover:text-white transition cursor-pointer">{t('footer.supportItems.safetyGuidelines')}</li>
              <li className="hover:text-white transition cursor-pointer">{t('footer.supportItems.termsOfService')}</li>
            </ul>
          </div>

          {/* Column 4: Stay Updated (newsletter) */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.stayUpdated')}</h4>
            <p className="text-zinc-400 text-sm mb-4">{t('footer.newsletter.text')}</p>

            <form className="flex flex-col sm:flex-row gap-3 items-center" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                aria-label="Email"
                placeholder={t('footer.newsletter.placeholder')}
                className="w-full sm:flex-1 bg-neutral-800 placeholder:text-zinc-400 text-white px-4 py-2 rounded-md border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <button className="w-full sm:w-auto bg-green-700 hover:bg-green-600 text-white font-medium px-5 py-2 rounded-md transition">
                {t('footer.newsletter.subscribe')}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-700/30 pt-6">
          <div className="text-center text-zinc-400 text-sm">{t('footer.copyright', { year: new Date().getFullYear() })}</div>
        </div>
      </div>
    </footer>
  )
}
