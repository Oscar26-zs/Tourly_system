import { useState, useRef, useEffect } from 'react';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Lang = { code: string; label: string; flag?: string };

export default function LanguageSwitcher({
  languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ],
  variant = 'compact',
  className = '',
}: {
  languages?: Lang[];
  variant?: 'compact' | 'full';
  className?: string;
}) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const current = languages.find((l) => i18n.language?.startsWith(l.code)) ?? languages[0];

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const change = (code: string) => {
    i18n.changeLanguage(code).catch((e) => console.error('i18n change', e));
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 text-white hover:text-green-400 transition-colors rounded-md"
      >
        <Languages className="w-4 h-4" />
        {variant === 'full' ? (
          <span className="text-sm hidden sm:inline">{current.flag} {current.label}</span>
        ) : (
          <span className="text-sm hidden md:inline">{current.code.toUpperCase()}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-neutral-900 border border-green-700/20 rounded-lg shadow-xl z-50">
          <div className="py-1">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => change(l.code)}
                className={`w-full text-left px-4 py-2 text-sm ${i18n.language?.startsWith(l.code) ? 'text-white bg-green-700/10' : 'text-zinc-300 hover:text-white hover:bg-neutral-700/30'}`}
                role="menuitem"
              >
                <span className="mr-2">{l.flag}</span>
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
