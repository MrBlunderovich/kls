import styles from "./EditProduct.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PageHeading from "../../components/PageHeading/PageHeading";
import FormContainer from "../../components/FormContainer/FormContainer";
import CustomButton from "../../components/UI/CustomButton/CustomButton";
import CustomRadioButton from "../../components/UI/CustomRadioButton/CustomRadioButton";
import CustomModal from "../../components/CustomModal/CustomModal";
import CustomSelect from "../../components/UI/CustomSelect/CustomSelect";
import { CATEGORIES, PATHS, UNITS } from "../../common/constants";
import {
  archiveProductById,
  getProductById,
  postProduct,
  productActions,
  updateProductById,
} from "../../redux/editProductSlice";
import didFormDataChange from "../../utils/didFormDataChange";
import showToastError from "../../utils/showToastError";
import useNavigateReplace from "../../hooks/useNavigateReplace";
import useEditId from "../../hooks/useEditId";

const initialData = {
  name: "",
  identification_number: "",
  unit: UNITS[0].value,
  quantity: "",
  price: "",
  category: CATEGORIES[0].value,
  state: "normal",
};

export default function EditProduct() {
  const [formData, setFormData] = useState(initialData);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const { originalData, isLoading } = useSelector((state) => state.product);
  const { id, isEdit } = useEditId();
  const navigate404 = useNavigateReplace();
  const navigateToWarehouse = useNavigateReplace(PATHS.products, false);

  useEffect(() => {
    if (isEdit) {
      dispatch(getProductById(id))
        .unwrap()
        .then(setFormData)
        .catch(navigate404);
    }
  }, [id]);

  useEffect(() => {
    return () => dispatch(productActions.clearData());
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (isEdit && !didFormDataChange(originalData, formData)) {
      toast.warn("Ничего не измено");
      return;
    }
    setShowSaveModal(true);
  }

  function handleConfirmSave() {
    setShowSaveModal(false);
    if (isEdit) {
      dispatch(updateProductById({ id, formData }))
        .unwrap()
        .then(() => toast.success("Товар успешно сохранен"))
        .then(navigateToWarehouse)
        .catch(showToastError);
      return;
    }
    dispatch(postProduct(formData))
      .unwrap()
      .then(() => toast.success("Товар успешно создан"))
      .then(navigateToWarehouse)
      .catch(showToastError);
  }

  function handleConfirmDelete() {
    setShowDeleteModal(false);
    dispatch(archiveProductById(id))
      .unwrap()
      .then(() => toast.success("Товар успешно удален"))
      .then(navigateToWarehouse)
      .catch(showToastError);
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

  const isFormValid = Object.values(formData).every((field) => field !== "");

  const sum = (formData.quantity * formData.price).toLocaleString("de-CH");

  const loadingPlaceholder = isLoading ? "Загрузка..." : null;

  return (
    <div className={styles.EditProduct}>
      <div className="narrowContainer">
        <PageHeading
          heading={isEdit ? "Редактировать товар" : "Создать товар"}
          modalOnLeave={true}
        />
        <FormContainer>
          <form className={styles.form} onSubmit={handleSubmit}>
            <fieldset className={styles.formFlexRow}>
              <label className={styles.formInput}>
                <p>Наименование</p>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={loadingPlaceholder || "Пример: Пиво"}
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
                  placeholder={loadingPlaceholder || ""}
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
                  placeholder={loadingPlaceholder || "Пример: 1000"}
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
                  placeholder={loadingPlaceholder || "0"}
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
                  options={CATEGORIES}
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
              <CustomButton type="submit" width="xwide" disabled={!isFormValid}>
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
