// Add Contact Modal usage (with ModalManager and event delegation)
const openEditContactBtn = document.getElementById("openEditContact");
openEditContactBtn.addEventListener("click", () => {
  console.log("Hello");
  window.app.push("EditContact");
  // Attach submit handler for the form
  setTimeout(() => {
    const modal = document.querySelector(".modal-content.edit-contact");
    if (!modal) return;
    const form = modal.querySelector("form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // TODO: integrate with backend create endpoint
      window.app.pop();
    });
  }, 0);
});

// Event delegation for Delete Contact button in EditContact modal
// Opens DeleteConfirm modal

document
  .getElementById("modal-container")
  .addEventListener("click", function (e) {
    const target = e.target;
    if (target.matches('[data-action="delete-contact"]')) {
      window.app.push("DeleteConfirm");
    }
  });
