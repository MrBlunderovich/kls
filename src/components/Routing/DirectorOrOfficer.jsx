import { Navigate } from "react-router-dom";
import usePermissions from "../../hooks/usePermissions";

export default function DirectorOrOfficer({ children }) {
  const { isOfficer, isDirector } = usePermissions();

  return isDirector || isOfficer ? (
    children
  ) : (
    <Navigate to={PATHS.notFound} replace />
  );
}
