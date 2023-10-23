import { useNavigate } from "react-router-dom";
import styles from "./PageHeading.module.css";
import KolosModal from "../KolosModal/KolosModal";
import CustomButton from "../UI/CustomButton/CustomButton";
import { useState } from "react";

export default function PageHeading({
  heading,
  buttonText = "Отменить",
  modalOnLeave = false,
}) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.PageHeading}>
        <button
          className={styles.goBack}
          onClick={
            modalOnLeave
              ? () => {
                  setShowModal(true);
                }
              : () => navigate(-1)
          }
        >
          <span className={styles.angleBracket}></span>
          {buttonText}
        </button>
        <h1 className={styles.heading}>{heading}</h1>
      </div>
      {modalOnLeave && showModal && (
        <KolosModal message="Вы точно хотите отменить всё и покинуть страницу?">
          <CustomButton
            height="low"
            variant="primary"
            onClick={() => {
              setShowModal(false);
              navigate(-1);
            }}
          >
            Да
          </CustomButton>
          <CustomButton
            height="low"
            variant="secondary"
            onClick={() => {
              setShowModal(false);
            }}
          >
            Нет
          </CustomButton>
        </KolosModal>
      )}
    </>
  );
}
