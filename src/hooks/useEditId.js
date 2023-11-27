import { useLocation, useParams } from "react-router-dom";
import useNavigateReplace from "./useNavigateReplace";

export default function useEditId() {
  const navigate404 = useNavigateReplace();
  const { id } = useParams();
  const { pathname } = useLocation();
  const isEdit = pathname.match("edit");
  if (isEdit && !id) navigate404();
  return { id, isEdit };
}
