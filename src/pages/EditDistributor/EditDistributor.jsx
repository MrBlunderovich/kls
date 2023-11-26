import styles from "./EditDistributor.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import PageHeading from "../../components/PageHeading/PageHeading";
import FormContainer from "../../components/FormContainer/FormContainer";
import CustomButton from "../../components/UI/CustomButton/CustomButton";
import arrowDown from "../../assets/icons/get_app.svg";
import CustomModal from "../../components/CustomModal/CustomModal";
import {
  archiveDistributorById,
  createDistributor,
  distributorActions,
  editDistributorById,
  getDistributorById,
} from "../../redux/editDistributorSlice";
import { PATHS } from "../../common/constants";
import yearLimiter from "../../utils/yearLimiter";
import useNavigateReplace from "../../hooks/useNavigateReplace";
import useEditId from "../../hooks/useEditId";
import didFormDataChange from "../../utils/didFormDataChange";
import showToastError from "../../utils/showToastError";
import formatPhone from "../../utils/formatPhone";

const initialData = {
  photo: null,
  name: "",
  region: "",
  inn: "",
  address: "",
  actual_place_of_residence: "",
  passport_series: "",
  passport_id: "",
  issued_by: "",
  issue_date: "",
  validity: "",
  contact: null,
  contact2: null,
};

export default function EditDistributor() {
  const [formData, setFormData] = useState(initialData);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const { originalData, isLoading } = useSelector((state) => state.distributor);
  const { id, isEdit } = useEditId();
  const navigate404 = useNavigateReplace();
  const navigateToDistributors = useNavigateReplace(PATHS.distributors, false);

  const passport =
    formData.passport_series.toString() + formData.passport_id.toString();

  useEffect(() => {
    if (isEdit) {
      dispatch(getDistributorById(id))
        .unwrap()
        .then(setFormData)
        .catch(navigate404);
    }
  }, [id]);

  useEffect(() => {
    return () => dispatch(distributorActions.clearData());
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    if (isEdit && !didFormDataChange(originalData, formData)) {
      toast.warn("Ничего не измено");
      return;
    }
    setShowSaveModal(true);
  }

  function handleConfirmSave() {
    setShowSaveModal(false);
    if (isEdit) {
      dispatch(
        editDistributorById({ id, formData: createFormDataObject(formData) }),
      )
        .unwrap()
        .then(() => toast.success("Дистрибьютор успешно сохранен"))
        .then(navigateToDistributors)
        .catch(showToastError);
      return;
    }
    dispatch(createDistributor(createFormDataObject(formData)))
      .unwrap()
      .then(() => toast.success("Дистрибьютор успешно создан"))
      .then(navigateToDistributors)
      .catch(showToastError);
  }

  function handleConfirmDelete() {
    setShowDeleteModal(false);
    dispatch(archiveDistributorById(id))
      .unwrap()
      .then(() => toast.success("Дистрибьютор успешно удален"))
      .then(navigateToDistributors)
      .catch(showToastError);
  }

  function isFormFilled() {
    const requiredFields = [
      "name",
      "region",
      "inn",
      "address",
      "actual_place_of_residence",
      "passport_id",
      "passport_series",
      "issued_by",
      "issue_date",
      "validity",
      "contact",
    ];
    return requiredFields.every((field) => !!formData[field]);
  }

  const formIsFilled = isFormFilled();

  const formInputs = formRef.current
    ? Array.from(formRef.current?.elements).filter((element) => element.name)
    : [];
  const formIsValid = !!formInputs.reduce(
    (acc, item) => acc * item.validity.valid,
    true,
  );

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleINNChange(e) {
    const { value } = e.target;
    if (value.match(/[^0-9]/)) {
      toast.warn("ИНН: только цифры", { toastId: "digits" });
      return;
    }
    if (value.length > 14) {
      toast.warn("ИНН: 14 символов", { toastId: "length" });
      return;
    }
    handleInputChange(e);
  }

  function handlePhoneChange(e) {
    const { name, value } = e.target;
    const dryValue = value.replaceAll(" ", "");
    if (dryValue.match(/[^0-9]/)) {
      toast.warn("Телефон: только цифры", { toastId: "digits" });
      return;
    }
    setFormData({ ...formData, [name]: dryValue });
  }

  function handleDateChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: yearLimiter(value) });
  }

  function handlePassportChange(event) {
    const upperCaseValue = event.target.value.toUpperCase().trim();
    if (upperCaseValue.match(/[^A-Z0-9]/)) {
      toast.warn("ID: неподходящие символы", { toastId: "chars" });
      return;
    }
    if (upperCaseValue.match(/^[^A-Z]|^.[^A-Z]/)) {
      toast.warn("ID: два первых символа - буквы", { toastId: "letters" });
      return;
    }
    if (upperCaseValue.match(/^..[^0-9]{1,7}/)) {
      toast.warn("ID: третий символ и дальше - цифры", { toastId: "numbers" });
      return;
    }
    if (upperCaseValue.length > 9) {
      toast.warn("ID: всего 9 символов", { toastId: "length" });
      return;
    }
    //временный костыль, пока не исправят бэк:
    const valueArray = upperCaseValue.split("");
    const passportSeriesArray = [];
    const passportNumberArray = [];
    valueArray.forEach((char, index) => {
      if (index <= 1) {
        passportSeriesArray.push(char);
        return;
      }
      passportNumberArray.push(char);
    });
    const passport_series = passportSeriesArray.join("");
    const passport_id = passportNumberArray.join("");
    setFormData({ ...formData, passport_series, passport_id });
  }

  const handlePhotoChange = (e) => {
    const photo = e.target.files[0];
    setFormData({ ...formData, photo });
  };

  function createFormDataObject(data) {
    const dataWithPhoto = { ...data };
    if (typeof data.photo === "string") {
      delete dataWithPhoto.photo;
    }
    const formDataObject = new FormData();
    Object.keys(dataWithPhoto).forEach((key) => {
      dataWithPhoto[key] && formDataObject.append(key, dataWithPhoto[key]);
    });
    return formDataObject;
  }

  function getPhotoUrl() {
    if (!formData.photo) return null;
    if (typeof formData.photo === "string") return formData.photo;
    return URL.createObjectURL(formData.photo);
  }

  const loadingPlaceholder = isLoading ? "Загрузка..." : null;

  return (
    <>
      <div className={styles.EditDistributor}>
        <div className="narrowContainer">
          <PageHeading
            heading={
              isEdit ? "Редактировать дистрибьютора" : "Создать дистрибьютора"
            }
            modalOnLeave={true}
          />
          <FormContainer>
            <form className={styles.form} ref={formRef} onSubmit={handleSubmit}>
              <label className={styles.fileInput}>
                <input
                  type="file"
                  accept="image/*"
                  name="photo"
                  onChange={handlePhotoChange}
                />
                {formData.photo ? (
                  <img
                    className={styles.picture}
                    src={getPhotoUrl()}
                    alt="distributor photo"
                  />
                ) : (
                  <div className={styles.getPhoto}>
                    <img src={arrowDown} alt="icon" />
                    <span>Добавить</span>
                    <span>фотографию</span>
                  </div>
                )}
              </label>

              <div className={styles.gridContainer}>
                <label className={`formLabel ${styles.double}`}>
                  <p>ФИО</p>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={
                      loadingPlaceholder || "Пример: Иванов Иван Иванович"
                    }
                    required
                  />
                </label>
                <label className={`formLabel ${styles.double}`}>
                  <p>Фактическое место жительства</p>
                  <input
                    type="text"
                    name="actual_place_of_residence"
                    value={formData.actual_place_of_residence}
                    onChange={handleInputChange}
                    placeholder={
                      loadingPlaceholder ||
                      "Пример: обл. Чуй, рай. Сокулук, с. Село, "
                    }
                    required
                  />
                </label>

                <label className={`formLabel ${styles.double}`}>
                  <p>Адрес по прописке</p>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder={
                      loadingPlaceholder ||
                      "Пример: обл. Чуй, рай. Сокулук, с. Село, "
                    }
                    required
                  />
                </label>
                <label className={`formLabel ${styles.single}`}>
                  <p>Регион</p>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    placeholder={loadingPlaceholder || "Пример: Чуй"}
                    required
                  />
                </label>
                <label className={`formLabel ${styles.single}`}>
                  <p>Серия и номер паспорта</p>
                  <input
                    type="text"
                    name="passport"
                    value={passport}
                    onChange={handlePassportChange}
                    placeholder={loadingPlaceholder || "ID"}
                    required
                    minLength={9}
                    maxLength={9}
                  />
                </label>

                <label className={`formLabel ${styles.single}`}>
                  <p>ИНН</p>
                  <input
                    type="text"
                    name="inn"
                    value={formData.inn}
                    onChange={handleINNChange}
                    placeholder={loadingPlaceholder || "0000000000"}
                    required
                    minLength={14}
                    maxLength={14}
                  />
                </label>
                <label className={`formLabel ${styles.single}`}>
                  <p>Орган выдачи</p>
                  <input
                    type="text"
                    name="issued_by"
                    value={formData.issued_by}
                    onChange={handleInputChange}
                    placeholder={loadingPlaceholder || "МКК"}
                    required
                  />
                </label>
                <label className={`formLabel ${styles.single}`}>
                  <p>Дата выдачи</p>
                  <input
                    type="date"
                    name="issue_date"
                    value={formData.issue_date}
                    onChange={handleDateChange}
                    required
                  />
                </label>
                <label className={`formLabel ${styles.single}`}>
                  <p>Срок действия</p>
                  <input
                    type="date"
                    name="validity"
                    value={formData.validity}
                    onChange={handleDateChange}
                    required
                  />
                </label>

                <div className={`${styles.contacts} ${styles.full}`}>
                  <label className={`formLabel ${styles.phoneLabel}`}>
                    <p>Контактный номер 1</p>
                    <div className={styles.inputContainer}>
                      <span className={styles.countryCode}>+996</span>
                      <input
                        type="tel"
                        name="contact"
                        value={formatPhone(formData.contact) || ""}
                        onChange={handlePhoneChange}
                        placeholder={loadingPlaceholder || ""}
                        required
                        minLength={11}
                        maxLength={11}
                      />
                    </div>
                  </label>
                  <label className={`formLabel ${styles.phoneLabel}`}>
                    <p>
                      Контактный номер 2
                      <span className={styles.optional}>
                        {" (необязательно)"}
                      </span>
                    </p>
                    <div className={styles.inputContainer}>
                      <span className={styles.countryCode}>+996</span>
                      <input
                        type="tel"
                        name="contact2"
                        value={formatPhone(formData.contact2) || ""}
                        onChange={handlePhoneChange}
                        placeholder={loadingPlaceholder || ""}
                        minLength={11}
                        maxLength={11}
                      />
                    </div>
                  </label>
                </div>

                <div className={`${styles.buttons} ${styles.full}`}>
                  {isEdit && (
                    <CustomButton
                      type="button"
                      variant="secondary"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Удалить
                    </CustomButton>
                  )}
                  <CustomButton width="xwide" disabled={!formIsFilled}>
                    Сохранить
                  </CustomButton>
                </div>
              </div>
            </form>
          </FormContainer>
        </div>
      </div>
      {/* ------------------------------------------modals */}
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
    </>
  );
}
