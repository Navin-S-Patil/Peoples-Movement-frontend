import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useNewsBlogStore = create(
  devtools(
    (set, get) => ({
      newsBlogData: [],
      newsBlogMap: new Map(),
      isHydrated: false,

      setNewsBlogData: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          set((state) => {
            const newBlogs = data;
            const newBlogsMap = new Map();
            newBlogs.forEach((blog) => {
              newBlogsMap.set(blog.newsId, blog);
            });
            return { 
              newsBlogData: data, 
              newsBlogMap: newBlogsMap,
              isHydrated: true 
            };
          });
        } else {
          set({
            newsBlogData: [],
            newsBlogMap: new Map(),
            isHydrated: true
          });
        }
      },

      getBlogById: (id) => {
        const blogs = get().newsBlogMap;
        return blogs.get(id);
      },

      reset: () =>
        set(
          {
            newsBlogData: [],
            newsBlogMap: new Map(),
            isHydrated: false
          },
          false,
          "reset"
        ),
    }),
    {
      name: "NewsBlog Store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

export default useNewsBlogStore;