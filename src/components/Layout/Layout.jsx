import styles from "./Layout.module.css";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../Header/Header";

export default function Layout() {
  return (
    <div className={styles.Layout}>
      <Header />
      <Outlet />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        draggable={false}
      />
    </div>
  );
}
