import { useLocation } from "react-router-dom";

const queryParams = new Map();

export function useQuery() {
  const location = useLocation();

  if (!queryParams.has(location.search)) {
    queryParams.set(location.search, new URLSearchParams(location.search));
  }

  return queryParams.get(location.search);
}
