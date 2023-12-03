export default function isFormValid(formRef) {
  const formInputs = formRef.current
    ? Array.from(formRef.current?.elements).filter((element) => element.name)
    : [];
  const formIsValid = !!formInputs.reduce(
    (acc, item) => acc * item.validity.valid,
    true,
  );
  return formIsValid;
}
