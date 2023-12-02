import styles from "./DistributorProfile.module.css";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getDistributorById,
  getOrderHistoryById,
  getReturnHistoryById,
  profileActions,
} from "../../redux/profileSlice";
import PageHeading from "../../components/PageHeading/PageHeading";
import DistributorInfo from "../../components/DistributorInfo/DistributorInfo";
import CustomButton from "../../components/UI/CustomButton/CustomButton";
import ADTable from "../../components/ADTable/ADTable";
import CustomSelect from "../../components/UI/CustomSelect/CustomSelect";
import renderSum from "../../utils/renderSum";
import renderDate from "../../utils/renderDate";
import renderIndex from "../../utils/renderIndex";
import { CATEGORIES, PATHS } from "../../common/constants";
import renderUnit from "../../utils/renderUnit";
import useNavigateReplace from "../../hooks/useNavigateReplace";
import usePermissions from "../../hooks/usePermissions";
import Loader from "../../components/Loader/Loader";
import renderCondition from "../../utils/renderCondition";

export default function DistributorProfile() {
  const {
    data,
    distributorInfo,
    isReturns,
    startDate,
    endDate,
    category,
    isDistributorLoading,
    isDataLoading,
  } = useSelector((state) => state.profile);
  const { isGuest } = usePermissions();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate404 = useNavigateReplace();

  const { setCategory, setSales, setStartDate, setEndDate, clearData } =
    profileActions;

  const queryParams = {
    category,
    start_date: startDate,
    end_date: endDate,
  };

  useEffect(() => {
    dispatch(getDistributorById(id)).unwrap().catch(navigate404);
    return () => dispatch(clearData());
  }, [id]);

  useEffect(() => {
    if (isReturns) {
      dispatch(
        getReturnHistoryById({
          id,
          queryParams,
          target: "returns",
        }),
      );
      return;
    }
    dispatch(
      getOrderHistoryById({
        id,
        queryParams,
      }),
    );
  }, [category, startDate, endDate, dispatch, isReturns]);

  const orderColumns = [
    {
      title: "№",
      dataIndex: "rowIndex",
      align: "center",
      width: 60,
      ellipsis: true,
      render: renderIndex,
    },
    {
      title: "Наименование",
      dataIndex: "name",
      align: "left",
      ellipsis: true,
    },
    {
      title: "Уникальный код",
      dataIndex: "identification_number",
      align: "left",
      ellipsis: true,
    },
    {
      title: "Ед. изм.",
      dataIndex: "unit",
      align: "left",
      width: 100,
      render: renderUnit,
    },
    {
      title: "Кол-во",
      dataIndex: "quantity",
      align: "left",
      width: 100,
    },
    {
      title: "Цена",
      dataIndex: "price",
      align: "left",
      width: 100,
    },
    {
      title: "Сумма",
      dataIndex: "sum",
      align: "left",
      width: 120,
      render: renderSum,
    },
    {
      title: "Дата продажи",
      dataIndex: "sale_date",
      align: "left",
      width: 120,
      render: renderDate,
    },
  ];

  const returnColumns = [
    {
      title: "№",
      dataIndex: "rowIndex",
      align: "center",
      width: 60,
      ellipsis: true,
      render: renderIndex,
    },
    {
      title: "Наименование",
      dataIndex: "name",
      align: "left",
      ellipsis: true,
    },
    {
      title: "Уникальный код",
      dataIndex: "identification_number",
      align: "left",
      ellipsis: true,
    },
    {
      title: "Ед. изм.",
      dataIndex: "unit",
      align: "left",
      width: 100,
    },
    {
      title: "Кол-во",
      dataIndex: "quantity",
      align: "left",
      width: 100,
    },
    {
      title: "Цена",
      dataIndex: "price",
      align: "left",
      width: 100,
    },
    {
      title: "Сумма",
      dataIndex: "sum",
      align: "left",
      width: 120,
      render: renderSum,
    },
    {
      title: "Дата продажи",
      dataIndex: "sale_date",
      align: "left",
      width: 120,
      render: renderDate,
    },
    {
      title: "Дата возврата",
      dataIndex: "return_date",
      align: "left",
      width: 120,
      render: renderDate,
    },
    {
      title: "Статус возврата",
      dataIndex: "state",
      align: "left",
      width: 100,
      render: renderCondition,
    },
  ];

  return isDistributorLoading ? (
    <Loader />
  ) : (
    <div className={styles.DistributorProfile}>
      <div className="container">
        <PageHeading
          heading="Карточка дистрибьютора"
          buttonText="Назад"
          backLink="/distributors"
        />
        <main className={styles.mainSection}>
          <div className={styles.infoBlock}>
            <DistributorInfo info={distributorInfo} />
            {!isGuest && (
              <div className={styles.actions}>
                <Link to={`${PATHS.order}/${id}`}>
                  <CustomButton variant="secondary" width="width140">
                    Отпускать
                  </CustomButton>
                </Link>
                <Link to={`${PATHS.return}/${id}`}>
                  <CustomButton variant="secondary" width="width140">
                    Возврат
                  </CustomButton>
                </Link>
              </div>
            )}
          </div>

          <form className={styles.filterbar}>
            <CustomSelect
              onChange={(value) => dispatch(setCategory(value))}
              options={[{ label: "Все товары", value: "" }, ...CATEGORIES]}
              className={styles.select}
            />
            <CustomSelect
              onChange={(value) => {
                dispatch(setSales(value));
              }}
              options={[
                { label: "История продаж", value: "order" },
                { label: "История возврата", value: "return" },
              ]}
              className={styles.select}
            />
            <label
              className={`${styles.dateLabel} ${styles.startDateLabel}`}
              htmlFor="startDate"
            >
              От
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => dispatch(setStartDate(e.target.value))}
              id="startDate"
            />
            <label className={styles.dateLabel} htmlFor="endDate">
              До
            </label>
            <input
              type="date"
              value={endDate}
              id="endDate"
              onChange={(e) => dispatch(setEndDate(e.target.value))}
            />
          </form>
          <ADTable
            headerBg={isReturns ? "#ffc2c2" : undefined}
            loading={isDataLoading}
            dataSource={data}
            rowKey="id"
            columns={isReturns ? returnColumns : orderColumns}
            height="55vh"
          />
        </main>
      </div>
    </div>
  );
}
