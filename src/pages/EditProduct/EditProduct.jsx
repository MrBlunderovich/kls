import styles from "./EditProduct.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import PageHeading from "../../components/PageHeading/PageHeading";
import FormContainer from "../../components/FormContainer/FormContainer";
import CustomButton from "../../components/UI/CustomButton/CustomButton";
import CustomRadioButton from "../../components/UI/CustomRadioButton/CustomRadioButton";
import CustomModal from "../../components/CustomModal/CustomModal";
import CustomSelect from "../../components/UI/CustomSelect/CustomSelect";
import {
  archiveProductById,
  getProductById,
  postProduct,
  productActions,
  updateProductById,
} from "../../redux/editProductSlice";
import { PATHS } from "../../common/constants";
import handleError from "../../utils/handleError";

export default function EditProduct() {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.product.data); 
  const { setData, clearData } = productActions;
  const [formData, setFormData] = useState({
    name: "",
    identification_number: "",
    unit: "",
    quantity: "",
    price: "",
    category: "",
    state: "Normal",
  });
  const { id } = useParams();
  const isEdit = id !== undefined;
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      dispatch(getProductById(id)).then(handleError);
    }
  }, [id]);

  const confirmDelete = () => {
    setShowDeleteModal(false);
    dispatch(archiveProductById(id)).then(() => {
      dispatch(clearData());
      navigate(PATHS.products);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSaveModal(true);
  };

  const confirmSave = () => {
    setShowSaveModal(false);
    if (isEdit) {
      dispatch(updateProductById(id)).then(() => {
        dispatch(clearData());
        navigate(PATHS.products);
      });
      return;
    }
    dispatch(postProduct()).then(() => {
      dispatch(clearData());
      navigate(PATHS.products);
    });
  };

  const isFormValid = () => {
    const requiredFields = ["name", "identification_number", "quantity", "price"];
    return requiredFields.every((field) => formData[field] !== "");
  };

  const sum = (formData.quantity * formData.price).toLocaleString("de-CH");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNumericInputChange = (e) => {
    const { value } = e.target;
    if (!isNaN(value) && !value.includes("e")) {
      handleInputChange(e);
    }
  };
 console.log(formData)
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
                  placeholder="Пример: Пиво"
                />
              </label>
              <label className={styles.formInput}>
                <p>Идентификационный номер</p>
                <input
                  type="text"
                  name="identification_number"
                  value={formData.identification_number}
                  onChange={handleInputChange}
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
                options={[
                  { value: "item", label: "Шт" },
                  { value: "kilogram", label: "Кг" },
                  { value: "liter", label: "Л" },
                  { value: "m", label: "М" },
                ]}
                onChange={(value) => setFormData({ ...formData, unit: value })}
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
                  options={[
                    { value: "alcohol", label: "Алкогольный" },
                    { value: "notAlcohol", label: "Безалкогольный" },
                  ]}
                  onChange={(value) => setFormData({ ...formData, category: value })}
                />
              </label>
              <div className={styles.formInput}>
                <p>Состояние</p>
                <div className={styles.radioButtonGroup}>
                  <label className={styles.radioLabel}>
                    <CustomRadioButton
                      className={styles.radioButton}
                      name="state"
                      value="Normal"
                      checked={formData.state === "Normal"}
                      onChange={handleInputChange}
                    />
                    <span>Норма</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <CustomRadioButton
                      className={styles.radioButton}
                      name="state"
                      value="Invalid"
                      checked={formData.state === "Invalid"}
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
                disabled={!isFormValid()}
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
          primaryAction={confirmSave}
          secondaryAction={() => {
            setShowSaveModal(false);
          }}
        />
      )}
      {showDeleteModal && (
        <CustomModal
          message="Вы точно хотите удалить?"
          primaryAction={confirmDelete}
          secondaryAction={() => {
            setShowDeleteModal(false);
          }}
        />
      )}
    </div>
  );
}
