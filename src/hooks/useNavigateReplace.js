import { useNavigate } from "react-router-dom";
import { PATHS } from "../common/constants";

export default function useNavigateReplace(
  destination = PATHS.notFound,
  replace = true,
) {
  const navigate = useNavigate();
  return (payload) => navigate(destination, { replace, state: payload });
}
