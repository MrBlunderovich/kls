import { toast } from "react-toastify";

export default function showToastLoader(promise) {
  return toast.promise(promise, {
    pending: "Загрузка...",
  });
}
