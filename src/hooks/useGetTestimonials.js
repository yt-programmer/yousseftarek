import { useEffect, useState } from "react";
import axios from "axios";

const useGetTestimonials = (limit, page) => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const api = import.meta.env.VITE_API;
  const getData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${api}/api/testimonials?${limit && page ? `limit=${limit}&page=${page}` : ""}`,
      );
      if (data.error) {
        setError(data.error);
        return;
      }
      setTestimonials(data.data.testimonials);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [api, limit, page]);
  return { testimonials, isLoading, error, refetch: getData };
};

export { useGetTestimonials };
