import { useEffect, useState } from "react";
import axios from "axios";
export const useGetProjects = (limit, page) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const api = import.meta.env.VITE_API;

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `${api}/api/projects?limit=${limit}&page=${page}`,
        );
        if (data.error) {
          setError(data.error);
          return;
        }

        setData(data.data.projects);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Something went wrong",
        );
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [limit, page, api]);

  return {
    data,
    isLoading,
    error,
  };
};
