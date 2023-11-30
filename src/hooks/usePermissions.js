import { useSelector } from "react-redux";

export default function usePermissions() {
  //const { user } = useSelector((state) => state.auth);
  const user = "Директор";
  return {
    isDirector: user === "Директор",
    isOfficer: user === "Завсклад",
    isGuest: user === "Гость",
  };
}