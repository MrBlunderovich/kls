import { useParams } from "react-router-dom";

export default function useEditId() {
  const { id } = useParams();
  const isEdit = id !== undefined;
  return { id, isEdit };
}
