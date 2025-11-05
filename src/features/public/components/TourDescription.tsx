import { useTranslation } from 'react-i18next';

interface TourDescriptionProps {
  description: string;
}

export function TourDescription({ description }: TourDescriptionProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold text-base mb-2">{t('public.tourDescription.title')}</h3>
        <p className="text-gray-300 text-lg leading-relaxed">
          {description || t('public.tourDescription.noDescription')}
        </p>
      </div>
    </div>
  );
}