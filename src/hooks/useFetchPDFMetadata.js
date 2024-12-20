import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axiosInstance";

export const useFetchPDFMetadata = ({ initialData, enabled = true }) => {
  

  return useQuery({
    queryKey: ["pdfMetadata"],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/pdf/metadata");
        if (!Array.isArray(response.data)) {
          throw new Error('Invalid data format received from API');
        }
        console.log("Fetched PDF metadata:", response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching PDF metadata:', error);
        throw error;
      }
    },
    initialData,
    enabled: !initialData && enabled,
    staleTime: 1000 * 60 * 5, // 5 min
    cacheTime: 1000 * 60 * 60 * 24 * 3, // 3 days

    // Add error handling
    onError: (error) => {
      console.error('PDF metadata fetch error:', error);
    }
  });
};