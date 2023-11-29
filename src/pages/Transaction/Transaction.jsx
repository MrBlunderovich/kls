import styles from "./Transaction.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PageHeading from "../../components/PageHeading/PageHeading";
import CustomSearch from "../../components/UI/CustomSearch/CustomSearch";
import CustomSelect from "../../components/UI/CustomSelect/CustomSelect";
import {
  getDistributorById,
  getOrdersById,
  transactionActions,
  getWarehouseItems,
  postOrderById,
  printOrderById,
} from "../../redux/transactionSlice";
import Order from "./Order/Order";
import Return from "./Return/Return";
import useReturnId from "../../hooks/useReturnId";
import useNavigateReplace from "../../hooks/useNavigateReplace";
import showToastError from "../../utils/showToastError";
import { CATEGORIES } from "../../common/constants";

///////////////////////////////////////////////////////////////////////////////

export default function Transaction() {
  const { id, isReturn } = useReturnId();
  const navigate404 = useNavigateReplace();
  const {
    distributor,
    search,
    category,
    source,
    target,
    hoverRowId,
    orderNumber,
    isLoading,
  } = useSelector((state) => state.transaction);
  const dispatch = useDispatch();

  const targetTotalQuantity = target.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  const sourceTotalCost = source.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const targetTotalCost = target.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  useEffect(() => {
    dispatch(transactionActions.updateSource());
  }, [targetTotalQuantity, sourceTotalCost]);

  useEffect(() => {
    dispatch(getDistributorById(id)).unwrap().catch(navigate404);
  }, [id, dispatch]);

  useEffect(() => {
    if (isReturn) {
      dispatch(getOrdersById({ id, search_query: search }))
        .unwrap()
        .catch(showToastError);
      return;
    }
    dispatch(
      getWarehouseItems({ search_query: search, category, state: "normal" }),
    );
  }, [id, search, category, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(transactionActions.clearData());
    };
  }, []);

  function handleSave() {
    // ---------------------------------оформление возврата
    if (isReturn) {
      dispatch(postReturnById(composeReturnData()))
        .unwrap()
        .then(() => toast.success(`Возврат успешно сохранен`))
        .catch(showToastError);
      return;
    }
    // ---------------------------------оформление заказа
    dispatch(postOrderById(composeOrderData()))
      .unwrap()
      .then((id) => {
        toast.success(`Заказ №${id} успешно сохранен`);
        return id;
      })
      .then((id) => dispatch(printOrderById(id)))
      .catch(showToastError);
  }

  function composeOrderData() {
    return {
      distributor: id,
      identification_number_invoice: orderNumber,
      products_invoice: target.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };
  }

  function composeReturnData() {
    return {
      distributor: id,
      identification_number_invoice: orderNumber,
      products_invoice: target.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };
  }
  /* 
  function handlePrint() {
    if (isReturn) {
      dispatch(printOrderById(invoiceNumber));
      return;
    }
    dispatch(printOrderById(invoiceNumber));
    return;
  } */

  return (
    <div className="wideContainer">
      <PageHeading
        buttonText="Назад"
        backLink={`/distributors/profile/${id}`}
        heading={isReturn ? "Возврат товара" : "Оформление заявки"}
      >
        <CustomSelect
          className={styles.categorySelect}
          name="category"
          value={category}
          onChange={(value) => dispatch(transactionActions.setCategory(value))}
          options={[{ value: "", label: "Все товары" }, ...CATEGORIES]}
        />
        <CustomSearch
          className={styles.searchField}
          onSearch={(value) => dispatch(transactionActions.setSearch(value))}
        />
      </PageHeading>
      <main className={styles.main}>
        {isReturn ? (
          <Return
            parentStyles={styles}
            sourceData={source}
            targetData={target}
            distributor={distributor}
            sourceTotalCost={sourceTotalCost}
            targetTotalCost={targetTotalCost}
            hoverRowId={hoverRowId}
            loading={isLoading}
            onSave={handleSave}
            onPrint={handlePrint}
          />
        ) : (
          <Order
            parentStyles={styles}
            sourceData={source}
            targetData={target}
            distributor={distributor}
            orderNumber={orderNumber}
            targetTotalCost={targetTotalCost}
            hoverRowId={hoverRowId}
            loading={isLoading}
            onSave={handleSave}
            /* onPrint={handlePrint} */
          />
        )}
      </main>
    </div>
  );
}
