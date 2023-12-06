import styles from "./Login.module.css";
import eyeIconShow from "../../assets/icons/eye.svg";
import eyeIconHide from "../../assets/icons/eyeslash.svg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { authActions, logUserIn } from "../../redux/authSlice";
import { ACCESS_DENIED_ERROR, TRY_AGAIN_ERROR } from "../../common/constants";
import CustomButton from "../../components/UI/CustomButton/CustomButton";

export default function Login() {
  const [username, setLogin] = useState("director");
  const [password, setPassword] = useState("dev54321");
  const [hidePassword, setHidePassword] = useState(true);
  const { error, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fieldsAreEmpty = !username || !password;

  function handleSubmit(event) {
    event.preventDefault();
    const formData = {
      username,
      password,
    };
    dispatch(logUserIn(formData));
  }

  useEffect(() => {
    dispatch(authActions.clearError());
  }, [username, password]);

  useEffect(() => {
    if (error === ACCESS_DENIED_ERROR) {
      setLogin("");
      setPassword("");
    }
  }, [error]);

  return (
    <div className={styles.LoginPage}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>Авторизация</h2>
        {/*  */}
        <label className={styles.label}>
          <p className={styles.inputCaption}>Логин</p>
          <input
            className={`${styles.input} ${error && styles.invalid}`}
            type="text"
            name="login"
            value={username}
            onChange={(event) => setLogin(event.target.value)}
            autoComplete="off"
            disabled={error === ACCESS_DENIED_ERROR}
            autoFocus={true}
          />
        </label>
        {/*  */}
        <label className={styles.label}>
          <p className={styles.inputCaption}>Пароль</p>
          <div className={styles.inputWrapper}>
            <input
              className={`${styles.input} ${error && styles.invalid}`}
              type={hidePassword ? "password" : "text"}
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="off"
              disabled={error === ACCESS_DENIED_ERROR}
            />
            <img
              className={styles.passwordIcon}
              role="button"
              src={hidePassword ? eyeIconHide : eyeIconShow}
              alt="show password"
              onClick={() => setHidePassword(!hidePassword)}
            />
          </div>
        </label>
        <CustomButton
          className={styles.submitButton}
          width="full"
          height="auth"
          disabled={fieldsAreEmpty || error === ACCESS_DENIED_ERROR}
          type={isLoading ? "button" : "submit"}
        >
          {isLoading ? "Загрузка..." : "Войти"}
        </CustomButton>
        <p className={styles.error}>
          {error === ACCESS_DENIED_ERROR &&
            "Программа временно не работает. Обратитесь к администратору!"}
          {error === TRY_AGAIN_ERROR &&
            "Неправильные данные! Попробуйте еще раз!"}
        </p>
      </form>
    </div>
  );
}
