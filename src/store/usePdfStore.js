// stores/usePdfStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const usePdfStore = create(
  devtools(
    (set) => ({
      latestPdfUrl: null,
      pdfMetadata: [],
      isLoading: true,
      isHydrated: false,

      setPdfMetadata: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          const latestPdf = data[0];
          set({
            pdfMetadata: data,
            latestPdfUrl: latestPdf.pdfUrl,
            isLoading: false,
            isHydrated: true
          });
        } else {
          set({
            pdfMetadata: [],
            latestPdfUrl: null,
            isLoading: false,
            isHydrated: true
          });
        }
      },

      reset: () => 
        set(
          {
            latestPdfUrl: null,
            pdfMetadata: [],
            isLoading: true,
            isHydrated: false
          },
          false,
          'reset'
        )
    }),
    {
      name: 'PDF Store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

export default usePdfStore;