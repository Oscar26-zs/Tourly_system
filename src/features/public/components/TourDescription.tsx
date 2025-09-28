interface TourDescriptionProps {
  description: string;
}

export function TourDescription({ description }: TourDescriptionProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-300 text-lg leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}