export function renderLoading(isLoading, buttonEl, defaultText = "Save") {
  if (isLoading) {
    // If this is a delete button → show "Deleting..."
    if (defaultText.toLowerCase() === "delete") {
      buttonEl.textContent = "Deleting...";
    } else {
      buttonEl.textContent = "Saving...";
    }

    buttonEl.disabled = true;
  } else {
    buttonEl.textContent = defaultText; // Restore original button text
    buttonEl.disabled = false;
  }
}
