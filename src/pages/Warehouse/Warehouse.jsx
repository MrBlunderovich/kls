import styles from "./Warehouse.module.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import CustomButton from "../../components/UI/CustomButton/CustomButton";
import editIcon from "../../assets/icons/mode_edit.svg";
import TableButton from "../../components/UI/TableButton/TableButton";
import {
  getDefectProducts,
  getNormalProducts,
  warehouseActions,
} from "../../redux/warehouseSlice";
import ADTable from "../../components/ADTable/ADTable";
import CustomSelect from "../../components/UI/CustomSelect/CustomSelect";
import CustomSearch from "../../components/UI/CustomSearch/CustomSearch";
import renderIndex from "../../utils/renderIndex";
import renderUnit from "../../utils/renderUnit";
import { CATEGORIES, PATHS } from "../../common/constants";
import showToastError from "../../utils/showToastError";
import usePermissions from "../../hooks/usePermissions";

export default function Warehouse() {
  const { setCategory, setCondition, setSearch } = warehouseActions;
  const { items, isLoading, search, category, state } = useSelector(
    (state) => state.warehouse,
  );
  const { isDirector, isGuest } = usePermissions();
  const dispatch = useDispatch();

  useEffect(() => {
    if (state === "defect") {
      dispatch(getDefectProducts({ search_query: search, category }))
        .unwrap()
        .catch(showToastError);
    } else {
      dispatch(getNormalProducts({ search_query: search, category }))
        .unwrap()
        .catch(showToastError);
    }
  }, [search, category, state]);

  useEffect(() => {
    return () => dispatch(warehouseActions.clearData());
  }, []);

  const tableColumns = [
    {
      title: "№",
      dataIndex: "rowIndex",
      key: "rowIndex",
      align: "center",
      width: 70,
      ellipsis: true,
      render: renderIndex,
    },
    {
      title: "Наименование",
      dataIndex: "name",
      key: "name",
      align: "left",
    },
    {
      title: "Уникальный код",
      dataIndex: "identification_number",
      key: "identification_number",
      align: "left",
    },
    {
      title: "Ед. изм.",
      dataIndex: "unit",
      key: "unit",
      align: "left",
      width: "11%",
      render: renderUnit,
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
  ];
  isDirector &&
    tableColumns.push({
      title: "Ред.",
      key: "action",
      align: "center",
      width: 78,
      render: (_, record) => (
        <Link
          to={`${PATHS.productsEdit}/${record.id}`}
          state={{ isDefect: state === "defect" }}
        >
          <TableButton>
            <img src={editIcon} alt="edit icon" />
          </TableButton>
        </Link>
      ),
    });

  //const searchParams = { state };
  const searchParams = {};
  category && (searchParams.category = category);

  return (
    <div className={styles.Warehouse}>
      <div className="container">
        <form className={styles.filterbar}>
          <CustomSearch
            params={searchParams}
            onSearch={(value) => dispatch(setSearch(value))}
          />
          <CustomSelect
            className={styles.categorySelect}
            name="category"
            value={category}
            onChange={(value) => dispatch(setCategory(value))}
            options={[{ value: "", label: "Все товары" }, ...CATEGORIES]}
          />
          <CustomSelect
            className={styles.conditionSelect}
            name="state"
            value={state}
            onChange={(value) => dispatch(setCondition(value))}
            options={[
              { value: "normal", label: "Норма" },
              { value: "defect", label: "Брак" },
            ]}
          />
          {(isDirector || isGuest) && (
            <Link to={PATHS.productsArchive}>
              <CustomButton type="button" variant="secondary">
                Архив
              </CustomButton>
            </Link>
          )}
          {!isGuest && (
            <Link to={PATHS.productsCreate}>
              <CustomButton type="button" variant="primary">
                Создать
              </CustomButton>
            </Link>
          )}
        </form>
        <ADTable
          headerBg={state === "defect" ? "#ffc2c2" : undefined}
          loading={isLoading}
          dataSource={items}
          rowKey="id"
          columns={tableColumns}
          height="70vh"
        />
      </div>
    </div>
  );
}
