import styles from "./Archive.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { PATHS } from "../../common/constants";
import renderIndex from "../../utils/renderIndex";
import renderSum from "../../utils/renderSum";
import renderDate from "../../utils/renderDate";
import renderCondition from "../../utils/renderCondition";
import renderUnit from "../../utils/renderUnit";

export default function Archive() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isWarehouse = location.pathname.includes(PATHS.products);
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
    ).then(() => navigate(destination || "../"));
  }

  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////

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
    },
    {
      title: "Контактный номер (2)",
      dataIndex: "contact2",
      width: 190,
    },
    {
      title: "Дата удаления",
      dataIndex: "dataDeletion",
      align: "left",
      width: 110,
      render: renderDate,
    },
    {
      title: "Восстановить",
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
      width: 100,
      render: renderSum,
    },
    {
      title: "Дата удаления",
      dataIndex: "updated_at",
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
        <TableButton onClick={() => restoreFromArchive("products", record.id)}>
          <img src={restoreIcon} alt="restore" />
        </TableButton>
      ),
    },
  ];

  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////

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
          rowKey="id"
          height="65vh"
        />
      </div>
    </div>
  );
}
