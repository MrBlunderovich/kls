import styles from "./Transaction.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeading from "../../components/PageHeading/PageHeading";
import CustomSearch from "../../components/UI/CustomSearch/CustomSearch";
import {
  getDistributorById,
  getOrdersById,
  transactionActions,
  fetchWarehouseItems,
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
  }, [targetTotalQuantity]);

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
    dispatch(fetchWarehouseItems({ search_query: search, state: "normal" }));
  }, [id, search, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(transactionActions.clearData());
    };
  }, [dispatch]);

  return (
    <div className="wideContainer">
      <PageHeading
        buttonText="Назад"
        backLink={`/distributors/profile/${id}`}
        heading={isReturn ? "Возврат товара" : "Оформление заявки"}
      >
        <CustomSearch
          onChange={(value) => dispatch(transactionActions.setSearch(value))}
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
          />
        )}
      </main>
    </div>
  );
}
