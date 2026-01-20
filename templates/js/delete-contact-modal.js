import { createModal } from "./modal-builder.js";

export function pushDeleteConfirmModal({
  contactId = "",
  contactName = "",
  onDelete,
}) {
  const displayText = contactName || `#${contactId}`;
  const modal = createModal({
    title: "Delete Contact",
    content: `
      <p>Are you sure you want to delete <strong>${displayText}</strong>?</p>
      <p class="text-sm text-muted-foreground mt-2">This cannot be undone.</p>
    `,
    buttons: `
      <button class="btn btn-outline cancel-btn">Cancel</button>
      <button class="btn btn-destructive confirm-btn">Delete</button>
    `,
  });

  // Attach event handlers
  modal.querySelector(".cancel-btn").addEventListener("click", () => {
    window.app.pop();
  });

  modal.querySelector(".confirm-btn").addEventListener("click", async () => {
    if (typeof onDelete === "function") await onDelete();
    window.app.pop();
  });

  window.app.push(modal);
}
