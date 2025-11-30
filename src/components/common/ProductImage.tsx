import React, { useState } from 'react';

interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  aspect?: string; // e.g. 'square', 'video', 'portrait'
  classNameWrapper?: string;
}

const aspectMap: Record<string, string> = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]'
};

export function ProductImage({
  src,
  alt,
  fallbackText = 'Image unavailable',
  aspect = 'square',
  className = '',
  classNameWrapper = '',
  ...rest
}: ProductImageProps) {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${aspectMap[aspect] || ''} ${classNameWrapper}`}>
      {!loaded && !errored && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300" />
      )}
      {!errored ? (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          loading="lazy"
          {...rest}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 text-xs text-gray-500 bg-gray-50 border border-dashed border-gray-300">
          <span className="mb-1 font-medium">{fallbackText}</span>
          <code className="break-all opacity-70">{src}</code>
        </div>
      )}
    </div>
  );
}

export default ProductImage;
