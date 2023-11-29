import styles from "./QuantityController.module.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import upIcon from "../../../assets/icons/bxs_up-arrow.svg";
import downIcon from "../../../assets/icons/bxs_down-arrow.svg";
import { ALLOW_SCROLL_QUANTITY_CONTROL } from "../../../common/constants";

export default function QuantityController({ value, maxValue, onChange }) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    if (inputValue !== "") {
      onChange(inputValue);
    }
  }, [inputValue]);

  useEffect(() => {
    setInputValue(value);
  }, [value, setInputValue]);

  function handleChange(event) {
    if (event.target.value === "") {
      setInputValue("");
      return;
    }
    if (event.target.value.match(/[^0-9]/)) {
      return;
    }
    handleChangeValue(+event.target.value);
  }

  function handleChangeValue(newValue) {
    if (newValue < 1) {
      setInputValue(1);
      return;
    }
    if (newValue > maxValue) {
      toast.error("Нельзя превысить доступное количество товара", {
        toastId: "limitReached",
      });
      setInputValue(maxValue);
    } else {
      setInputValue(newValue);
    }
  }

  function handleBlur() {
    if (inputValue === "") {
      setInputValue(1);
    }
  }

  function handleWheel(e) {
    if (!ALLOW_SCROLL_QUANTITY_CONTROL) return;

    const directionPositive = e.deltaY < 0;
    if (directionPositive) {
      handleChangeValue(+inputValue + 1);
    } else {
      handleChangeValue(+inputValue - 1);
    }
  }

  return (
    <div className={styles.QuantityController}>
      <span className={styles.inputWrapper}>
        <input
          className={styles.input}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onWheel={handleWheel}
        />
      </span>
      <div className={styles.controls}>
        <button
          className={styles.arrowButton}
          onClick={() => handleChangeValue(+inputValue + 1)}
        >
          <img src={upIcon} alt="increment" />
        </button>
        <button
          className={styles.arrowButton}
          onClick={() => handleChangeValue(+inputValue - 1)}
        >
          <img src={downIcon} alt="decrement" />
        </button>
      </div>
    </div>
  );
}
