// hooks/useCachedImage.ts
import { useEffect, useState } from 'react';
import { getCachedImage, storeImage } from './imageCache';

const useCachedImage = (imageUrl: string) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchAndCacheImage = async () => {
      try {
        const cachedUrl = await getCachedImage(imageUrl);
        if (cachedUrl) {
          if (isMounted) setImgSrc(cachedUrl);
          return;
        }

        const response = await fetch(imageUrl, { signal: controller.signal });
        const blob = await response.blob();
        await storeImage(imageUrl, blob);
        
        if (isMounted) {
          setImgSrc(URL.createObjectURL(blob));
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) setImgSrc(imageUrl); // Fallback to original URL
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAndCacheImage();

    return () => {
      isMounted = false;
      controller.abort();
      if (imgSrc) URL.revokeObjectURL(imgSrc);
    };
  }, [imageUrl]);

  return { imgSrc, isLoading };
};

export default useCachedImage;