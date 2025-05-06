import { useState, useEffect } from 'react';

export const useProgressiveImage = (src) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageSource, setImageSource] = useState(null);

  useEffect(() => {
    const image = new Image();
    image.src = src;

    image.onload = () => {
      setImageSource(src);
      setIsLoading(false);
    };

    image.onerror = (err) => {
      setError(err);
      setIsLoading(false);
    };

    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [src]);

  return { isLoading, error, imageSource };
};