import OrderButton from "../../components/UI/OrderButton/OrderButton";
import QuantityController from "../../components/UI/QuantityController/QuantityController";

export function targetColumns(actionFn, quantityFn) {
  return [
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
      dataIndex: "identification_number",
      key: "identification_number",
      align: "left",
      width: 150,
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
      render: quantityFn,
    },
    {
      title: "Цена",
      dataIndex: "price",
      key: "price",
      align: "left",
      width: "11%",
    },
    {
      title: "Сумма",
      align: "left",
      width: "11%",
      render: (text, record) => record.quantity * record.price,
    },
    {
      title: "",
      key: "action",
      align: "center",
      width: 50,
      render: actionFn,
    },
  ];
}

export function targetColumnsClean({
  dispatch,
  setQuantity,
  removeItemFromDraft,
}) {
  return [
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
      dataIndex: "identification_number",
      key: "identification_number",
      align: "left",
      width: 150,
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
      render: (_, record) =>
        QuantityController({
          value: record.quantity,
          maxValue: record.maxQuantity,
          onChange: (value) => dispatch(setQuantity({ id: record.id, value })),
        }),
    },
    {
      title: "Цена",
      dataIndex: "price",
      key: "price",
      align: "left",
      width: "11%",
    },
    {
      title: "Сумма",
      align: "left",
      width: "11%",
      render: (text, record) => record.quantity * record.price,
    },
    {
      title: "",
      key: "action",
      align: "center",
      width: 50,
      render: (_, record) =>
        //-------------------remove from return draft
        OrderButton({
          variant: "remove",
          onClick: () => {
            dispatch(removeItemFromDraft(record));
          },
        }),
    },
  ];
}
