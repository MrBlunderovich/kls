import styles from "./Archive.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
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
import { PATHS } from "../../common/constants";
import renderIndex from "../../utils/renderIndex";
import renderSum from "../../utils/renderSum";
import renderDate from "../../utils/renderDate";
import renderCondition from "../../utils/renderCondition";
import renderUnit from "../../utils/renderUnit";
import showToastError from "../../utils/showToastError";
import { renderPhone } from "../../utils/formatPhone";

export default function Archive() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isWarehouse = location.pathname.includes(PATHS.products);
  const { items, isLoading } = useSelector((state) => state.archive);

  const total =
    isWarehouse &&
    items?.reduce((acc, item) => acc + item.price * item.quantity, 0);

  function restoreFromArchive(entity, record, destination) {
    const id = record.id;
    const successMessage = isWarehouse
      ? "Товар успешно восстановлен"
      : "Дистрибьютор успешно восстановлен";
    dispatch(
      restoreItemById({
        entity,
        id,
        condition: record.state,
      }),
    )
      .unwrap()
      .then(() => toast.success(successMessage))
      .then(() => navigate(destination || "../"))
      .catch(showToastError);
  }

  const distributorColumns = [
    {
      title: "№",
      dataIndex: "rowIndex",
      align: "center",
      width: 55,
      render: renderIndex,
    },
    {
      title: "ФИО",
      dataIndex: "name",
    },
    {
      title: "Регион",
      dataIndex: "region",
    },
    {
      title: "Контактный номер (1)",
      dataIndex: "contact",
      width: 190,
      render: renderPhone,
    },
    {
      title: "Контактный номер (2)",
      dataIndex: "contact2",
      width: 190,
      render: renderPhone,
    },
    {
      title: "Дата удаления",
      dataIndex: "delete_at",
      align: "left",
      width: 110,
      render: renderDate,
    },
    {
      title: "Восстановить",
      width: 145,
      align: "center",
      render: (_, record) => (
        <TableButton onClick={() => restoreFromArchive("distributors", record)}>
          <img src={restoreIcon} alt="restore" />
        </TableButton>
      ),
    },
  ];

  const productColumns = [
    {
      title: "№",
      dataIndex: "rowIndex",
      align: "center",
      width: 55,
      render: renderIndex,
    },
    {
      title: "Наименование",
      dataIndex: "name",
      align: "left",
      width: "15%",
    },
    {
      title: "Уникальный код",
      dataIndex: "identification_number",
      align: "left",
      width: "15%",
    },
    {
      title: "Ед. изм.",
      dataIndex: "unit",
      align: "left",
      render: renderUnit,
    },
    {
      title: "Кол-во",
      dataIndex: "quantity",
      align: "left",
    },
    {
      title: "Цена",
      dataIndex: "price",
      align: "left",
    },
    {
      title: "Сумма",
      dataIndex: "sum",
      align: "left",
      width: 120,
      render: renderSum,
    },
    {
      title: "Дата удаления",
      dataIndex: "delete_at",
      align: "left",
      width: 115,
      render: renderDate,
    },
    {
      title: "Статус",
      dataIndex: "state",
      align: "left",
      width: 100,
      render: renderCondition,
    },
    {
      title: "Восстановить",
      align: "center",
      width: 145,
      render: (_, record) => (
        <TableButton onClick={() => restoreFromArchive("products", record)}>
          <img src={restoreIcon} alt="restore" />
        </TableButton>
      ),
    },
  ];

  useEffect(() => {
    const entity = isWarehouse ? "products" : "distributors";
    dispatch(fetchArchiveItems(entity)).unwrap().catch(showToastError);
    return () => dispatch(archiveActions.clearData());
  }, [isWarehouse]);

  return (
    <div className={styles.Archive}>
      <div className="container">
        <PageHeading heading="Архив" buttonText="Назад" backLink="/warehouse">
          <div className={styles.controlContainer}>
            <div className={styles.controlContainer}>
              {isWarehouse && (
                <TotalIndicator className={styles.total} value={total} />
              )}
              <Link to={PATHS.productsArchive}>
                <CustomButton variant={isWarehouse ? "primary" : "secondary"}>
                  Товары
                </CustomButton>
              </Link>
              <Link to={PATHS.distributorsArchive}>
                <CustomButton variant={!isWarehouse ? "primary" : "secondary"}>
                  Дистрибьюторы
                </CustomButton>
              </Link>
            </div>
          </div>
        </PageHeading>
        <ADTable
          dataSource={items}
          columns={isWarehouse ? productColumns : distributorColumns}
          loading={isLoading}
          rowKey="id"
          height="65vh"
        />
      </div>
    </div>
  );
}
