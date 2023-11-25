import { toast } from "react-toastify";

export default function showToastError(error) {
  toast.error(error.message);
}
