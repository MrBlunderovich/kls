import styles from "./Header.module.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../Logo/Logo";
import CustomButton from "../UI/CustomButton/CustomButton";
import { PATHS } from "../../common/constants";

export default function Header() {
  //FIX_ME:
  const navigate = useNavigate();

  function getNavlinkClasses({ isActive }) {
    return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
  }

  return (
    <header className={styles.Header}>
      <div className="container">
        <div className={styles.flexContainer}>
          <span
            className={styles.logoWrapper}
            onClick={() => navigate("/table")}
          >
            <Logo />
          </span>
          <NavLink className={getNavlinkClasses} to={PATHS.products}>
            Склад
          </NavLink>
          <NavLink className={getNavlinkClasses} to={PATHS.distributors}>
            Дистрибьюторы
          </NavLink>
          <Link to={PATHS.logOut}>
            <CustomButton variant="secondary" height="low" width="narrow">
              Выйти
            </CustomButton>
          </Link>
        </div>
      </div>
    </header>
  );
}
