import styles from "./Archive.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import PageHeading from "../../components/PageHeading/PageHeading";
import CustomButton from "../../components/UI/CustomButton/CustomButton";
import TableButton from "../../components/UI/TableButton/TableButton";
import restoreIcon from "../../assets/icons/restore.svg";
import ADTable from "../../components/ADTable/ADTable";
import TotalIndicator from "../../components/UI/TotalIndicator/TotalIndicator";
import {
  archiveActions,
  fetchArchiveItems,
  restoreItemById,
} from "../../redux/archiveSlice";

export default function Archive() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isWarehouse = location.pathname.includes("warehouse");
  const { items, isLoading, error } = useSelector((state) => state.archive);

  const total =
    isWarehouse &&
    items?.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    const entity = isWarehouse ? "products" : "distributors";
    dispatch(fetchArchiveItems(entity));
    return () => dispatch(archiveActions.clearData());
  }, [isWarehouse, dispatch]);

  function restoreFromArchive(entity, id, destination) {
    dispatch(
      restoreItemById({
        entity,
        id,
      }),
    ).then(navigate(destination || "../"));
  }

  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////

  const distributorColumns = [
    {
      title: "№",
      dataIndex: "rowIndex",
      key: "rowIndex",
      align: "center",
      width: 55,
      render: (text, record, index) => index + 1,
    },
    {
      title: "ФИО",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Регион",
      dataIndex: "region",
      key: "region",
    },
    {
      title: "Контактный номер (1)",
      dataIndex: "contact1",
      key: "contact1",
      width: 190,
    },
    {
      title: "Контактный номер (2)",
      dataIndex: "contact2",
      key: "contact2",
      width: 190,
    },
    {
      title: "Дата удаления",
      dataIndex: "dataDeletion",
      key: "dataDeletion",
      align: "left",
      width: 110,
    },
    {
      title: "Восстановить",
      key: "restore",
      width: 145,
      align: "center",
      render: (_, record) => (
        <TableButton
          onClick={() => restoreFromArchive("distributors", record.id)}
        >
          <img src={restoreIcon} alt="restore" />
        </TableButton>
      ),
    },
  ];

  const productColumns = [
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
      width: "15%",
    },
    {
      title: "Уникальный код",
      dataIndex: "identification_number",
      key: "identification_number",
      align: "left",
      width: "15%",
    },
    {
      title: "Ед. изм.",
      dataIndex: "unit",
      key: "unit",
      align: "left",
    },
    {
      title: "Кол-во",
      dataIndex: "quantity",
      key: "quantity",
      align: "left",
    },
    {
      title: "Цена",
      dataIndex: "price",
      key: "price",
      align: "left",
    },
    {
      title: "Сумма",
      dataIndex: "sum",
      key: "sum",
      align: "left",
      width: 100,
      render: (_, record) =>
        (record.price * record.quantity).toLocaleString("de-CH"),
    },
    {
      title: "Дата удаления",
      dataIndex: "updated_at",
      key: "updated_at",
      align: "left",
      width: 115,
      render: (_, record) =>
        new Date(record.updated_at).toLocaleDateString("ru"),
    },
    {
      title: "Статус возврата",
      dataIndex: "state",
      key: "state",
      align: "left",
      width: 100,
    },
    {
      title: "Восстановить",
      key: "action",
      align: "center",
      width: 145,
      render: (_, record) => (
        <TableButton onClick={() => restoreFromArchive("products", record.id)}>
          <img src={restoreIcon} alt="restore" />
        </TableButton>
      ),
    },
  ];

  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////

  const displayColumns = isWarehouse ? productColumns : distributorColumns;

  return (
    <div className={styles.Archive}>
      <div className="container">
        <PageHeading heading="Архив" buttonText="Назад" backLink="/warehouse">
          <div className={styles.controlContainer}>
            <div className={styles.controlContainer}>
              {isWarehouse && (
                <TotalIndicator className={styles.total} value={total} />
              )}
              <CustomButton
                variant={isWarehouse ? "primary" : "secondary"}
                onClick={() => navigate("/warehouse/archive")}
              >
                Товары
              </CustomButton>
              <CustomButton
                variant={!isWarehouse ? "primary" : "secondary"}
                onClick={() => navigate("/distributors/archive")}
              >
                Дистрибьюторы
              </CustomButton>
            </div>
          </div>
        </PageHeading>
        <ADTable
          dataSource={items}
          columns={displayColumns}
          rowKey="id"
          height="65vh"
        />
      </div>
    </div>
  );
}
