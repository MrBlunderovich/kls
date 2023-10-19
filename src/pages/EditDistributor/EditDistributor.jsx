import { useState } from "react";
import styles from "./EditDistributor.module.css";
import styled from "styled-components";
import PageHeading from "../../components/PageHeading/PageHeading";

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
`;

export default function EditDistributor() {
  const [formData, setFormData] = useState({
    photo: null,
    fullName: "",
    region: "",
    inn: "",
    address: "",
    actualAddress: "",
    passportSeries: "",
    passportNumber: "",
    issuedBy: "",
    issueDate: "", //date?
    expireDate: "", //date?
    contactNumber1: "",
    contactNumber2: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const photo = e.target.files[0];
    setFormData({ ...formData, photo });
  };

  const handleSave = () => {
    // Здесь отправьте данные formData на сервер через API
  };

  return (
    <div className={styles.EditDistributor}>
      <div className={styles.narrowContainer}>
        <PageHeading heading="Создать дистрибьютора" />
        <h2>Создать дистрибьютора</h2>
        <form className={styles.form}>
          <label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          </label>
          <div className={styles.formBlock}>
            <div className={styles.qw}>
              ФИО
              <Input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Иванов Иван Иванович"
                required
              />
            </div>
            <div className={styles.qw}>
              Фактическое место жительства
              <Input
                type="text"
                name="actualAddress"
                value={formData.actualAddress}
                onChange={handleInputChange}
                placeholder="Пример: обл. Чуй, рай. Сокулук, с. Село, "
                required
              />
            </div>
            <div className={styles.qw}>
              Адрес по прописке
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Пример: обл. Чуй, рай. Сокулук, с. Село, "
                required
              />
            </div>
            <div className={styles.er}>
              Регион
              <Input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                placeholder="Например: Чуй"
                required
              />
            </div>
            <div className={styles.er}>
              ИНН
              <Input
                type="text"
                name="inn"
                value={formData.inn}
                onChange={handleInputChange}
                placeholder="0000000000"
                required
              />
            </div>
            <div className={styles.ty}>
              Номер паспорта
              <Input
                type="text"
                name="passportNumber"
                value={formData.passportNumber}
                onChange={handleInputChange}
                placeholder="000000"
                required
              />
            </div>
            <div className={styles.ty}>
              Серия паспорта
              <Input
                type="text"
                name="passportSeries"
                value={formData.passportSeries}
                onChange={handleInputChange}
                placeholder="000000"
                required
              />
            </div>
            <div className={styles.ty}>
              Орган выдачи
              <Input
                type="text"
                name="issuedBy"
                value={formData.issuedBy}
                onChange={handleInputChange}
                placeholder="000000"
                required
              />
            </div>
            <div className={styles.ty}>
              Дата выдачи
              <Input
                type="text"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleInputChange}
                placeholder="000000"
                required
              />
            </div>
            <div className={styles.ty}>
              Срок действия
              <Input
                type="text"
                name="validity"
                value={formData.expireDate}
                onChange={handleInputChange}
                placeholder="0000000"
                required
              />
            </div>
            <div className={styles.ui}>
              Контактный номер №1
              <Input
                type="text"
                name="contactNumber1"
                value={formData.contactNumber1}
                onChange={handleInputChange}
                placeholder="+996 "
                required
              />
            </div>
            <div className={styles.ui}>
              Контактный номер №2
              <Input
                type="text"
                name="contactNumber2"
                value={formData.contactNumber2}
                onChange={handleInputChange}
                placeholder="+996"
                required
              />
            </div>
          </div>
          <button className={styles.saveButton} onClick={handleSave}>
            Сохранить
          </button>
          <button className={styles.remove}>Удалить</button>
        </form>
      </div>
    </div>
  );
}

/* export default function EditDistributor() {
  return (
    <div className={styles.EditDistributor}>
      <h1 style={{ textAlign: "center" }}>
        Страница Создания/редактирования Дистрибьютора
      </h1>
      <CreateDistributor />
    </div>
  );
} */
