import { useLocation, useParams } from "react-router-dom";
import useNavigateReplace from "./useNavigateReplace";

export default function useReturnId() {
  const { id } = useParams();
  const navigate404 = useNavigateReplace();
  if (!id) navigate404();
  const { pathname } = useLocation();
  const isReturn = pathname.match("return");
  return { id, isReturn };
}
