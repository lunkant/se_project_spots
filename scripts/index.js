// Cards
const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

// query
const modalBackground = document.querySelector(".modal");

const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseButton = editProfileModal.querySelector(
  ".modal__close-button"
);
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const editProfileForm = editProfileModal.querySelector(
  "#edit-profile-modal-form"
);
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const newPostButton = document.querySelector(".profile__add-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseButton = newPostModal.querySelector(".modal__close-button");
const newPostForm = newPostModal.querySelector("#new-post-modal-form");
const newPostCardImageInputLink =
  newPostModal.querySelector("#card-image-input");
const newPostCardImageCaption = newPostModal.querySelector(
  "#card-image-caption"
);
const newPostSubmitButton = newPostModal.querySelector(".modal__submit-button");
const cardsList = document.querySelector(".cards__list");
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

//preview Modal
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close_type_preview-button"
);
const previewImageElement = previewModal.querySelector(
  ".modal__image_type_preview"
);
const previewModalCaptionElement = previewModal.querySelector(
  ".modal__caption_type_preview"
);

const getCardElement = (data) => {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButtonElement = cardElement.querySelector(".card__like-button");
  const cardDeleteButtonElement = cardElement.querySelector(
    ".card__delete-button"
  );

  cardTitleElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  cardLikeButtonElement.addEventListener("click", () => {
    cardLikeButtonElement.classList.toggle("card__like-button_active");
  });
  cardDeleteButtonElement.addEventListener("click", () => {
    cardElement.remove();
  });
  cardImageElement.addEventListener("click", () => {
    previewModalCaptionElement.textContent = data.name;
    previewImageElement.src = data.link;
    previewImageElement.alt = data.name;
    openModal(previewModal);
  });

  return cardElement;
};
// open close profile Modal
// Preview Modal
previewModalCloseButton.addEventListener("click", () => {
  closeModals(previewModal);
});

// closes modals when the user click on the empty space around the modal
editProfileModal.addEventListener("click", (evt) => {
  if (evt.target === evt.currentTarget) {
    // parent only
    closeModals(editProfileModal);
  }
});
newPostModal.addEventListener("click", (evt) => {
  if (evt.target === evt.currentTarget) {
    // parent only
    closeModals(newPostModal);
  }
});
previewModal.addEventListener("click", (evt) => {
  if (evt.target === evt.currentTarget) {
    // parent only
    closeModals(previewModal);
  }
});

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModals(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}
// Close modal with ESC key
function handleEscClose(evt) {
  if (evt.key === "Escape") {
    closeModals(newPostModal);
    closeModals(editProfileModal);
    closeModals(previewModal);
  }
}

//edit profile
function openEditProfileModalsandFillInputs() {
  editProfileModal.classList.add("modal_is-opened");
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  document.addEventListener("keydown", handleEscClose);
}

editProfileButton.addEventListener("click", () => {
  resetValidation(editProfileForm, [
    editProfileNameInput,
    editProfileDescriptionInput,
  ]);
  openEditProfileModalsandFillInputs();
});

editProfileCloseButton.addEventListener("click", () => {
  closeModals(editProfileModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  closeModals(editProfileModal);
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

// New Post

newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseButton.addEventListener("click", function () {
  closeModals(newPostModal);
});

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: newPostCardImageCaption.value,
    link: newPostCardImageInputLink.value,
  };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  newPostForm.reset();
  disableButton(newPostSubmitButton);
  closeModals(newPostModal);
}

newPostForm.addEventListener("submit", handleNewPostSubmit);

// looping through the array
initialCards.forEach((card) => {
  const cardElement = getCardElement(card);
  cardsList.append(cardElement);
});
