import styles from "./DistributorInfo.module.css";
import formatPhone from "../../utils/formatPhone";
import logo from "../../assets/raster_logo.png";

export default function DistributorInfo({ info, variant = "large" }) {
  if (!info) return "No info";

  const { photo, name, inn, region, contact, contact2 } = info;

  return (
    <div
      className={`${styles.DistributorInfo} ${
        variant === "small" && styles.small
      }`}
    >
      <div className={styles.avatarWrapper}>
        <img
          className={styles.avatar}
          src={photo || logo}
          alt="distributor photo"
        />
      </div>
      <div className={styles.infoFlexContainer}>
        <InfoRow label="ФИО" value={name} />
        <InfoRow label="ИНН" value={inn} />
        <InfoRow label="Регион" value={region} />
        <InfoRow label="Контактный номер" value={formatPhone(contact, true)} />
        <InfoRow
          label="Контактный номер"
          value={formatPhone(contact2, true) || "-"}
        />
      </div>
    </div>
  );
}

function InfoRow({ label = "no label", value = "" }) {
  return (
    <div className={styles.InfoRow}>
      <span className={styles.infoLabel}>{label + ":"}</span>
      <span className={styles.infoContent}>{value}</span>
    </div>
  );
}
