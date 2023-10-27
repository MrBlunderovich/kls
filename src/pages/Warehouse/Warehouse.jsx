import styles from "./Warehouse.module.css";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/UI/CustomButton/CustomButton";
import searchIcon from "../../assets/icons/search.svg";
import editIcon from "../../assets/icons/mode_edit.svg";
import { Table } from "antd";
import TableButton from "../../components/UI/TableButton/TableButton";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchItems } from "../../redux/warehouseSlice";
import CustomSelect from "../../components/UI/CustomSelect/CustomSelect";

export default function Warehouse() {
  const { products } = useSelector((state) => state.warehouse);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchItems());
  }, []);

  const tableColumns = [
    {
      title: "№",
      dataIndex: "rowIndex",
      key: "rowIndex",
      align: "center",
      width: 50,
      render: (text, record, index) => index + 1, // автоматическое нумерование
    },
    {
      title: "Наименование",
      dataIndex: "name",
      key: "name",
      align: "left",
      width: 350,
    },
    {
      title: "Уникальный код",
      dataIndex: "num_id",
      key: "num_id",
      align: "left",
      width: 325,
    },
    {
      title: "Ед. изм.",
      dataIndex: "unit",
      key: "unit",
      align: "left",
      width: "12%",
    },
    {
      title: "Кол-во",
      dataIndex: "quantity",
      key: "quantity",
      align: "left",
      width: "12%",
    },
    {
      title: "Цена",
      dataIndex: "price",
      key: "price",
      align: "left",
      width: "12%",
    },
    {
      title: "Ред.",
      key: "action",
      align: "center",
      width: 78,
      render: (_, record) => (
        <TableButton
          onClick={() =>
            navigate(`/product/edit/${record._id}`, { state: record })
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
          <div className={styles.inputContainer}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Поиск..."
            />
            <img src={searchIcon} alt="icon" className={styles.searchIcon} />
          </div>
          <CustomSelect
            className={styles.categorySelect}
            name="category"
            options={["Все товары", "Алкогольные", "Безалкогольные", "Сырье"]}
          />
          <CustomSelect
            className={styles.conditionSelect}
            name="category"
            options={["Норма", "Брак"]}
          />
          <CustomButton
            type="button"
            variant="secondary"
            onClick={() => navigate("/archive/warehouse")}
          >
            Архив
          </CustomButton>
          <CustomButton
            type="button"
            variant="primary"
            onClick={() => navigate("/product/create")}
          >
            Создать
          </CustomButton>
        </form>
        <Table
          bordered
          dataSource={products}
          rowKey="_id"
          columns={tableColumns}
          pagination={false}
          scroll={{ y: "70vh", scrollToFirstRowOnChange: true }}
        />
      </div>
    </div>
  );
}
