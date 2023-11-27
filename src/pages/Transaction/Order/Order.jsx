import { useDispatch } from "react-redux";
import ADTable from "../../../components/ADTable/ADTable";
import DistributorInfo from "../../../components/DistributorInfo/DistributorInfo";
import CustomButton from "../../../components/UI/CustomButton/CustomButton";
import OrderButton from "../../../components/UI/OrderButton/OrderButton";
import TotalIndicator from "../../../components/UI/TotalIndicator/TotalIndicator";
import { transactionActions } from "../../../redux/transactionSlice";
import QuantityController from "../../../components/UI/QuantityController/QuantityController";
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
  S_UID_WIDTH,
  S_UNIT_WIDTH,
} from "../../../common/constants";

export default function Order({
  parentStyles,
  sourceData,
  targetData,
  targetTotalCost,
  distributor,
  orderNumber,
  hoverRowId,
  loading,
  onSave,
  onPrint,
}) {
  const dispatch = useDispatch();

  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////

  const sourceColumns = [
    {
      title: "№",
      dataIndex: "rowIndex",
      align: "center",
      width: S_INDEX_WIDTH,
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
      title: "Код",
      dataIndex: "identification_number",
      align: "left",
      width: S_UID_WIDTH,
      ellipsis: true,
    },
    {
      title: "Ед.",
      dataIndex: "unit",
      align: "left",
      width: S_UNIT_WIDTH,
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
      align: "left",
      width: S_PRICE_WIDTH,
    },
    {
      title: "Отпустить",
      align: "center",
      width: 80,
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
      align: "center",
      width: S_INDEX_WIDTH,
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
      title: "Код",
      dataIndex: "identification_number",
      align: "left",
      ellipsis: true,
      width: S_UID_WIDTH,
    },
    {
      title: "Ед.",
      dataIndex: "unit",
      align: "left",
      width: S_UNIT_WIDTH,
      ellipsis: true,
    },
    {
      title: "Кол-во",
      dataIndex: "quantity",
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
      align: "left",
      width: S_PRICE_WIDTH,
    },
    {
      title: "Сумма",
      dataIndex: "sum",
      align: "left",
      width: S_PRICE_WIDTH,
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
      title: "Отменить",
      dataIndex: "cancel",
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
      {/* -------------------------SOURCE------------------------- */}
      <TransactionSection>
        <div className={parentStyles.infoWrapper}>
          <DistributorInfo info={distributor} variant="small" />
          <label className={parentStyles.formInput}>
            <input
              type="text"
              name="orderNumber"
              value={orderNumber}
              onChange={(e) =>
                dispatch(transactionActions.setOrderNumber(e.target.value))
              }
              placeholder="Номер накладного"
            />
          </label>
        </div>
        <ADTable
          size="small"
          dataSource={targetData}
          rowKey="id"
          columns={targetColumns}
          height="40vh"
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
          <TotalIndicator
            className={parentStyles.orderTotal}
            value={targetTotalCost}
          />
          <CustomButton
            className={parentStyles.orderButton}
            width="narrow"
            variant="secondary"
            onClick={onPrint}
          >
            Распечатать
          </CustomButton>
          <CustomButton
            className={parentStyles.orderButton}
            width="narrow"
            variant="primary"
            onClick={onSave}
          >
            Сохранить
          </CustomButton>
        </div>
      </TransactionSection>
      {/* -------------------------TARGET------------------------- */}
      <TransactionSection>
        <h3 className={parentStyles.sectionHeading}>Товар со склада</h3>
        <ADTable
          loading={loading}
          size="small"
          dataSource={sourceData}
          rowKey="id"
          columns={sourceColumns}
          height="50vh"
          rowClassName={(record) =>
            record.id === hoverRowId ? parentStyles.highlightedRow : ""
          }
        />
      </TransactionSection>
    </>
  );
}
