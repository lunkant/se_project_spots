import "./index.css";
import Api from "../utils/Api.js";
import {
  enableValidation,
  settings,
  disableButton,
  resetValidation,
} from "../scripts/validation.js";
import { renderLoading } from "../utils/helpers.js";
// Cards

// API stuff

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "fb9e8441-77a4-4b80-b0d8-a66199f20bbc",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userData]) => {
    // render cards from server
    cards.forEach((card) => {
      const cardElement = getCardElement(card);
      cardsList.append(cardElement);
    });

    // render user info
    profileAvatarEl.src = userData.avatar;
    profileAvatarEl.alt = userData.name;
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
  })
  .catch(console.error);

// query

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
const editProfileSubmitButton = editProfileModal.querySelector(
  "#edit-modal-submit-button"
);

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

const newPostButton = document.querySelector(".profile__add-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseButton = newPostModal.querySelector(".modal__close-button");
const newPostForm = newPostModal.querySelector("#new-post-modal-form");
const newPostCardImageInputLink =
  newPostForm.querySelector("#card-image-input");
const newPostCardImageCaption = newPostForm.querySelector(
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
  ".modal__close-button_type_preview"
);
const previewImageElement = previewModal.querySelector(
  ".modal__image_type_preview"
);
const previewModalCaptionElement = previewModal.querySelector(
  ".modal__caption_type_preview"
);

// edit avatar modal
const editAvatarModal = document.querySelector("#avatar-modal");
const editAvatarModalForm = editAvatarModal.querySelector("#edit-avatar-form");
const editAvatarCloseBtn = editAvatarModal.querySelector(
  ".modal__close-button"
);
const editAvatarSubmitBtn = document.querySelector(
  "#edit-avatar-submit-button"
);

const editAvatarBtn = document.querySelector(".profile__avatar-btn");
// card element stuff
let selectedCard, selectedCardId;

// are you sure you want to delete image modal
const deleteModal = document.querySelector("#delete-modal");
const deleteModalButton = deleteModal.querySelector("#delete-modal-btn");
const deleteModalCancelButton = deleteModal.querySelector(
  "#delete-modal-cancel-btn"
);
const deleteModalCloseBtn = deleteModal.querySelector(
  "#delete-modal-close-btn"
);

deleteModalCancelButton.addEventListener("click", () => {
  closeModals(deleteModal);
});
deleteModalCloseBtn.addEventListener("click", () => {
  closeModals(deleteModal);
});

function handleDeleteCard(cardElement, cardId) {
  // deletes modal when user is sure about the deletion clicks delete a second time
  selectedCard = cardElement;
  selectedCardId = cardId;

  deleteModalButton.addEventListener("click", (evt) => {
    const deleteButton = evt.currentTarget;

    renderLoading(true, deleteButton, "Delete");

    api
      .deleteCard(selectedCardId)
      .then(() => {
        selectedCard.remove();
        closeModals(deleteModal);
      })
      .catch(console.error)
      .finally(() => {
        renderLoading(false, deleteButton, "Delete"); // restore button
      });
  });
}
// delete card add like to card or delete like to card from the server stuff

function handleCardLikeButton(evt, cardId) {
  const likeButton = evt.target; // the button that was clicked

  // 1. Check whether the card is currently liked or not
  const isCurrentlyLiked = likeButton.classList.contains(
    "card__like-button_active"
  );

  api
    .addRemoveLikeToCard(cardId, isCurrentlyLiked)

    .then(() => {
      likeButton.classList.toggle("card__like-button_active");
    })

    .catch((err) => {
      console.error("Error updating like:", err);
    });
}

function handleCardImagePreview(data) {
  previewModalCaptionElement.textContent = data.name;
  previewImageElement.src = data.link;
  previewImageElement.alt = data.name;
}
function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButtonElement = cardElement.querySelector(".card__like-button");
  const cardDeleteTrashButtonElement = cardElement.querySelector(
    ".card__delete-button"
  );

  cardTitleElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  //card Like Button.
  if (data.isLiked) {
    cardLikeButtonElement.classList.add("card__like-button_active");
  }
  cardLikeButtonElement.addEventListener("click", (evt) => {
    handleCardLikeButton(evt, data._id);
  });

  cardDeleteTrashButtonElement.addEventListener("click", () => {
    openModal(deleteModal);
    handleDeleteCard(cardElement, data._id);
  });

  cardImageElement.addEventListener("click", () => {
    handleCardImagePreview(data);
    openModal(previewModal);
  });

  return cardElement;
}
// open close profile Modal
// Preview Modal
previewModalCloseButton.addEventListener("click", () => {
  closeModals(previewModal);
});

// closes modals when the user click on the empty space around the modal

function handleEmptySpaceClick(evt) {
  if (evt.target === evt.currentTarget) {
    closeModals(evt.currentTarget); // closes whichever modal was clicked
  }
}
const modalsArr = [
  editProfileModal,
  newPostModal,
  previewModal,
  editAvatarModal,
  deleteModal,
];
modalsArr.forEach((modal) => {
  modal.addEventListener("click", handleEmptySpaceClick);
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
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      closeModals(openedModal);
    }
  }
}

// edit avatar modle stuff
function handleEditAvatarSubmit(evt) {
  evt.preventDefault();
  const avatarUrl = editAvatarModalForm.querySelector(
    "#profile-avatar-input"
  ).value;
  const submitBtn = evt.submitter;
  renderLoading(true, submitBtn);
  api
    .editUserAvatar(avatarUrl)
    .then((data) => {
      profileAvatarEl.src = data.avatar; // update UI
      editAvatarModalForm.reset();
      disableButton(editAvatarSubmitBtn, settings);

      closeModals(editAvatarModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitBtn);
    });
}
editAvatarBtn.addEventListener("click", () => {
  openModal(editAvatarModal);
});

editAvatarCloseBtn.addEventListener("click", () => {
  closeModals(editAvatarModal);
});

editAvatarModalForm.addEventListener("submit", handleEditAvatarSubmit);

//edit profile
function openEditProfileModalsandFillInputs() {
  editProfileModal.classList.add("modal_is-opened");
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  document.addEventListener("keydown", handleEscClose);
}

editProfileButton.addEventListener("click", () => {
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );
  openEditProfileModalsandFillInputs();
});

editProfileCloseButton.addEventListener("click", () => {
  closeModals(editProfileModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const name = editProfileNameInput.value;
  const about = editProfileDescriptionInput.value;
  const submitBtn = evt.submitter;
  renderLoading(true, submitBtn);
  api
    .editUserInfo({ name, about })
    .then((updatedUser) => {
      profileNameEl.textContent = updatedUser.name;
      profileDescriptionEl.textContent = updatedUser.about;
      disableButton(editProfileSubmitButton, settings);

      closeModals(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitBtn);
    });
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

  const name = newPostCardImageCaption.value.trim();
  const link = newPostCardImageInputLink.value.trim();
  const submitBtn = evt.submitter;
  renderLoading(true, submitBtn);
  api
    .addCard(name, link)
    .then((newCardELFromServer) => {
      const cardElement = getCardElement(newCardELFromServer);
      cardsList.prepend(cardElement); // render the new card

      newPostForm.reset();
      disableButton(newPostSubmitButton, settings);

      closeModals(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitBtn);
    });
}

newPostForm.addEventListener("submit", handleNewPostSubmit);

enableValidation(settings);
