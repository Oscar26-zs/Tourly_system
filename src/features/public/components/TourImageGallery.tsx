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
        // Una sola imagen ocupa todo el ancho
        return (
          <div className="h-full items-center justify-center flex">
            <img 
              src={images[0]} 
              alt="Tour imagen" 
              className="w-[75%] h-full object-cover rounded-lg hover:scale-105 hover:cursor-pointer transition-transform duration-300"
            />
          </div>
        );

      case 2:
        // Dos imágenes lado a lado
        return (
          <div className="grid grid-cols-2 gap-2 h-full">
            {images.map((image, index) => (
              <div key={index} className="relative overflow-hidden">
                <img 
                  src={image} 
                  alt={`Tour imagen ${index + 1}`} 
                  className={`w-full h-full object-cover hover:scale-105 hover:cursor-pointer transition-transform duration-300 ${
                    index === 0 ? 'rounded-l-lg' : 'rounded-r-lg'
                  }`}
                />
              </div>
            ))}
          </div>
        );

      case 3:
        // Una imagen principal (2/3) y dos thumbnails (1/3)
        return (
          <div className="grid grid-cols-3 gap-2 h-full">
            {/* Imagen principal */}
            <div className="col-span-2 relative overflow-hidden">
              <img 
                src={images[0]} 
                alt="Tour imagen principal" 
                className="w-full h-full object-cover rounded-l-lg hover:scale-105 hover:cursor-pointer transition-transform duration-300"
              />
            </div>
            
            {/* Thumbnails verticales */}
            <div className="col-span-1 grid grid-rows-2 gap-2">
              {images.slice(1, 3).map((image, index) => (
                <div key={index} className="relative overflow-hidden">
                  <img 
                    src={image} 
                    alt={`Tour imagen ${index + 2}`} 
                    className={`w-full h-full object-cover hover:scale-105 hover:cursor-pointer transition-transform duration-300 ${
                      index === 0 ? 'rounded-tr-lg' : 'rounded-br-lg'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        // Una imagen principal (1/2) y 3 thumbnails en grid (1/2)
        return (
          <div className="grid grid-cols-4 gap-2 h-full">
            {/* Imagen principal */}
            <div className="col-span-2 relative overflow-hidden">
              <img 
                src={images[0]} 
                alt="Tour imagen principal" 
                className="w-full h-full object-cover rounded-l-lg hover:scale-105 hover:cursor-pointer transition-transform duration-300"
              />
            </div>
            
            {/* Grid de 3 thumbnails */}
            <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-2">
              {images.slice(1, 4).map((image, index) => (
                <div 
                  key={index} 
                  className={`relative overflow-hidden ${
                    index === 0 ? 'col-span-2' : 'col-span-1'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`Tour imagen ${index + 2}`} 
                    className={`w-full h-full object-cover hover:scale-105 hover:cursor-pointer transition-transform duration-300 ${
                      index === 0 ? 'rounded-tr-lg' : ''
                    } ${index === 2 ? 'rounded-br-lg' : ''}`}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      default:
        // 5 o más imágenes - layout clásico con contador
        const mainImage = images[0];
        const thumbnails = images.slice(1, 5);
        const remainingCount = images.length - 5;

        return (
          <div className="grid grid-cols-4 gap-2 h-full">
            {/* Imagen principal */}
            <div className="col-span-2 relative overflow-hidden">
              <img 
                src={mainImage} 
                alt="Tour imagen principal" 
                className="w-full h-full object-cover rounded-l-lg hover:scale-105 hover:cursor-pointer transition-transform duration-300"
              />
            </div>
            
            {/* Grid de thumbnails */}
            <div className="col-span-2 grid grid-cols-2 gap-2">
              {thumbnails.map((image, index) => (
                <div key={index} className="relative overflow-hidden">
                  <img 
                    src={image} 
                    alt={`Tour imagen ${index + 2}`} 
                    className={`w-full h-full object-cover hover:scale-105 hover:cursor-pointer transition-transform duration-300 ${
                      index === 1 ? 'rounded-tr-lg' : ''
                    } ${index === 3 ? 'rounded-br-lg' : ''}`}
                  />
                  
                  {/* Overlay con contador en la última imagen si hay más fotos */}
                  {index === 3 && remainingCount > 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-br-lg hover:cursor-pointer">
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
      <div className="relative h-64 lg:h-80">
        {renderGallery()}
      </div>
    </div>
  );
}