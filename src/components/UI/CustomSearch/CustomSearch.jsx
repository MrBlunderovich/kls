import styles from "./CustomSearch.module.css";
import searchIcon from "../../../assets/icons/search.svg";
import clearIcon from "../../../assets/icons/clear.svg";
import { useEffect, useState } from "react";
import Dropdown from "../Dropdown/Dropdown";
import { ENDPOINTS, SEARCH_DEBOUNCE_DELAY } from "../../../common/constants";
import { useDebounce } from "../../../hooks/useDebounce";
import { axiosPrivate } from "../../../api/axiosPrivate";

export default function CustomSearch({
  className,
  placeholder = "Поиск...",
  endpoint = undefined,
  params = {},
  delay = SEARCH_DEBOUNCE_DELAY || 700,
  onSearch = () => undefined,
}) {
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(true);
  const debouncedSearch = useDebounce(search, delay);

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      setOptions([]);
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

  async function getSearchMatches() {
    try {
      const response = await axiosPrivate.get(
        `${endpoint}/?search=${debouncedSearch}`,
      );
      const options = response.data
        .filter((item) => {
          return Object.keys(params).reduce(
            (acc, key) => acc * (item[key] === params[key]),
            true,
          );
        })
        .map((item) => ({
          label: item.name,
          value: item.name,
        }));
      setOptions(options);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!endpoint || debouncedSearch === "") {
      setOptions([]);
      return;
    }
    if (!active) {
      return;
    }

    getSearchMatches();
  }, [debouncedSearch]);

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
