import { Link } from "react-router-dom";
import angleBracketLeftIcon from "../../assets/icons/fi-sr-angle-small-left.svg";
import styles from "./PageHeading.module.css";

export default function PageHeading({ heading, buttonText = "Отменить" }) {
  return (
    <div className={styles.PageHeading}>
      <Link className={styles.goBack} to={-1}>
        <img src={angleBracketLeftIcon} alt="icon" />
        {buttonText}
      </Link>
      <h1 className={styles.heading}>{heading}</h1>
    </div>
  );
}
