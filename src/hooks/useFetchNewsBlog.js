import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axiosInstance";

export const useFetchNewsBlog = ({ initialData, enabled = true }) => {
  return useQuery({
    queryKey: ["newsBlogAll"],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/news");
        if (!Array.isArray(response.data)) {
          throw new Error("Invalid data format received from newsBlog API");
        }
        console.log("Fetched newsBlog data:");
        return response.data;
      } catch (error) {
        console.error("Error fetching newsBlog data:", error);
        throw error;
      }
    },
    initialData,
    enabled: !initialData && enabled,
    staleTime: 1000 * 60 * 5, // 5 min
    cacheTime: 1000 * 60 * 60 * 24 * 3, // 3 days

    // Add error handling
    onError: (error) => {
      console.error("NewsBlog data fetch error:", error);
    },
  });
};