import { useEffect, useCallback, useState } from "react";
import axios from "axios";

export const useGetProjects = (limit, page, filter = "All") => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState([]);
  const [total, setTotal] = useState(0);
  const api = (import.meta.env.VITE_API || "").replace(/\/$/, "");

  const getData = useCallback(async (signal) => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (limit && page) { params.set("limit", String(limit)); params.set("page", String(page)); }
      if (filter) params.set("filter", filter);
      const response = await axios.get(`${api}/api/projects?${params.toString()}`, { signal });
      const payload = response.data?.data;
      setData(Array.isArray(payload?.projects) ? payload.projects : []);
      setFilters(Array.isArray(payload?.filters) ? payload.filters : []);
      setTotal(Number.isFinite(Number(payload?.total)) ? Number(payload.total) : (Array.isArray(payload?.projects) ? payload.projects.length : 0));
    } catch (err) {
      if (err.code === "ERR_CANCELED" || err.name === "CanceledError") return;
      setData([]);
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, [api, limit, page, filter]);

  useEffect(() => {
    const controller = new AbortController();
    getData(controller.signal);
    return () => controller.abort();
  }, [getData]);

  return { data, filters, total, totalPages: limit ? Math.max(1, Math.ceil(total / limit)) : 1, isLoading, error, refetch: () => getData() };
};
