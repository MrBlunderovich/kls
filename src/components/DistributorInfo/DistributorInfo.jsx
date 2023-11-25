import styles from "./DistributorInfo.module.css";

export default function DistributorInfo({ info, variant = "large" }) {
  if (!info) return "No info";

  const { name, inn, region, contact, contact2 } = info;

  return (
    <div
      className={`${styles.DistributorInfo} ${
        variant === "small" && styles.small
      }`}
    >
      <img
        className={styles.avatar}
        src="/temporary_distributor_image.png"
        alt="distributor photo"
      />
      <div className={styles.infoFlexContainer}>
        <InfoRow label="ФИО" value={name} />
        <InfoRow label="ИНН" value={inn} />
        <InfoRow label="Регион" value={region} />
        <InfoRow label="Контактный номер" value={contact} />
        <InfoRow label="Контактный номер" value={contact2} />
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
