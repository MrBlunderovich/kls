import { useDispatch } from "react-redux";
import ADTable from "../../../components/ADTable/ADTable";
import DistributorInfo from "../../../components/DistributorInfo/DistributorInfo";
import OrderButton from "../../../components/UI/OrderButton/OrderButton";
import TotalIndicator from "../../../components/UI/TotalIndicator/TotalIndicator";
import { transactionActions } from "../../../redux/transactionSlice";
import QuantityController from "../../../components/UI/QuantityController/QuantityController";
import CustomButton from "../../../components/UI/CustomButton/CustomButton";
import TransactionSection from "../../../components/TransactionSection/TransactionSection";
import renderSum from "../../../utils/renderSum";
import renderDate from "../../../utils/renderDate";
import renderIndex from "../../../utils/renderIndex";
import {
  S_ACTION_WIDTH,
  S_DATE_WIDTH,
  S_INDEX_WIDTH,
  S_PRICE_WIDTH,
  S_QCONTROL_WIDTH,
  S_SUM_WIDTH,
  S_UID_WIDTH,
  S_UNIT_WIDTH,
} from "../../../common/constants";
import ConditionSelector from "../../../components/UI/ConditionSelector/ConditionSelector";

export default function Return({
  parentStyles,
  sourceData,
  targetData,
  distributor,
  hoverRowId,
  sourceTotalCost,
  targetTotalCost,
  loading,
}) {
  const dispatch = useDispatch();

  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////

  const sourceColumns = [
    {
      title: "№",
      dataIndex: "rowIndex",
      key: "rowIndex",
      align: "center",
      width: S_INDEX_WIDTH,
      ellipsis: true,
      render: renderIndex,
    },
    {
      title: "Наименование",
      dataIndex: "name",
      key: "name",
      align: "left",
      ellipsis: true,
    },
    {
      title: "Код",
      dataIndex: "identification_number",
      key: "identification_number",
      align: "left",
      width: S_UID_WIDTH,
      ellipsis: true,
    },
    {
      title: "Ед.",
      dataIndex: "unit",
      key: "unit",
      align: "left",
      width: S_UNIT_WIDTH,
      ellipsis: true,
    },
    {
      title: "Кол-во",
      dataIndex: "quantity",
      key: "quantity",
      align: "left",
      width: 60,
    },
    {
      title: "Цена",
      dataIndex: "price",
      key: "price",
      align: "left",
      width: S_PRICE_WIDTH,
    },
    {
      title: "Сумма",
      dataIndex: "sum",
      align: "left",
      width: S_SUM_WIDTH,
      render: renderSum,
    },
    {
      title: "Дата",
      dataIndex: "order_date",
      align: "left",
      width: S_DATE_WIDTH,
      ellipsis: true,
      render: renderDate,
    },
    {
      title: "Возврат",
      key: "action",
      align: "center",
      width: S_ACTION_WIDTH,
      ellipsis: true,
      render: (_, record) => (
        //-------------------add to target
        <OrderButton
          variant="add"
          onClick={() => {
            dispatch(transactionActions.addItemToTarget(record));
          }}
        />
      ),
    },
  ];

  ////////////////////////////////////////////////////////////////

  const targetColumns = [
    {
      title: "№",
      dataIndex: "rowIndex",
      key: "rowIndex",
      align: "center",
      width: S_INDEX_WIDTH,
      ellipsis: true,
      render: renderIndex,
    },
    {
      title: "Наименование",
      dataIndex: "name",
      key: "name",
      align: "left",
      ellipsis: true,
    },
    {
      title: "Код",
      dataIndex: "identification_number",
      key: "identification_number",
      align: "left",
      width: S_UID_WIDTH,
      ellipsis: true,
    },
    {
      title: "Ед.",
      dataIndex: "unit",
      key: "unit",
      align: "left",
      width: S_UNIT_WIDTH,
      ellipsis: true,
    },
    {
      title: "Кол-во",
      dataIndex: "quantity",
      key: "quantity",
      align: "left",
      width: S_QCONTROL_WIDTH,
      render: (_, record) => (
        <QuantityController
          value={record.quantity}
          maxValue={record.maxQuantity}
          onChange={(value) =>
            dispatch(transactionActions.setQuantity({ id: record.id, value }))
          }
        />
      ),
    },
    {
      title: "Цена",
      dataIndex: "price",
      key: "price",
      align: "left",
      width: S_PRICE_WIDTH,
    },
    {
      title: "Сумма",
      align: "left",
      width: S_SUM_WIDTH,
      render: renderSum,
    },
    {
      title: "Дата",
      dataIndex: "order_date",
      align: "left",
      width: S_DATE_WIDTH,
      ellipsis: true,
      render: renderDate,
    },
    {
      title: "Статус",
      dataIndex: "state",
      align: "left",
      width: 65,
      render: (text, record) => (
        <ConditionSelector
          onClick={() => dispatch(transactionActions.toggleCondition(record))}
        >
          {text}
        </ConditionSelector>
      ),
    },
    {
      title: "Отменить",
      key: "action",
      align: "center",
      width: S_ACTION_WIDTH,
      ellipsis: true,
      render: (_, record) => (
        //-------------------remove from return draft
        <OrderButton
          variant="remove"
          onClick={() => {
            dispatch(transactionActions.removeItemFromTarget(record));
          }}
        />
      ),
    },
  ];

  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////

  return (
    <>
      {/* -------------------------TARGET------------------------- */}
      <TransactionSection>
        <ADTable
          size="small"
          dataSource={targetData}
          rowKey="id"
          columns={targetColumns}
          height="55vh"
          onRow={(record) => {
            return {
              onMouseEnter: () => {
                dispatch(transactionActions.setHoverRowId(record.id));
              },
              onMouseLeave: () => {
                dispatch(transactionActions.setHoverRowId(""));
              },
            };
          }}
        />
        <div className={parentStyles.controls}>
          <CustomButton
            className={parentStyles.orderButton}
            width="narrow"
            variant="secondary"
          >
            Распечатать
          </CustomButton>
          <CustomButton
            className={parentStyles.orderButton}
            width="narrow"
            variant="primary"
          >
            Сохранить
          </CustomButton>
          <TotalIndicator
            className={parentStyles.total}
            value={targetTotalCost}
          />
        </div>
      </TransactionSection>
      {/* -------------------------SOURCE------------------------- */}
      <TransactionSection>
        <DistributorInfo info={distributor} variant="small" />
        <ADTable
          loading={loading}
          size="small"
          dataSource={sourceData}
          rowKey="id"
          columns={sourceColumns}
          height="45vh"
          rowClassName={(record) =>
            record.id === hoverRowId ? parentStyles.highlightedRow : ""
          }
        />
        <div className={parentStyles.controls}>
          <TotalIndicator
            className={parentStyles.total}
            value={sourceTotalCost}
          />
        </div>
      </TransactionSection>
    </>
  );
}
