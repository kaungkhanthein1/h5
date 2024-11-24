import { useState, useEffect } from "react";
import { getAdsData, getconfigData } from "./playerService";
import { decryptWithAes } from "./newEncryption";

export const useGetHeaderTopicsQuery = () => {
  const [configData, setConfigData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchHeaderTopics = async () => {
    setIsFetching(true);
    try {
      const response = await getconfigData();

      // console.log("response is=.", response);
      if (response) {
        const data = await decryptWithAes(response);
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
    fetchHeaderTopics();
  }, []);

  // console.log("configData is=>", configData);
  return {
    data: configData,
    isLoading,
    isFetching,
    error,
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
      const response = await getAdsData();

      if (response) {
        const data = await decryptWithAes(response);
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
