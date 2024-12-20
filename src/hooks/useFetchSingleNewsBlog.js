import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axiosInstance";

export const useFetchSingleNewsBlog = ({ url, blogData, enabled = true }) => {
  return useQuery({
    queryKey: ["newsBlogSingle", url],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/news/" + url);
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid data format received from Single newsBlog API");
        }
        console.log("Fetched Single newsBlog data:");
        return response.data[0]; // Assume we are fetching a single blog object, not an array
      } catch (error) {
        console.error("Error fetching Single newsBlog data:", error);
        throw error;
      }
    },
    initialData: blogData, // Use the passed blogData as initial data
    enabled, // If blogData is null, it will trigger the fetch
    staleTime: 1000 * 60 * 5, // 5 min
    cacheTime: 1000 * 60 * 60 * 24 * 3, // 3 days
    onError: (error) => {
      console.error("Single NewsBlog data fetch error:", error);
    },
  });
};
