// When the admin session expires (or is revoked) while the dashboard is open, every protected request answers 401.
// Instead of a silent "could not save" toast, send the admin to the login page.
// Login/me calls are excluded: a 401 there is a normal answer, not an expired session.
export const installAuthInterceptor = (axiosInstance, onUnauthorized) =>
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      const url = String(error?.config?.url || "");
      if (status === 401 && error?.config?.withCredentials && !url.includes("/api/auth/")) onUnauthorized();
      return Promise.reject(error);
    },
  );
