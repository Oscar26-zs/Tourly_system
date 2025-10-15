import { Twitter, Instagram, Facebook, Music } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full bg-neutral-900/95 border-t border-green-700/20 text-zinc-300">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Logo + description + social icons */}
          <div>
            <div className="mb-4">
              <span className="text-white font-semibold text-lg">Tourly</span>
            </div>
            <p className="text-zinc-400 text-sm max-w-xs mb-4">
              Descubre tours y experiencias asombrosas alrededor del mundo. Reserva con confianza y crea recuerdos inolvidables.
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
            <h4 className="text-white font-semibold mb-4">Popular Destinations</h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li className="hover:text-white transition cursor-pointer">Guanacaste</li>
              <li className="hover:text-white transition cursor-pointer">Limon</li>
              <li className="hover:text-white transition cursor-pointer">Puntarenas</li>
              <li className="hover:text-white transition cursor-pointer">Manuel Antonio</li>
              <li className="hover:text-white transition cursor-pointer">Monteverde</li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li className="hover:text-white transition cursor-pointer">Help Center</li>
              <li className="hover:text-white transition cursor-pointer">Contact Us</li>
              <li className="hover:text-white transition cursor-pointer">Cancellation Policy</li>
              <li className="hover:text-white transition cursor-pointer">Safety Guidelines</li>
              <li className="hover:text-white transition cursor-pointer">Terms of Service</li>
            </ul>
          </div>

          {/* Column 4: Stay Updated (newsletter) */}
          <div>
            <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
            <p className="text-zinc-400 text-sm mb-4">Get the latest deals and travel inspiration delivered to your inbox.</p>

            <form className="flex flex-col sm:flex-row gap-3 items-center" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                aria-label="Email"
                placeholder="Enter your email"
                className="w-full sm:flex-1 bg-neutral-800 placeholder:text-zinc-400 text-white px-4 py-2 rounded-md border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <button className="w-full sm:w-auto bg-green-700 hover:bg-green-600 text-white font-medium px-5 py-2 rounded-md transition">
                Suscribirse
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-700/30 pt-6">
          <div className="text-center text-zinc-400 text-sm">© {new Date().getFullYear()} Tourly. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}
