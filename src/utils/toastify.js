import { toast } from "react-toastify";

export default async function toastify(promise) {
  toast.promise(promise, {
    pending: "loading...",
    success: "loaded successfully",
    error: "failed to load",
  });
  return promise;
}
