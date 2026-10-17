import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const API = `${(import.meta.env.VITE_API || "").replace(/\/$/, "")}/api/testimonials`;

const useGetTestimonials = (limit, page) => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const getData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (limit) params.set("limit", String(limit));
      if (page) params.set("page", String(page));
      const { data } = await axios.get(`${API}?${params.toString()}`);
      if (data?.error || data?.status === "error" || data?.status === "fail") {
        throw new Error(data.message || data.error || "Could not load testimonials");
      }
      setTestimonials(data?.data?.testimonials || []);
    } catch (err) {
      setError(err.response?.data?.message || (err.code === "ERR_NETWORK" ? "Network/CORS error. Check that the API URL is correct and the backend allows this website origin." : err.message || "Something went wrong"));
    } finally {
      setIsLoading(false);
    }
  }, [limit, page]);

  useEffect(() => { getData(); }, [getData]);
  return { testimonials, isLoading, error, refetch: getData };
};

export { useGetTestimonials };
