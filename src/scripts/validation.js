export const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-button",
  inactiveButtonClass: "modal__submit-button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error",
};

const showInputError = (formElemtent, inputElement, errorMessage, config) => {
  const errorSpansID = Array.from(
    formElemtent.querySelectorAll(`#${inputElement.id}-error`)
  );
  // console.log(errorSpansID);
  errorSpansID.forEach((errorID) => {
    console.log(errorID);
    errorID.textContent = errorMessage;
  });
  inputElement.classList.add(config.inputErrorClass);
};

const hideInputError = (formElemtent, inputElement, config) => {
  const errorSpansID = Array.from(
    formElemtent.querySelectorAll(`#${inputElement.id}-error`)
  );
  errorSpansID.forEach((errorID) => {
    errorID.textContent = "";
  });
  inputElement.classList.remove(config.inputErrorClass);
};

const checkInputValidity = (formElemtent, inputElement, config) => {
  if (!inputElement.validity.valid) {
    showInputError(
      formElemtent,
      inputElement,
      inputElement.validationMessage,
      config
    );
  } else {
    hideInputError(formElemtent, inputElement, config);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement, config);
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;
  }
};
export const disableButton = (buttonElement, config) => {
  buttonElement.classList.add(config.inactiveButtonClass);
  buttonElement.disabled = true;
};
export const resetValidation = (formElemtent, inputList, config) => {
  inputList.forEach((input) => {
    hideInputError(formElemtent, input, config);
  });
};

const setEventListeners = (formElemtent, config) => {
  const inputList = Array.from(
    formElemtent.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElemtent.querySelector(config.submitButtonSelector);
  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElemtent, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

export const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);

  formList.forEach((formElemtent) => {
    setEventListeners(formElemtent, config);
  });
  console.log(formList);
};
enableValidation(settings);
