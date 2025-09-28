interface TourImageGalleryProps {
  images: string[];
}

export function TourImageGallery({ images }: TourImageGalleryProps) {
  // Si no hay imágenes, mostrar placeholder
  if (!images || images.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-8">
        <div className="relative h-64 lg:h-80 bg-gray-800 flex items-center justify-center rounded-lg">
          <span className="text-gray-400">No hay imágenes disponibles</span>
        </div>
      </div>
    );
  }

  const imageCount = images.length;

  // Función para renderizar según la cantidad de imágenes
  const renderGallery = () => {
    switch (imageCount) {
      case 1:
        // Una sola imagen centrada con ancho máximo del 80%
        return (
          <div className="h-full flex items-center justify-center bg-gray-800 rounded-lg">
            <img 
              src={images[0]} 
              alt="Tour imagen" 
              className="max-w-full max-h-full object-contain rounded-lg hover:scale-105 hover:cursor-pointer transition-transform duration-300"
            />
          </div>
        );

      case 2:
        // Dos imágenes lado a lado con gap
        return (
          <div className="grid grid-cols-2 gap-3 h-full">
            {images.map((image, index) => (
              <div key={index} className="relative bg-gray-800 rounded-lg overflow-hidden">
                <img 
                  src={image} 
                  alt={`Tour imagen ${index + 1}`} 
                  className="w-full h-full object-cover hover:scale-105 hover:cursor-pointer transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        );

      case 3:
        // Primera imagen arriba ocupando todo el ancho, dos abajo
        return (
          <div className="grid grid-rows-2 gap-3 h-full">
            {/* Imagen principal arriba */}
            <div className="relative bg-gray-800 rounded-lg overflow-hidden">
              <img 
                src={images[0]} 
                alt="Tour imagen principal" 
                className="w-full h-full object-cover hover:scale-105 hover:cursor-pointer transition-transform duration-300"
              />
            </div>
            
            {/* Dos imágenes abajo */}
            <div className="grid grid-cols-2 gap-3">
              {images.slice(1, 3).map((image, index) => (
                <div key={index} className="relative bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`Tour imagen ${index + 2}`} 
                    className="w-full h-full object-cover hover:scale-105 hover:cursor-pointer transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        // Grid de 2x2
        return (
          <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full">
            {images.slice(0, 4).map((image, index) => (
              <div key={index} className="relative bg-gray-800 rounded-lg overflow-hidden">
                <img 
                  src={image} 
                  alt={`Tour imagen ${index + 1}`} 
                  className="w-full h-full object-cover hover:scale-105 hover:cursor-pointer transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        );

      default:
        // 5 o más imágenes - Layout tipo Instagram
        const mainImage = images[0];
        const sideImages = images.slice(1, 5);
        const remainingCount = images.length - 5;

        return (
          <div className="grid grid-cols-4 gap-3 h-full">
            {/* Imagen principal ocupando 2 columnas */}
            <div className="col-span-2 relative bg-gray-800 rounded-lg overflow-hidden">
              <img 
                src={mainImage} 
                alt="Tour imagen principal" 
                className="w-full h-full object-cover hover:scale-105 hover:cursor-pointer transition-transform duration-300"
              />
            </div>
            
            {/* Grid de 4 thumbnails (2x2) */}
            <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-3">
              {sideImages.map((image, index) => (
                <div key={index} className="relative bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`Tour imagen ${index + 2}`} 
                    className="w-full h-full object-cover hover:scale-105 hover:cursor-pointer transition-transform duration-300"
                  />
                  
                  {/* Overlay con contador en la última imagen si hay más fotos */}
                  {index === 3 && remainingCount > 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center hover:cursor-pointer rounded-lg">
                      <span className="text-white text-xl font-bold">
                        +{remainingCount}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 pt-8 mb-8">
      <div className="relative h-72 lg:h-136">
        {renderGallery()}
      </div>
    </div>
  );
}