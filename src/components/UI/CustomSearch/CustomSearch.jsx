import styles from "./CustomSearch.module.css";
import searchIcon from "../../../assets/icons/search.svg";
import clearIcon from "../../../assets/icons/clear.svg";
import { useEffect, useState } from "react";
import Dropdown from "../Dropdown/Dropdown";
import { SEARCH_DEBOUNCE_DELAY } from "../../../common/constants";
import { useDebounce } from "../../../hooks/useDebounce";
import { axiosPrivate } from "../../../api/axiosPrivate";

export default function CustomSearch({
  className,
  placeholder = "Поиск...",
  params = {},
  delay = SEARCH_DEBOUNCE_DELAY || 700,
  onSearch = () => undefined,
}) {
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(true);
  const debouncedSearch = useDebounce(search, delay);

  useEffect(() => {
    if (debouncedSearch === "") {
      setOptions([]);
      return;
    }
    if (!active) {
      return;
    }

    async function getSearchMatches() {
      try {
        const response = await axiosPrivate.get(
          `/products/tip/?search=${debouncedSearch}`,
        );
        const options = response.data.results
          .filter((item) => {
            return Object.keys(params).reduce(
              (acc, key) => acc * (item[key] === params[key]),
              true,
            );
          })
          .map((item) => item.name);
        const uniqueOptions = [...new Set(options)].map((item) => ({
          label: item,
          value: item,
        }));
        setOptions(uniqueOptions);
      } catch (error) {
        return error;
      }
    }

    getSearchMatches();
  }, [debouncedSearch]);

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      onSearch(debouncedSearch);
    }
    if (event.key === "Escape") {
      handleClear();
    }
  }

  function handleBlur() {
    setTimeout(() => {
      active && setOptions([]);
    }, 300);
  }

  function handleClear() {
    setSearch("");
    setOptions([]);
    onSearch("");
  }

  function handleOptionClick(option) {
    setSearch(option.label);
    setOptions([]);
    setActive(false);
    onSearch(option.label);
  }

  function handleChange(event) {
    setSearch(event.target.value);
    setActive(true);
  }

  return (
    <span className={`${styles.CustomSearch} ${className}`}>
      <Dropdown options={options} onClick={handleOptionClick}>
        <div className={styles.inputIconContainer}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
          {search === "" ? (
            <img src={searchIcon} alt="icon" className={styles.searchIcon} />
          ) : (
            <img
              src={clearIcon}
              alt="icon"
              className={styles.clearIcon}
              onClick={handleClear}
            />
          )}
        </div>
      </Dropdown>
    </span>
  );
}
