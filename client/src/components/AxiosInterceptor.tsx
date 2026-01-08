import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axiosInstance from "@/service/apiInstance";

function AxiosInterceptor({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        // Get the active token
        const token = await getToken();

        // If token exists, add it to headers
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Cleanup when component unmounts
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
    };
  }, [getToken]);

  return children;
}

export default AxiosInterceptor;
