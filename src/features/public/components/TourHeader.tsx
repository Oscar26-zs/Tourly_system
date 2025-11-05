import { useTranslation } from 'react-i18next';

interface TourHeaderProps {
  title: string;
  location: string;
  price: number;
}

export function TourHeader({ title, location, price }: TourHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 lg:gap-6">
      {/* Información del tour */}
      <div className="flex-1">
        {/* Ubicación */}
        <div className="flex items-center text-gray-400 mb-3 lg:mb-4">
          <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm lg:text-lg">{location}</span>
        </div>
        
        {/* Título */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
          {title}
        </h1>
      </div>
      
      {/* Precio */}
      <div className="text-left lg:text-right">
        <div className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-green-700 mb-1">
          ${price}
        </div>
        <div className="text-gray-400 text-sm lg:text-lg">
          {t('public.tourHeader.perPerson')}
        </div>
      </div>
    </div>
  );
}