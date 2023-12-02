import styles from "./Transaction.module.css";
import { useEffect, useState } from "react";
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
  postReturnById,
  printReturnById,
} from "../../redux/transactionSlice";
import Order from "./Order/Order";
import Return from "./Return/Return";
import useReturnId from "../../hooks/useReturnId";
import useNavigateReplace from "../../hooks/useNavigateReplace";
import showToastError from "../../utils/showToastError";
import { CATEGORIES, PATHS } from "../../common/constants";
import CustomModal from "../../components/CustomModal/CustomModal";
import downloadFile from "../../utils/downloadFile";
import Loader from "../../components/Loader/Loader";

///////////////////////////////////////////////////////////////////////////////

export default function Transaction() {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const { id, isReturn } = useReturnId();
  const navigate404 = useNavigateReplace();
  const navigateToProfile = useNavigateReplace(
    `${PATHS.distributorsProfile}/${id}`,
    false,
  );
  const {
    distributor,
    search,
    category,
    source,
    target,
    hoverRowId,
    orderNumber,
    isDataLoading,
    isDistributorLoading,
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
      dispatch(
        getOrdersById({ id, queryParams: { category, search_query: search } }),
      )
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
    setShowSaveModal(true);
  }

  function handleConfirmSave() {
    // ---------------------------------оформление возврата
    if (isReturn) {
      dispatch(postReturnById(composeReturnData()))
        .unwrap()
        .then((data) => {
          toast.success(`Возврат успешно сохранен`);
          return data.id;
        })
        .then((returnId) =>
          dispatch(printReturnById(returnId))
            .unwrap()
            .then(downloadFile)
            .catch(showToastError),
        )
        .then(navigateToProfile)
        .catch(showToastError);
    } else {
      // ---------------------------------оформление заказа
      dispatch(postOrderById(composeOrderData()))
        .unwrap()
        .then((data) => {
          const orderNumber = data.identification_number_invoice;
          toast.success(`Заказ №${orderNumber} успешно сохранен`);
          return data.id;
        })
        .then((invoiceId) =>
          dispatch(printOrderById(invoiceId))
            .unwrap()
            .then(downloadFile)
            .catch(showToastError),
        )
        .then(navigateToProfile)
        .catch(showToastError);
    }
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
      //FIX_ME:
      identification_number_return: Math.floor(Math.random() * 1000000),
      return_product: target.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        state: item.state,
      })),
    };
  }

  return isDistributorLoading ? (
    <Loader />
  ) : (
    <div className="wideContainer">
      <PageHeading
        buttonText="Назад"
        backLink={`/distributors/profile/${id}`}
        heading={isReturn ? "Возврат товара" : "Оформление заявки"}
        modalOnLeave={true}
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
            loading={isDataLoading}
            onSave={handleSave}
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
            loading={isDataLoading}
            onSave={handleSave}
          />
        )}
      </main>
      {showSaveModal && (
        <CustomModal
          message="Вы точно хотите сохранить?"
          primaryAction={handleConfirmSave}
          secondaryAction={() => {
            setShowSaveModal(false);
          }}
        />
      )}
    </div>
  );
}
