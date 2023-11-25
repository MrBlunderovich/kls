import styles from "./NotFound.module.css";
import { Link } from "react-router-dom";
import CustomButton from "../../components/UI/CustomButton/CustomButton";

export default function NotFound() {
  return (
    <div className={styles.NotFound}>
      <p className={styles.oops}>Упс...!</p>
      <h2 className={styles.heading}>Ошибка 404</h2>
      <p className={styles.description}>
        Эта страница не найдена, мы уже работаем, чтобы ее восстановить!
      </p>
      <Link to="/" className={styles.buttonLink} replace>
        <CustomButton className={styles.button}>
          Вернуться на главную
        </CustomButton>
      </Link>
    </div>
  );
}
