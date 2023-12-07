import styles from "./EditProduct.module.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PageHeading from "../../components/PageHeading/PageHeading";
import FormContainer from "../../components/FormContainer/FormContainer";
import CustomButton from "../../components/UI/CustomButton/CustomButton";
import CustomRadioButton from "../../components/UI/CustomRadioButton/CustomRadioButton";
import CustomModal from "../../components/CustomModal/CustomModal";
import CustomSelect from "../../components/UI/CustomSelect/CustomSelect";
import { PATHS, UNITS } from "../../common/constants";
import {
  archiveProductById,
  createProduct,
  getProductById,
  moveProductbyId,
  productActions,
  updateProductById,
} from "../../redux/editProductSlice";
import didFormDataChange from "../../utils/didFormDataChange";
import showToastError from "../../utils/showToastError";
import useNavigateReplace from "../../hooks/useNavigateReplace";
import useEditId from "../../hooks/useEditId";
import Loader from "../../components/Loader/Loader";
import isFormValid from "../../utils/isFormValid";
import useCategories from "../../hooks/useCategories";

export default function EditProduct() {
  const categories = useCategories();
  const initialData = {
    name: "",
    identification_number: "",
    unit: UNITS[0].value,
    quantity: "",
    price: "",
    category: categories[0] || "---",
    state: "normal",
  };
  const [formData, setFormData] = useState(initialData);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const { originalData, isLoading } = useSelector((state) => state.product);
  const { id, isEdit, isDefect } = useEditId();
  const navigate404 = useNavigateReplace();
  const navigateToWarehouse = useNavigateReplace(PATHS.products, false);

  function didConditionChange() {
    return originalData.state !== formData.state;
  }

  function closeModals() {
    setShowSaveModal(false);
    setShowDeleteModal(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (isEdit && !didFormDataChange(originalData, formData)) {
      toast.warn("Ничего не изменено");
      return;
    }
    setShowSaveModal(true);
  }

  function handleConfirmSave() {
    if (isEdit) {
      dispatch(updateProductById({ id, formData, isDefect }))
        .unwrap()
        .then(() => {
          if (didConditionChange()) {
            return dispatch(
              moveProductbyId({ id, targetCondition: formData.state }),
            );
          }
        })
        .then(() => toast.success("Товар успешно сохранен"))
        .then(navigateToWarehouse)
        .catch(showToastError)
        .finally(closeModals);
    } else {
      dispatch(createProduct({ ...formData, warehouse: 1 }))
        .unwrap()
        .then(() => toast.success("Товар успешно создан"))
        .then(navigateToWarehouse)
        .catch(showToastError)
        .finally(closeModals);
    }
  }

  function handleConfirmDelete() {
    dispatch(archiveProductById({ id, isDefect }))
      .unwrap()
      .then(() => toast.success("Товар успешно удален"))
      .then(navigateToWarehouse)
      .catch(showToastError)
      .finally(closeModals);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  function handleBarcodeChange(e) {
    const { value } = e.target;
    if (value.length > 13) {
      return;
    }
    handleNumericInputChange(e);
  }

  function handleNumericInputChange(e) {
    const { value } = e.target;
    if (value.match(/[^0-9]/)) {
      return;
    }
    handleInputChange(e);
  }

  const sum = (formData.quantity * formData.price).toLocaleString("de-CH");

  useEffect(() => {
    if (isEdit) {
      dispatch(getProductById({ id, isDefect }))
        .unwrap()
        .then(setFormData)
        .catch(navigate404);
    }
  }, [id]);

  useEffect(() => {
    return () => dispatch(productActions.clearData());
  }, []);

  return isLoading ? (
    <Loader />
  ) : (
    <div className={styles.EditProduct}>
      <div className="narrowContainer">
        <PageHeading
          heading={isEdit ? "Редактировать товар" : "Создать товар"}
          modalOnLeave={true}
        />
        <FormContainer>
          <form className={styles.form} ref={formRef} onSubmit={handleSubmit}>
            <fieldset className={styles.formFlexRow}>
              <label className={styles.formInput}>
                <p>Наименование</p>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Пример: Пиво"
                  required
                />
              </label>
              <label className={styles.formInput}>
                <p>Идентификационный номер</p>
                <input
                  type="text"
                  name="identification_number"
                  value={formData.identification_number}
                  onChange={handleBarcodeChange}
                  placeholder=""
                  required
                />
              </label>
            </fieldset>
            <fieldset className={styles.formFlexRow}>
              <label
                className={`${styles.formInput} ${styles.wideFormInput} ${styles.unitSelectInput}`}
              >
                <p>Ед.измерения</p>
                <CustomSelect
                  className={styles.unitSelect}
                  name="unit"
                  value={formData.unit}
                  options={UNITS}
                  onChange={(value) =>
                    setFormData({ ...formData, unit: value })
                  }
                />
              </label>
              <label className={styles.formInput}>
                <p>Количество</p>
                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleNumericInputChange}
                  placeholder="Пример: 1000"
                  autoComplete="off"
                  required
                />
              </label>
              <label className={styles.formInput}>
                <p>Цена</p>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleNumericInputChange}
                  placeholder="0"
                  autoComplete="off"
                  required
                />
              </label>
              <label className={styles.formInput}>
                <p>Сумма</p>
                <input type="text" name="sum" value={sum} readOnly />
              </label>
            </fieldset>
            <fieldset className={styles.formFlexRow}>
              <label
                className={`${styles.formInput} ${styles.wideFormInput} ${styles.categorySelectInput}`}
              >
                <p>Категория</p>
                <CustomSelect
                  className={styles.categorySelect}
                  name="category"
                  value={formData.category}
                  options={categories}
                  onChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                />
              </label>
              <div className={styles.formInput}>
                <p>Состояние</p>
                <div className={styles.radioButtonGroup}>
                  <label className={styles.radioLabel}>
                    <CustomRadioButton
                      className={styles.radioButton}
                      name="state"
                      value="normal"
                      checked={formData.state === "normal"}
                      onChange={handleInputChange}
                    />
                    <span>Норма</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <CustomRadioButton
                      className={styles.radioButton}
                      name="state"
                      value="defect"
                      checked={formData.state === "defect"}
                      onChange={handleInputChange}
                      disabled={!isEdit}
                    />
                    <span>Брак</span>
                  </label>
                </div>
              </div>
            </fieldset>
            <div className={`${styles.formFlexRow} ${styles.formButtonRow}`}>
              {isEdit && (
                <CustomButton
                  type="button"
                  variant="secondary"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Удалить
                </CustomButton>
              )}
              <CustomButton
                type="submit"
                width="xwide"
                disabled={!isFormValid(formRef)}
              >
                Сохранить
              </CustomButton>
            </div>
          </form>
        </FormContainer>
      </div>
      {showSaveModal && (
        <CustomModal
          message="Вы точно хотите сохранить?"
          primaryAction={handleConfirmSave}
          secondaryAction={() => {
            setShowSaveModal(false);
          }}
        />
      )}
      {showDeleteModal && (
        <CustomModal
          message="Вы точно хотите удалить?"
          primaryAction={handleConfirmDelete}
          secondaryAction={() => {
            setShowDeleteModal(false);
          }}
        />
      )}
    </div>
  );
}
