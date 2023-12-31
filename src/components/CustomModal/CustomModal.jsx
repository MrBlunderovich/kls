import KolosModal from "../KolosModal/KolosModal";
import CustomButton from "../UI/CustomButton/CustomButton";

/**
 *
 * @example
 * {showModal && (
 *   <CustomModal
 *         message="Вы точно хотите отменить всё и покинуть страницу?"
 *         primaryAction={() => {
 *           setShowModal(false);
 *           navigate(backLink);
 *         }}
 *         secondaryAction={() => {
 *           setShowModal(false);
 *         }}
 *       />
 * )}
 */
export default function CustomModal({
  message = "I'm a default message. Change me!",
  primaryLabel = "Да",
  secondaryLabel = "Нет",
  primaryAction = () => console.log(primaryLabel),
  secondaryAction = () => console.log(secondaryLabel),
}) {
  return (
    <KolosModal message={message}>
      <CustomButton variant="primary" height="low" onClick={primaryAction}>
        {primaryLabel}
      </CustomButton>
      <CustomButton variant="secondary" height="low" onClick={secondaryAction}>
        {secondaryLabel}
      </CustomButton>
    </KolosModal>
  );
}
