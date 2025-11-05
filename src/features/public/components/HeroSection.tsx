import { useTranslation } from 'react-i18next';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center space-y-6 md:space-y-8 px-4">
      {/* Title */}
      <div className="w-full max-w-4xl flex flex-col justify-center items-center gap-2">
        <div className="text-center text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-inter leading-tight">
          {t('public.hero.title1')}
        </div>
        <div className="text-center text-green-700 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-inter leading-tight">
          {t('public.hero.title2')}
        </div>
      </div>

      {/* Subtitle */}
      <div className="w-full max-w-4xl">
        <div className="text-center text-zinc-400 text-base sm:text-lg md:text-xl lg:text-2xl font-medium font-poppins leading-relaxed">
          {t('public.hero.subtitle')}
        </div>
      </div>
    </div>
  );
}