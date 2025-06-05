import { useState, useEffect } from "react";
import { getAdsData, getconfigData, getNotiData } from "./playerService";
import { decryptWithAes } from "./newEncryption";
import { useDispatch } from "react-redux";
import { setActiveTab } from "../pages/home/slice/HomeSlice";
import isEqual from 'lodash/isEqual';

export const useGetHeaderTopicsQuery = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const dispatch = useDispatch();

  const fetchHeaderTopics = async (forceRefresh = false) => {
    // setIsFetching(true);
    const settings = JSON.parse(localStorage.getItem("movieAppSettings") || "{}");

    try {
      const cachedData = localStorage.getItem("headerTopics");

      // **Step 1: Serve Cached Data Immediately**
      if (cachedData && !forceRefresh) {
        setData(JSON.parse(cachedData));
        setIsLoading(false);
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5000ms = 5 seconds
      }
      // **Step 2: Fetch Fresh Data in the Background**
      const response = await getconfigData(settings);
      const newData = response.data ? response : await decryptWithAes(response);

      // **Step 3: Update Cache & UI**
      localStorage.setItem("headerTopics", JSON.stringify(newData));
      setData(newData);
    } catch (err) {
      console.error("Failed to fetch header topics:", err);
      setError(err);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchHeaderTopics();
  }, []);

  return {
    data,
    isLoading,
    error,
    isFetching,
    refetch: () => fetchHeaderTopics(true), // Force refresh when refetching
  };
};

export const useGetAdsQuery = () => {
  const [configData, setConfigData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);

  const fetchAdsTopics = async (forceRefresh = false) => {
    // Don't set isFetching if we already have cached data and this isn't a forced refresh
    const cachedData = localStorage.getItem("AdsQuery");
    const hasCachedData = !!cachedData;
    
    if (!hasCachedData || forceRefresh) {
      setIsFetching(true);
    }
    setError(null);

    try {
      // Immediately show cached data unless forcing refresh
      if (cachedData && !forceRefresh) {
        const parsedData = JSON.parse(cachedData);
        setConfigData(parsedData);
        setIsLoading(false);
        setHasInitialized(true);
        
        // Skip fetching fresh data if cache is relatively fresh (within 5 minutes)
        const cacheTimestamp = localStorage.getItem("AdsQuery_timestamp");
        const now = Date.now();
        const fiveMinutes = 15 * 60 * 1000;
        
        if (cacheTimestamp && (now - parseInt(cacheTimestamp)) < fiveMinutes) {
          setIsFetching(false);
          return;
        }
      }

      // Fetch fresh data
      const response = await getAdsData();
      const newData = response.data ? response : await decryptWithAes(response);

      // Prevent unnecessary updates with deep comparison
      const currentCachedData = localStorage.getItem("AdsQuery");
      const parsedCurrentData = currentCachedData ? JSON.parse(currentCachedData) : null;

      if (!isEqual(newData, parsedCurrentData)) {
        localStorage.setItem("AdsQuery", JSON.stringify(newData));
        localStorage.setItem("AdsQuery_timestamp", Date.now().toString());
        setConfigData(newData);
      }
      
      setHasInitialized(true);
    } catch (err) {
      console.error("Failed to fetch Ads data:", err);
      setError(err);
      
      // If we have cached data, don't show error
      if (cachedData && !configData) {
        const parsedData = JSON.parse(cachedData);
        setConfigData(parsedData);
        setHasInitialized(true);
      }
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchAdsTopics();
  }, []);

  return {
    data: configData,
    isLoading: isLoading && !hasInitialized,
    isFetching,
    error,
    refetchAds: () => fetchAdsTopics(true),
  };
};

export const useGetNotificationQuery = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const dispatch = useDispatch();

  const fetchNotiInfo = async (forceRefresh = false) => {
    // setIsFetching(true);
    const settings = JSON.parse(localStorage.getItem("movieAppSettings") || "{}");

    try {
      const cachedData = localStorage.getItem("NotiInfo");

      // **Step 1: Serve Cached Data Immediately**
      if (cachedData && !forceRefresh) {
        setData(JSON.parse(cachedData));
        setIsLoading(false);
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5000ms = 5 seconds
      }

      // **Step 2: Fetch Fresh Data in the Background**
      const response = await getNotiData(settings);
      const newData = response.data ? response : await decryptWithAes(response);

      // **Step 3: Update Cache & UI**
      localStorage.setItem("NotiInfo", JSON.stringify(newData));
      setData(newData);
    } catch (err) {
      console.error("Failed to fetch header topics:", err);
      setError(err);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchNotiInfo();
  }, []);

  return {
    data,
    isLoading,
    error,
    isFetching,
    refetch: () => fetchNotiInfo(true), // Force refresh when refetching
  };
};