interface TourOverviewProps {
  description: string;
  includes: string[];
  notIncludes: string[];
}

export function TourOverview({ description, includes, notIncludes }: TourOverviewProps) {
  const highlights = [
    "Horseback riding experience along the stunning Manzanillo Beach",
    "Professional local guide with expert knowledge of the area",
    "Small group experience (max 10 people)",
    "Perfect for beginners and experienced riders alike",
    "Free cancellation up to 24 hours before",
    "Mobile ticket – no printing required"
  ];

  return (
    <div className="space-y-8">
      {/* Descripción */}
      <div>
        <p className="text-gray-300 text-lg leading-relaxed">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tour Highlights */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Tour Highlights</h3>
          <ul className="space-y-3">
            {highlights.map((highlight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-400 mr-3 mt-1">•</span>
                <span className="text-gray-300">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What's Included */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">What's Included</h3>
          
          {/* Incluye */}
          <div className="mb-6">
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-400 mr-3 mt-1">•</span>
                <span className="text-gray-300">Professional tour guide</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3 mt-1">•</span>
                <span className="text-gray-300">Well-trained horse suited to your riding level</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3 mt-1">•</span>
                <span className="text-gray-300">Safety equipment (helmet included)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3 mt-1">•</span>
                <span className="text-gray-300">Complimentary water bottle</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3 mt-1">•</span>
                <span className="text-gray-300">Digital photo package</span>
              </li>
              {includes.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">•</span>
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* No incluye */}
          {notIncludes.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-white mb-3">Not Included</h4>
              <ul className="space-y-2">
                {notIncludes.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-400 mr-3 mt-1">•</span>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}