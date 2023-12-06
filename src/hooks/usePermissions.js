import { useSelector } from "react-redux";

export default function usePermissions() {
  const { user } = useSelector((state) => state.auth);

  return {
    isDirector: user === "Директор",
    isOfficer: user === "Завсклад",
    isGuest: user === "Гость",
  };
}
