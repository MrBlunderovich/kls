import { Link, NavLink } from "react-router-dom";
import Logo from "../Logo/Logo";
import styles from "./Header.module.css";

export default function Header() {
  function getNavlinkClasses({ isActive }) {
    return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
  }

  return (
    <header className={styles.Header}>
      <div className="container">
        <div className={styles.flexContainer}>
          <Link className={styles.logoWrapper} to="logout">
            <Logo />
          </Link>
          <NavLink className={getNavlinkClasses} to="/warehouse">
            Склад
          </NavLink>
          <NavLink className={getNavlinkClasses} to="/distributors">
            Дистрибьюторы
          </NavLink>
        </div>
      </div>
    </header>
  );
}
