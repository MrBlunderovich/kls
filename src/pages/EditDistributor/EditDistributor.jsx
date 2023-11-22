import styles from "./EditDistributor.module.css";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageHeading from "../../components/PageHeading/PageHeading";
import FormContainer from "../../components/FormContainer/FormContainer";
import CustomButton from "../../components/UI/CustomButton/CustomButton";
import getApp from "../../assets/icons/get_app.svg";
import CustomModal from "../../components/CustomModal/CustomModal";
import {
  archiveDistributorById,
  createDistributor,
  editDistributorById,
  getDistributorById,
} from "../../redux/editDistributorSlice";
import { PATHS } from "../../common/constants";
import yearLimiter from "../../utils/yearLimiter";

export default function EditDistributor() {
  const [formData, setFormData] = useState({
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
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const formRef = useRef(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { pathname } = useLocation();
  const isEdit = id !== undefined;
  //TODO: if pathname includes 'edit', must have an id
  const passport =
    formData.passport_series.toString() + formData.passport_id.toString();

  useEffect(() => {
    if (isEdit) {
      dispatch(getDistributorById(id)).then((action) => {
        console.log(action);
        console.log(action.payload?.response?.status);
        if (!action.payload?.response?.status) {
          setFormData(action.payload);
        }
      });
    }
  }, [id]);

  //временная "валидация"
  function isFormValid() {
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
  console.log("---");
  const formIsValid = isFormValid();

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleNumberChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleDateChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: yearLimiter(value) });
  }

  function handlePassportChange(event) {
    const valueArray = event.target.value.split("");
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

  function handleSubmit(event) {
    event.preventDefault();
    setShowSaveModal(true);
  }

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

  function handleConfirmSave() {
    if (isEdit) {
      dispatch(
        editDistributorById({ id, formData: createFormDataObject(formData) }),
      ).then((action) => {
        setShowSaveModal(false);
        navigate(PATHS.distributors);
      });
      return;
    }
    dispatch(createDistributor(createFormDataObject(formData))).then(
      (action) => {
        setShowSaveModal(false);
        navigate(PATHS.distributors);
      },
    );
  }

  function handleConfirmDelete() {
    dispatch(archiveDistributorById(id)).then((action) => {
      setShowDeleteModal(false);
      navigate(PATHS.distributors);
    });
  }

  function getPhotoUrl() {
    if (!formData.photo) return null;
    if (typeof formData.photo === "string") return formData.photo;
    return URL.createObjectURL(formData.photo);
  }

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
                    <img src={getApp} alt="icon" />
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
                    placeholder="Пример: Иванов Иван Иванович"
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
                    placeholder="Пример: обл. Чуй, рай. Сокулук, с. Село, "
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
                    placeholder="Пример: обл. Чуй, рай. Сокулук, с. Село, "
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
                    placeholder="Пример: Чуй"
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
                    placeholder="ID"
                    required
                  />
                </label>

                <label className={`formLabel ${styles.single}`}>
                  <p>ИНН</p>
                  <input
                    type="text"
                    name="inn"
                    value={formData.inn}
                    onChange={handleInputChange}
                    placeholder="0000000000"
                    required
                  />
                </label>
                <label className={`formLabel ${styles.single}`}>
                  <p>Орган выдачи</p>
                  <input
                    type="text"
                    name="issued_by"
                    value={formData.issued_by}
                    onChange={handleInputChange}
                    placeholder="МКК"
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
                        value={formData.contact || ""}
                        onChange={handleNumberChange}
                        placeholder=""
                        required
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
                        value={formData.contact2 || ""}
                        onChange={handleNumberChange}
                        placeholder=""
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
                  <CustomButton width="xwide" disabled={!formIsValid}>
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
//FIX_ME )
/* import styles from "./EditDistributor.module.css";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import PageHeading from "../../components/PageHeading/PageHeading";
import FormContainer from "../../components/FormContainer/FormContainer";
import CustomButton from "../../components/UI/CustomButton/CustomButton";
import getApp from "../../assets/icons/get_app.svg";
import CustomModal from "../../components/CustomModal/CustomModal";
import {
  archiveDistributorById,
  createDistributor,
  editDistributorById,
  getDistributorById,
} from "../../redux/editDistributorSlice";

export default function EditDistributor() {
  const [formData, setFormData] = useState({
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
    contact1: "",
    contact2: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const formRef = useRef(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { pathname } = useLocation();
  const isEdit = id !== undefined;
  //TODO: if pathname includes 'edit', must have an id
  const passport =
    formData.passport_series.toString() + formData.passport_id.toString();
  useEffect(() => {
    if (isEdit) {
      dispatch(getDistributorById(id)).then((action) => {
        console.log(action);
        setFormData(action.payload);
      });
    }
  }, [id]);

  //временная "валидация"
  function isFormValid() {
    const requiredFields = [
      "name",
      "region",
      "inn",
      "address",
      "actual_place_of_residence",
      "passport",
      "issued_by",
      "issue_date",
      "validity",
      "contact1",
    ];
    return requiredFields.every((field) => formData[field] !== "");
  }

  const formIsValid = isFormValid();
  const [error, setError] = useState({
    inn: "",
    issue_date: "",
    validity: "",
    contact1: "",
    contact2: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    switch (name) {
      case "name":
        newValue = value.replace(/[^А-Яа-яЁё\s]/g, "");
        break;
      case "inn":
        if (value.length === 1 && !["1", "2"].includes(value)) {
          setError({ ...error, [name]: "Первый символ должен быть 1 или 2" });
        } else if (value.length === 3 && parseInt(value.slice(1, 3)) > 31) {
          setError({ ...error, [name]: "День не может быть больше 31" });
        } else if (value.length === 5 && parseInt(value.slice(3, 5)) > 12) {
          setError({ ...error, [name]: "Месяц не может быть больше 12" });
        } else if (value.length > 8 && value.length <= 14) {
          newValue = value.slice(0, 14);
        } else {
          setError({ ...error, [name]: "" });
        }
        break;
      case "issue_date":
      case "validity":
        if (value.length === 2 && parseInt(value.slice(0, 2)) > 31) {
          setError({ ...error, [name]: "День не может быть больше 31" });
        } else if (value.length === 5 && parseInt(value.slice(3, 5)) > 12) {
          setError({ ...error, [name]: "Месяц не может быть больше 12" });
        } else if (value.length > 5 && value.length <= 10) {
          newValue = value.slice(0, 10);
        } else {
          setError({ ...error, [name]: "" });
        }
        break;
      case "contact1":
      case "contact2":
        if (value.length < 11) {
          setError({ ...error, [name]: "Неверный формат номера" });
        } else {
          setError({ ...error, [name]: "" });
        }
        break;
      default:
        break;
    }

    setFormData({ ...formData, [name]: newValue });
  };

  function handlePassportChange(event) {
    const valueArray = event.target.value.split("");
    const passportSeriesArray = [];
    const passportNumberArray = [];
    valueArray.forEach((char, index) => {
      if (index <= 1) {
        const upperCaseChar = char.toUpperCase();
        if (upperCaseChar.match(/[A-Z]/)) {
          passportSeriesArray.push(upperCaseChar);
        }
      } else {
        if (char.match(/[0-9]/)) {
          passportNumberArray.push(char);
        }
      }
    });
    const passport_series = passportSeriesArray.join("");
    const passport_id = passportNumberArray.join("");
    setFormData({ ...formData, passport_series, passport_id });
  }

  const handlePhotoChange = (e) => {
    const photo = e.target.files[0];
    setFormData({ ...formData, photo });
  };

  function handleSubmit(event) {
    event.preventDefault();
    setShowSaveModal(true);
  }

  function handleConfirmSave() {
    if (isEdit) {
      dispatch(editDistributorById({ id, formData })).then((action) => {
        setShowSaveModal(false);
        navigate("/distributors");
      });
      return;
    }
    dispatch(createDistributor(formData)).then((action) => {
      setShowSaveModal(false);
      navigate("/distributors");
    });
  }

  function handleConfirmDelete() {
    dispatch(archiveDistributorById(id)).then((action) => {
      setShowDeleteModal(false);
      navigate("/distributors");
    });
  }

  function handleDateInput(e) {
    var value = e.target.value;
    value = value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{2}\.\d{2})(\d)/, "$1.$2");
    e.target.value = value;
  }

  function handlePhoneInput(e) {
    var value = e.target.value;
    value = value
      .replace(/\D/g, "")
      .replace(/^(\d{1,3})/, "$1 ")
      .replace(/^(\d{1,3}) (\d{1,3})/, "$1 $2 ")
      .replace(/^(\d{1,3}) (\d{1,3}) (\d{1,3})/, "$1 $2 $3")
      .trim();
    e.target.value = value.slice(0, 11);
  } */

//return (
{
  /* <>
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
                  onChange={handlePhotoChange}
                />
                <div className={styles.getPhoto}>
                  <img src={getApp} alt="icon" />
                  <span>Добавить</span>
                  <span>фотографию</span>
                </div>
              </label>
              <fieldset className={styles.formFlexRow}>
                <label className={`${styles.formInput} ${styles.addressInput}`}>
                  <p>ФИО</p>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Пример: Иванов Иван Иванович"
                    required
                  />
                </label>
                <label className={styles.formInput}>
                  <p>Фактическое место жительства</p>
                  <input
                    type="text"
                    name="actual_place_of_residence"
                    value={formData.actual_place_of_residence}
                    onChange={handleInputChange}
                    placeholder="Пример: обл. Чуй, рай. Сокулук, с. Село, "
                    required
                  />
                </label>
              </fieldset>
              <fieldset className={styles.formFlexRow}>
                <label className={`${styles.formInput} ${styles.addressInput}`}>
                  <p>Адрес по прописке</p>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Пример: обл. Чуй, рай. Сокулук, с. Село, "
                    required
                  />
                </label>
                <label className={styles.formInput}>
                  <p>Регион</p>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    placeholder="Пример: Чуй"
                    required
                  />
                </label>

                <label className={styles.formInput}>
                  <p>Серия и номер паспорта</p>
                  <input
                    type="text"
                    name="passport"
                    value={passport}
                    onChange={handlePassportChange}
                    placeholder="ID/AN"
                    maxLength={9}
                    required
                  />
                </label>
              </fieldset>
              <fieldset className={styles.formFlexRow}>
                <label className={`${styles.formInput} ${styles.innInput}`}>
                  <p>ИНН</p>
                  <input
                    type="text"
                    name="inn"
                    value={formData.inn}
                    onChange={handleInputChange}
                    placeholder="0000000000"
                    maxLength={14}
                    required
                  />
                  {error.inn && <p>{error.inn}</p>}
                </label>

                <label className={styles.formInput}>
                  <p>Орган выдачи</p>
                  <input
                    type="text"
                    name="issued_by"
                    value={formData.issued_by}
                    onChange={handleInputChange}
                    placeholder="МКК"
                    required
                  />
                </label>
                <label className={styles.formInput}>
                  <p>Дата выдачи</p>
                  <input
                    type="text"
                    name="issue_date"
                    value={formData.issue_date}
                    onChange={handleInputChange}
                    onInput={handleDateInput}
                    placeholder="00.00.0000"
                    maxLength={10}
                    required
                  />
                  {error.issue_date && <p>{error.issue_date}</p>}
                </label>
                <label className={styles.formInput}>
                  <p>Срок действия</p>
                  <input
                    type="text"
                    name="validity"
                    value={formData.validity}
                    onChange={handleInputChange}
                    onInput={handleDateInput}
                    placeholder="00.00.0000"
                    maxLength={10}
                    required
                  />
                  {error.validity && <p>{error.validity}</p>}
                </label>
              </fieldset>
              <fieldset
                className={`${styles.formFlexRow} ${styles.phoneNumberRow}`}
              >
                <label className={`${styles.formInput} ${styles.phoneInput}`}>
                  <p>Контактный номер 1</p>
                  <div className={styles.inputContainer}>
                    <span className={styles.countryCode}>+996</span>
                    <input
                      type="tel"
                      name="contact1"
                      value={formData.contact1 || ""}
                      onChange={handleInputChange}
                      onInput={handlePhoneInput}
                      placeholder=""
                      required
                    />
                  </div>
                  {error.contact1 && <p>{error.contact1}</p>}
                </label>
                <label className={`${styles.formInput} ${styles.phoneInput}`}>
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
                      value={formData.contact2 || ""}
                      onChange={handleInputChange}
                      onInput={handlePhoneInput}
                      placeholder=""
                    />
                  </div>
                  {error.contact2 && <p>{error.contact2}</p>}
                </label>
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
                <CustomButton width="xwide" disabled={!formIsValid}>
                  Сохранить
                </CustomButton>
              </div>
            </form>
          </FormContainer>
        </div>
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
    </>
  ); */
}
//}
