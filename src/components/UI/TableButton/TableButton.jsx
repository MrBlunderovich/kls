import styles from "./TableButton.module.css";

export default function TableButton({ children, onClick }) {
  return (
    <button className={styles.TableButton} onClick={onClick}>
      {children}
    </button>
  );
}
