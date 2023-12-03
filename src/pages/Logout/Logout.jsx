import { useEffect } from "react";
import styles from "./Logout.module.css";
import { useDispatch } from "react-redux";
import { logUserOut } from "../../redux/authSlice";

export default function Logout() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logUserOut());
  }, []);
  return (
    <div className={styles.Logout}>
      <h2>Logging out...</h2>
    </div>
  );
}
