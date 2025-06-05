// hooks/useCachedImage.ts
import { useEffect, useState, useRef } from 'react';
import { getCachedImage, storeImage } from '../utils/imageCache';

const failedUrls = new Set<string>(); // Track URLs that have failed to fetch
const pendingFetches = new Map<string, Promise<string | null>>(); // Prevent duplicate fetches

const useCachedImage = (imageUrl: string) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (!imageUrl) {
      setIsLoading(false);
      return;
    }

    const fetchAndCacheImage = async () => {
      try {
        // Check if this URL is already being fetched
        if (pendingFetches.has(imageUrl)) {
          const result = await pendingFetches.get(imageUrl)!;
          if (isMountedRef.current) {
            setImgSrc(result || imageUrl);
            setIsLoading(false);
          }
          return;
        }

        // Check cache first
        const cachedImage = await getCachedImage(imageUrl);
        if (cachedImage) {
          if (isMountedRef.current) {
            setImgSrc(cachedImage);
            setIsLoading(false);
          }
          return;
        }

        // Skip fetch if URL has previously failed
        if (failedUrls.has(imageUrl)) {
          if (isMountedRef.current) {
            setImgSrc(imageUrl);
            setIsLoading(false);
          }
          return;
        }

        // Create fetch promise and store it to prevent duplicates
        const fetchPromise = (async () => {
          try {
            const controller = new AbortController();
            const response = await fetch(imageUrl, { 
              signal: controller.signal,
              cache: 'force-cache' // Try to use browser cache first
            });
            
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }
            
            const blob = await response.blob();
            await storeImage(imageUrl, blob);
            
            const newCachedImage = await getCachedImage(imageUrl);
            pendingFetches.delete(imageUrl);
            return newCachedImage;
          } catch (error) {
            pendingFetches.delete(imageUrl);
            failedUrls.add(imageUrl);
            throw error;
          }
        })();

        pendingFetches.set(imageUrl, fetchPromise);
        
        const result = await fetchPromise;
        if (isMountedRef.current) {
          setImgSrc(result || imageUrl);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMountedRef.current) {
          setImgSrc(imageUrl); // Fallback to original URL
          setIsLoading(false);
        }
      }
    };

    fetchAndCacheImage();

    return () => {
      isMountedRef.current = false;
    };
  }, [imageUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return { imgSrc, isLoading };
};

export default useCachedImage;