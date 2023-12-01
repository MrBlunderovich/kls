import styles from "./Loader.module.css";
import logo from "../../assets/logo.svg";

export default function Loader() {
  return (
    <div className={styles.Loader}>
      <img className={styles.logo} src={logo} alt="logo" height={200} />
    </div>
  );
}
