import { useState, useEffect } from "react";
import { getAdsData, getconfigData, getNotiData } from "./playerService";
import { decryptWithAes } from "./newEncryption";
import { useDispatch } from "react-redux";
import { setActiveTab } from "../pages/home/slice/HomeSlice";

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

  const fetchAdsTopics = async (forceRefresh = false) => {
    // setIsFetching(true);

    try {
      const cachedData = localStorage.getItem("AdsQuery");

      // **Step 1: Serve Cached Data Immediately**
      if (cachedData && !forceRefresh) {
        setConfigData(JSON.parse(cachedData));
        setIsLoading(false);
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5000ms = 5 seconds
      }
      // **Step 2: Fetch Fresh Data in the Background**
      const response = await getAdsData();
      const newData = response.data ? response : await decryptWithAes(response);
      // **Step 3: Update Cache & UI**
      localStorage.setItem("AdsQuery", JSON.stringify(newData));
      setConfigData(newData);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch Ads data:", err);
      setError(err);
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
    isLoading,
    isFetching,
    error,
    refetchAds: () => fetchAdsTopics(true), // Force refresh when refetching
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