// Export a function to create and push a delete confirmation modal to the stack
export function pushDeleteConfirmModal({ contactId = "", onDelete }) {
  window.app.push("DeleteConfirm", contactId);

  // Get the modal that was just pushed
  const modalWrapper = window.app.peek();

  // Attach handlers immediately
  modalWrapper.querySelector(".cancel-btn")?.addEventListener("click", () => {
    window.app.pop();
  });

  modalWrapper
    .querySelector(".confirm-btn")
    ?.addEventListener("click", async () => {
      if (typeof onDelete === "function") await onDelete();
      window.app.pop();
    });
}
