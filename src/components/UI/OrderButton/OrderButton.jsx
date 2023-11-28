import React from "react";
import styles from "./OrderButton.module.css";
import deleteIcon from "../../../assets/icons/delete.svg";
import addIcon from "../../../assets/icons/add.svg";

/**
 * @typedef {'add'|'remove'} Variant
 * @param {Object} param0
 * @param {Variant} [param0.variant="add"]
 */
export default function OrderButton({
  variant = "add",
  onClick = () => {},
  className = "",
  disabled,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${styles.OrderButton} ${className}`}
    >
      <img
        src={variant === "remove" ? deleteIcon : addIcon}
        alt={variant}
        width={12}
      />
    </button>
  );
}
