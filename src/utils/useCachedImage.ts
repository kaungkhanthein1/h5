// hooks/useCachedImage.ts
import { useEffect, useState } from 'react';
import { getCachedImage, storeImage } from '../utils/imageCache';

const useCachedImage = (imageUrl: string) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchAndCacheImage = async () => {
      try {
        const cachedImage = await getCachedImage(imageUrl);
        if (cachedImage) {
          if (isMounted) setImgSrc(cachedImage);
          setIsLoading(false);
          return;
        }

        const response = await fetch(imageUrl, { signal: controller.signal });
        const blob = await response.blob();
        await storeImage(imageUrl, blob);
        
        const newCachedImage = await getCachedImage(imageUrl);
        if (isMounted && newCachedImage) {
          setImgSrc(newCachedImage);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) setImgSrc(imageUrl); // Fallback to original URL
        setIsLoading(false);
      }
    };

    if (imageUrl) {
      fetchAndCacheImage();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [imageUrl]);

  return { imgSrc, isLoading };
};

export default useCachedImage;