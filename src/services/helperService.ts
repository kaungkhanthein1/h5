import { useState, useEffect } from "react";
import { getAdsData, getconfigData } from "./playerService";
import { decryptWithAes } from "./newEncryption";
import { useDispatch } from "react-redux";
import { setActiveTab } from "../pages/home/slice/HomeSlice";

export const useGetHeaderTopicsQuery = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const dispatch = useDispatch();

  const fetchHeaderTopics = async () => {
    const settings = JSON.parse(
      localStorage.getItem("movieAppSettings") || "{}"
    );

    try {
      const cachedData = sessionStorage.getItem("headerTopics");
      if (cachedData) {
        setData(JSON.parse(cachedData));
        setIsLoading(false);
        return;
      }

      if (settings?.filterToggle) {
        dispatch(setActiveTab(0));
      }

      const response = await getconfigData(settings);
      const data = await decryptWithAes(response);

      sessionStorage.setItem("headerTopics", JSON.stringify(data));
      setData(data);
    } catch (err) {
      console.error("Failed to fetch header topics:", err);
      setError(err);
    } finally {
      setIsLoading(false);
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
    refetch: fetchHeaderTopics,
  };
};

export const useGetAdsQuery = () => {
  const [configData, setConfigData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchAdsTopics = async () => {
    setIsFetching(true);
    try {
      const cachedData = sessionStorage.getItem("AdsQuery");

      if (cachedData) {
        setConfigData(JSON.parse(cachedData));
        setIsLoading(false);
        return;
      }
      const response = await getAdsData();

      if (response) {
        const data = await decryptWithAes(response);
        sessionStorage.setItem("AdsQuery", JSON.stringify(data));
        setConfigData(data);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch header topics:", err);
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
    refetch: fetchAdsTopics,
  };
};
