import { toast } from "react-toastify";

export default function showToastError(incomingError) {
  try {
    const response = JSON.parse(incomingError.message);
    const message = Object.values(response).join("<br/>");
    toast.error(message);
  } catch (error) {
    console.warn(error);
    toast.error(incomingError.message);
  }
}
