import styles from "./Transaction.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeading from "../../components/PageHeading/PageHeading";
import CustomSearch from "../../components/UI/CustomSearch/CustomSearch";
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

///////////////////////////////////////////////////////////////////////////////

export default function Transaction() {
  const { id, isReturn } = useReturnId();
  const navigate404 = useNavigateReplace();
  const {
    distributor,
    search,
    source,
    target,
    hoverRowId,
    orderNumber,
    isLoading,
    invoiceNumber,
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
    dispatch(getWarehouseItems({ search_query: search, state: "normal" }));
  }, [id, search, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(transactionActions.clearData());
    };
  }, [dispatch]);

  function handleSave() {
    if (isReturn) {
      const payload = {
        distributor: id,
        identification_number_invoice: orderNumber,
        products_invoice: target,
      };
      dispatch(postReturnById(payload));
      return;
    }
    //
    const payload = {
      distributor: id,
      identification_number_invoice: orderNumber,
      products_invoice: target.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };
    dispatch(postOrderById(payload))
      .unwrap()
      //.then((data) => console.log(data.identification_number_invoice))
      .then((data) =>
        dispatch(printOrderById(data.identification_number_invoice)),
      )
      .catch(showToastError);
  }

  function handlePrint() {
    if (isReturn) {
      dispatch(printOrderById(invoiceNumber));
      return;
    }
    dispatch(printOrderById(invoiceNumber));
    return;
  }

  return (
    <div className="wideContainer">
      <PageHeading
        buttonText="Назад"
        backLink={`/distributors/profile/${id}`}
        heading={isReturn ? "Возврат товара" : "Оформление заявки"}
      >
        <CustomSearch
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
            onPrint={handlePrint}
            invoiceNumber={invoiceNumber}
          />
        )}
      </main>
    </div>
  );
}
