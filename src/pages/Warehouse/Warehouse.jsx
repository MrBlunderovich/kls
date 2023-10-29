import styles from "./Warehouse.module.css";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/UI/CustomButton/CustomButton";
import searchIcon from "../../assets/icons/search.svg";
import editIcon from "../../assets/icons/mode_edit.svg";
import TableButton from "../../components/UI/TableButton/TableButton";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchItems, warehouseActions } from "../../redux/warehouseSlice";
import ADTable from "../../components/ADTable/ADTable";
import CustomSelect from "../../components/UI/CustomSelect/CustomSelect";

export default function Warehouse() {
  const { items, search, category, condition } = useSelector(
    (state) => state.warehouse,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function dispatchCategory(category) {
    dispatch(warehouseActions.setCategory({ category }));
  }

  function dispatchCondition(condition) {
    dispatch(warehouseActions.setCondition({ condition }));
  }

  function dispatchSearch(search) {
    dispatch(warehouseActions.setSearch({ search }));
  }

  useEffect(() => {
    dispatch(fetchItems());
  }, [search, category, condition]);

  const tableColumns = [
    {
      title: "№",
      dataIndex: "rowIndex",
      key: "rowIndex",
      align: "center",
      width: 55,
      render: (text, record, index) => index + 1,
    },
    {
      title: "Наименование",
      dataIndex: "name",
      key: "name",
      align: "left",
    },
    {
      title: "Уникальный код",
      dataIndex: "num_id",
      key: "num_id",
      align: "left",
    },
    {
      title: "Ед. изм.",
      dataIndex: "unit",
      key: "unit",
      align: "left",
      width: "11%",
    },
    {
      title: "Кол-во",
      dataIndex: "quantity",
      key: "quantity",
      align: "left",
      width: "11%",
    },
    {
      title: "Цена",
      dataIndex: "price",
      key: "price",
      align: "left",
      width: "11%",
    },
    {
      title: "Ред.",
      key: "action",
      align: "center",
      width: 78,
      render: (_, record) => (
        <TableButton
          onClick={() =>
            navigate(`/warehouse/product/edit/${record._id}`, { state: record })
          }
        >
          <img src={editIcon} alt="edit icon" />
        </TableButton>
      ),
    },
  ];

  return (
    <div className={styles.Warehouse}>
      <div className="container">
        <form className={styles.filterbar}>
          <div className={styles.searchInputContainer}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Поиск..."
              value={search}
              onChange={(event) => dispatchSearch(event.target.value)}
            />
            <img src={searchIcon} alt="icon" className={styles.searchIcon} />
          </div>
          <CustomSelect
            className={styles.categorySelect}
            name="category"
            dispatchNewValue={dispatchCategory}
            options={[
              { value: "all", label: "Все товары" },
              { value: "alcohol", label: "Алкогольные" },
              { value: "nonalcohol", label: "Безалкогольные" },
              { value: "raw", label: "Сырье" },
            ]}
          />
          <CustomSelect
            className={styles.conditionSelect}
            name="category"
            dispatchNewValue={dispatchCondition}
            options={[
              { value: "norm", label: "Норма" },
              { value: "defect", label: "Брак" },
            ]}
          />
          <CustomButton
            type="button"
            variant="secondary"
            onClick={() => navigate("/warehouse/archive")}
          >
            Архив
          </CustomButton>
          <CustomButton
            type="button"
            variant="primary"
            onClick={() => navigate("/warehouse/product/create")}
          >
            Создать
          </CustomButton>
        </form>
        <ADTable
          dataSource={items}
          rowKey="_id"
          columns={tableColumns}
          height="70vh"
        />
      </div>
    </div>
  );
}
