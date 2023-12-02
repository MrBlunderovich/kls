import { Navigate } from "react-router-dom";
import usePermissions from "../../hooks/usePermissions";

export default function DirectorOnly({ children }) {
  const { isDirector } = usePermissions();

  return isDirector ? children : <Navigate to={PATHS.notFound} replace />;
}
